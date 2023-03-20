import axios from 'axios';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { key_id } from '../config.js';
import { instance } from '../middleware/razorpay.middleware.js';

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount),
      currency: 'INR',
    };
    const order = await instance.orders.create(options);
    console.log('order', order);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).send('server error');
  }
};

export const payment = async (req, res) => {
  try {
    const { amount } = req.body;
    var options = {
      key: key_id, // Enter the Key ID generated from the Dashboard
      amount: Number(amount), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'USD',
      name: 'Acme Corp',
      order_id: 'order_LTkXaNQ977hZaE', //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    };

    var rzp1 = new Razorpay(options);
    console.log('rzp1', rzp1);
    rzp1.on('payment.failed', function (response) {
        console.log('hello hello');
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    return res.status(200).send('payment done ');
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const paymentVerification = async (req, res) => {
  try {
    console.log('testererjbej');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const data = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_APT_SECRET)
      .update(data.toString())
      .digest('hex');
    const isAuthentic = expectedSignature === razorpay_signature;
    if (isAuthentic) {
      // Database comes here
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
      res.redirect(
        `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send('server error');
  }
};
