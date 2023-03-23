import { instance } from '../middleware/razorpay.middleware.js';
import { Link } from '../model/link.model.js';

export const createLink = async (req, res) => {
  try {
    const { amount, currency, notes } = req.body;
    const options = {
      amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
      currency,
      notes,
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
    res.send(201).send({
      status: true,
      message: 'link generated',
      data: paymentLink.short_url,
    });
    console.log('paymentLink', paymentLink);
  } catch (error) {
    res.status(500).send(error);
  }
};
