import crypto from 'crypto';
import { key_secret } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from '../utils/razorpay.utils.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100),
      currency: 'INR',
    };
    const order = await instance.orders.create(options);
    order.amount = amount;
    const orderData = await Order.create(order);
    return res.render('payment', { data: orderData });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// export const paymentVerification = async (req, res) => {
//   try {
//     let data;
//     let expectedSignature;
//     if (req.body.event === 'payment.captured') {
//       data =
//         req.body.payload.payment.entity.order_id +
//         '|' +
//         req.body.payload.payment.entity.id;
//       expectedSignature = crypto
//         .createHmac('sha256', key_secret)
//         .update(data.toString())
//         .digest('hex');
//       const result = {};
//       result.razorpay_order_id = data.split('|')[0];
//       result.razorpay_payment_id = data.split('|')[1];
//       result.razorpay_signature = expectedSignature;
//       instance.payments.fetch(data.split('|')[0], '', (err, data) => {
//         if (err) {
//           return res.status(400).send({ status: false, message: err });
//         }
//         console.log('data', data);
//       });
//       await Order.findOneAndUpdate(
//         { id: req.body.payload.payment.entity.order_id },
//         { amount_paid: true, amount_due: 0, status: 'paid' }
//       );
//       await Payment.create(result);
//       return res
//         .status(200)
//         .send({ status: true, message: 'payment successfully' });
//     }
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };

export const failPayment = (req, res) => {
  if (req.body.event === 'payment.failed') {
    return res.status(400).send({ status: false, message: 'payment failed' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    let expectedSignature;
    let data;
    if (req.body.event === 'payment.captured') {
      data =
        req.body.payload.payment.entity.order_id +
        '|' +
        req.body.payload.payment.entity.id;
      expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(data.toString())
        .digest('hex');
    }
    const razorpayOrderId = data.split('|')[0];
    const razorpayPaymentId = data.split('|')[1];
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
    await Order.findOneAndUpdate(
      { id: razorpayOrderId },
      { amount_paid: true, amount_due: 0, status: 'paid' }
    );
    const paymentData = {};
    paymentData.razorpay_order_id = razorpayOrderId;
    paymentData.razorpay_payment_id = razorpayPaymentId;
    paymentData.razorpay_signature = signature;
    await Payment.create(paymentData);
    console.log('payment done');
    return res
      .status(200)
      .send({ status: true, message: 'payment successfully' });
  } catch (error) {
    return res.status(500).send(error);
  }
};
