import crypto from 'crypto';
import { key_secret } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';
import { Pay } from '../model/pay.model.js';
import { validatePaymentVerification } from '../utils/razorpay.utils.js';

export const payment = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100,
      receipt: 'receipt_' + Date.now(),
    };
    instance.orders.create(options, async (err, order) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Something went wrong');
      }
      const payment = {
        order_id: order.id,
        amount: order.amount,
        status: 'created',
        created_at: new Date(),
        receipt: order.receipt,
      };
      await Pay.create(payment);
      res.render('payment', {
        data: order,
      });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

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
    const pay = await Pay.findOneAndUpdate(
      { order_id: razorpayOrderId },
      {
        status: 'paid',
        payment_id: razorpayPaymentId,
        signature,
        paid_at: new Date(),
      },
      {
        new: true,
      }
    );
    console.log('pay', pay);
    console.log('payment done');
    return res
      .status(200)
      .send({ status: true, message: 'payment successfully' });
  } catch (error) {
    return res.status(500).send(error);
  }
};
