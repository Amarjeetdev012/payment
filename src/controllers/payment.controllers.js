import crypto from 'crypto';
import { key_secret } from '../config.js';

import { instance } from '../middleware/razorpay.middleware.js';
import { Order } from '../model/order.model.js';
import { Payment } from '../model/payment.model.js';

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
    console.log('orderData', orderData);
    return res.render('payment', { data: orderData });
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
      const order = await Order.findOne({id:razorpay_order_id})
      if(!order){return res.status(400).send({status:false,message:'your payment time expired try again'})}
    const data = razorpay_order_id + '|' + razorpay_payment_id;
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
      await Order.findOneAndUpdate(
        { id: razorpay_order_id },
        { amount_paid: true, amount_due: 0, status: 'paid' }
      );
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
