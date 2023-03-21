import crypto from 'crypto';
import { key_secret } from '../config.js';

import { instance } from '../middleware/razorpay.middleware.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount*100),
      currency: 'INR',
    };
    const order = await instance.orders.create(options);
    const orderData = await Order.create(order);
    // res.status(200).send({ status: true, orderData });
    return res.render('payment', { data: orderData });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const paymentVerification = async (req, res) => {
  try {
    console.log('req', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const data = razorpay_order_id + '|' + razorpay_payment_id;
    console.log('razorpay_signature', razorpay_signature);
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(data.toString())
      .digest('hex');
    console.log('expectedSignature', expectedSignature);
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // Database comes here
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      return res
        .status(200)
        .send({ status: true, message: 'payment successfully' });
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};
