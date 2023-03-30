import crypto from 'crypto';
import { key_secret } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';
import { History } from '../model/history.model.js';
import { Link } from '../model/link.model.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';
import { validatePaymentVerification } from '../utils/razorpay.utils.js';
import { QrCode } from '../model/qrCode.js';

export const updatePayment = async (req, res) => {
  try {
    let expectedSignature;
    let data;
    const paymentRequest = req.body.payload.payment.entity;
    if (req.body.event === 'payment.captured') {
      const findOrder = await Order.findOne({ id: paymentRequest.order_id });
      if (findOrder && findOrder.amount_due === 0) {
        return res.status(400).send('payment already done for this order id');
      }
      data = paymentRequest.order_id + '|' + paymentRequest.id;
      expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(data.toString())
        .digest('hex');
      const razorpayOrderId = paymentRequest.order_id;
      const razorpayPaymentId = paymentRequest.id;
      const signature = expectedSignature;
      const result = validatePaymentVerification(
        { razorpayOrderId, razorpayPaymentId },
        signature,
        key_secret
      );
      if (!result) {
        return res.status(400).send({
          status: false,
          message: 'failed payment or unauthorized payment',
        });
      }
      if (paymentRequest.description) {
        const description = paymentRequest.description.slice(1);
        const id = `plink_${description}`;
        const link = await Link.findOne({ id: id });
        if (link) {
          await Link.findOneAndUpdate(
            { id: id },
            { status: 'paid', amount_paid: link.amount }
          );
        }
      }
      await Order.findOneAndUpdate(
        { id: razorpayOrderId },
        {
          status: 'paid',
          amount_due: 0,
          amount_paid: paymentRequest.amount,
          payment_id: razorpayPaymentId,
        }
      );
      const paymentData = {
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: signature,
        entity: paymentRequest.entity,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        status: paymentRequest.status,
        razorpay_order_id: razorpayOrderId,
        invoice_id: paymentRequest.invoice_id,
        method: paymentRequest.method,
        acquirer_data: paymentRequest.acquirer_data,
        description: paymentRequest.description,
      };
      await Payment.create(paymentData);
      console.log('payment done');
      return res.render('home');
    } else {
      await History.create(paymentRequest);
      return res.render('home');
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const payment = await instance.payments.fetch(payment_id);
    const { amount, currency } = payment;
    if (payment.order_id !== order_id || payment.status !== 'captured') {
      return res.status(400).send('Invalid payment');
    }
    res.status(200).send(`Payment successful of amount ${amount} ${currency}`);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const successResponse = async (req, res) => {
  res.redirect('https://razorpay-ahec.onrender.com');
};

// fetch all payments
export const payments = (req, res) => {
  try {
    let payments;
    instance.payments.all({}, function (err, payment) {
      if (err) {
        return res.status(400).send(err);
      } else {
        payments = payment;
      }
      res.render('payments', { payments });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// create qr code
export const createQr = async (req, res) => {
  try {
    const data = req.body;
    const { name, customerId, description } = data;
    const qrCode = await instance.qrCode.create({
      type: 'upi_qr',
      name: name,
      usage: 'multiple_use',
      fixed_amount: false,
      description: description,
      customer_id: customerId,
      notes: {
        purpose: 'Test UPI QR Code notes',
      },
    });
    const result = await QrCode.create(qrCode);
    return res.redirect(result.image_url);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// close qr code by id
export const closeQr = async (req, res) => {
  try {
    let id = req.body.qr_id;
    const qr = await QrCode.findOne({ id: id });
    if (qr.status === 'closed') {
      return res
        .status(200)
        .send({ status: false, message: 'this qr is already closed' });
    }
    const qrcode = await instance.qrCode.close(id);
    if (qrcode.status === 'closed') {
      await QrCode.findOneAndUpdate(
        { id: id },
        { status: 'closed' },
        { new: true }
      );
    }
    return res.status(200).json({ status: true, message: 'qrcode closed' });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// fetch all qr codes
export const allQr = async (req, res) => {
  instance.qrCode.all({}, (err, data) => {
    if (err) {
      return res.status(400).send({ status: false, message: err });
    }
    res.render('qrcodes', { qrcodes: data });
  });
};

// Fetches a qrode given QrCode ID
export const qrcodeFetch = async (req, res) => {
  try {
    const id = req.query.qr_id;
    instance.qrCode.fetch(id, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res.status(200).send({ status: true, message: 'qr code', data });
    });
  } catch (error) {
    return res.status(200).json({ status: true, message: 'all qr code', data });
  }
};

// Get all qrcodes of customer
export const qrCodeCustomerId = async (req, res) => {
  try {
    const customer_id = req.query.customer_id;
    instance.qrCode.all({ customer_id: customer_id }, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .send({ status: true, message: 'customer qr codes', data });
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error });
  }
};

// Fetch Payments for a QR Code

export const qrId = async (req, res) => {
  try {
    const qr_id = req.query.qr_id;
    const qrPayments = await instance.qrCode.fetchAllPayments(qr_id);
    return res
      .status(200)
      .json({ status: true, message: 'all qr code data', qrPayments });
  } catch (error) {
    return res.status(500).json({ status: false, message: error });
  }
};
