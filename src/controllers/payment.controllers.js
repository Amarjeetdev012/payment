import crypto from 'crypto';
import { key_secret } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';
import { History } from '../model/history.model.js';
import { Link } from '../model/link.model.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';
import { validatePaymentVerification } from '../utils/razorpay.utils.js';

export const order = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= -1 || amount == '0') {
      return res.status(400).json({
        status: false,
        message: 'Minimum transaction amount allowed is Re 1',
      });
    }
    const options = {
      amount: amount * 100,
      receipt: 'receipt_' + Date.now(),
    };
    const order = await instance.orders.create(options);
    const orderData = {
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    };
    await Order.create(orderData);
    return res.redirect(
      `https://razorpay-ahec.onrender.com/api/order/${order.id}`
    );
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const verifyOrder = async (req, res) => {
  let id = req.params.id;
  const order = await instance.orders.fetch(id);
  if (order && order.status === 'paid') {
    return res.redirect('https://razorpay-ahec.onrender.com');
  }
  const dbOrder = await Order.findOne({ id: id });
  if (dbOrder && dbOrder.status === 'paid') {
    return res.redirect('https://razorpay-ahec.onrender.com');
  }
  res.render('payment', { data: order });
};

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
        method: paymentRequest.method,
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

export const allPayments = async (req, res) => {
  try {
    let payments;
    instance.payments.all({ count: 100 }, function (error, payment) {
      if (error) {
        return res.status(400).send(error);
      } else {
        payments = payment;
      }
      res.render('allPayment', { payments });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const successResponse = async (req, res) => {
  res.redirect('https://razorpay-ahec.onrender.com');
};
