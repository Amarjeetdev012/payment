import crypto from 'crypto';
import { key_secret } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';
import { History } from '../model/history.model.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';
import { validatePaymentVerification } from '../utils/razorpay.utils.js';

export const order = async (req, res) => {
  try {
    const { amount } = req.body;
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
    res.render('payment', {
      data: order,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    let expectedSignature;
    let data;
    const paymentRequest = req.body.payload.payment.entity;
    if (req.body.event === 'payment.captured') {
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
      };
      const payment = await Payment.create(paymentData);
      console.log('payment done');
      return res
        .status(200)
        .send({ status: true, message: 'payment successfully' });
    } else {
     return await History.create(paymentRequest);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// export const failPayment = async (req, res) => {
//   try {
//     const paymentRequest = req.body.payload.payment.entity;
//     if (req.body.event === 'payment.failed') {
//     }
//     const razorpayOrderId = paymentRequest.order_id;
//     const razorpayPaymentId = paymentRequest.id;
//     const paymentData = {
//       razorpay_payment_id: razorpayPaymentId,
//       entity: paymentRequest.entity,
//       amount: paymentRequest.amount,
//       currency: paymentRequest.currency,
//       status: paymentRequest.status,
//       razorpay_order_id: razorpayOrderId,
//       method: paymentRequest.method,
//     };
//     const payment = await Payment.create(paymentData);
//     console.log('payment', payment);
//     console.log('payment failed');
//     return res.status(400).send({ status: false, message: 'payment failed' });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };

// export const webhookCallback = async (req, res) => {
//   try {
//     const paymentRequest = req.body.payload.payment.entity;
//     console.log('payment', paymentRequest);
//     console.log('webhook >>>>>>>>>>>>>>>>>>>>>>>>', paymentRequest);

//     const historyData = await History.create(paymentRequest);
//     if (paymentRequest.status === 'captured') {
//     }
//     return res.status(400).send({ status: false, message: 'payment failed' });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };
