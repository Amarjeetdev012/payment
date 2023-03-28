import { instance } from '../middleware/razorpay.middleware.js';
import { Link } from '../model/link.model.js';

export const createLink = async (req, res) => {
  try {
    const { amount, currency, notes, name, email, contact } = req.body;
    const options = {
      amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
      currency,
      notes,
      callback_url: 'https://razorpay-ahec.onrender.com/success',
      callback_method: 'get',
      customer: {
        name: name,
        email: email,
        contact: contact,
      },
      notify: {
        sms: true,
        email: true,
      },
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
  } catch (error) {
    res.status(500).send(error);
  }
};

export const cancelLink = async (req, res) => {
  const { paymentLinkId } = req.body;
  instance.paymentLink.cancel(paymentLinkId, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    } else {
    }
  });
};

export const allLinks = (req, res) => {
  instance.paymentLink.all({}, (err, data) => {
    if (err) {
      return res.status(400).send({ status: false, message: err });
    }
    return res.status(200).send({ status: true, message: 'all links', data });
  });
};

export const linkData = (req, res) => {
  const id = req.params.id;
  instance.paymentLink.fetch(id, (err, data) => {
    if (err) {
      return res.status(400).send({ status: false, message: err });
    }
    return res.status(200).send({ status: true, message: 'link data', data });
  });
};

export const resendLink = (req, res) => {
  const { id, medium } = req.params;
  instance.paymentLink.fetch()
  instance.paymentLink.notifyBy(id, medium, (err, data) => {
    if (err) {
      return res.send(400).send({ status: false, message: err });
    }
    console.log('data', data);
    return res.status(200).send({ status: true, message: 'link resend', data });
  });
};
