import { instance } from '../middleware/razorpay.middleware.js';
import { Link } from '../model/link.model.js';

export const createLink = async (req, res) => {
  try {
    const { amount, currency, notes } = req.body;
    const options = {
      amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
      currency,
      notes,
      callback_url: 'http://localhost:3000/success',
      callback_method: 'get',
    };
    const paymentLink = await instance.paymentLink.create(options);
    const paymentLinkData = {
      amount: amount,
      currency: currency,
      notes: notes,
      accept_partial: paymentLink.accept_partial,
      amount_paid: paymentLink.amount_paid,
      id: paymentLink.id,
      short_url: paymentLink.short_url,
      status: paymentLink.status,
    };
    await Link.create(paymentLinkData);
    res.status(201).json({
      status: true,
      message: 'link generated',
      data: paymentLink.short_url,
    });
    console.log('paymentLink', paymentLink);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const cancelLink = async (req, res) => {
  const { paymentLinkId } = req.body;
  instance.paymentLink.cancel(paymentLinkId, (err, data) => {
    if (err) {
      console.log('err', err);
      return res.status(400).send(err);
    } else {
      console.log('data', data);
    }
  });
};
