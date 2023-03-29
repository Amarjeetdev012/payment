import { instance } from '../middleware/razorpay.middleware.js';
import { Link } from '../model/link.model.js';

export const createLink = async (req, res) => {
  try {
    const { amount, currency, expire_by, notes, name, email, contact } =
      req.body;
    const options = {
      amount: amount * 100, // Razorpay amount is in paisa, so multiply by 100
      currency,
      notes,
      callback_url: 'https://razorpay-ahec.onrender.com/success',
      callback_method: 'get',
      expire_by,
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
      customer: paymentLink.customer,
      notify: paymentLink.notify,
      short_url: paymentLink.short_url,
      expire_by: paymentLink.expire_by,
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
  const paymentLinkId = req.params.id;
  instance.paymentLink.cancel(paymentLinkId, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send({ status: true, message: 'payment cancelled' });
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
  instance.paymentLink.fetch();
  instance.paymentLink.notifyBy(id, medium, (err, data) => {
    if (err) {
      return res.send(400).send({ status: false, message: err });
    }
    return res.status(200).send({ status: true, message: 'link resend', data });
  });
};

export const updateLink = async (req, res) => {
  try {
    const id = req.params.id;
    const { expire_by } = req.body;
    const link = await instance.paymentLink.fetch(id);
    if (link.status === 'paid') {
      return res
        .status(400)
        .send({ status: false, message: 'cant update paid link' });
    }
    instance.paymentLink.edit(
      id,
      {
        reference_id: Math.random().toString(36).substring(2, 9),
        expire_by: expire_by,
      },
      (err, data) => {
        if (err) {
          return res.status(400).send({ status: false, message: err });
        }
        return res
          .status(200)
          .send({ status: true, message: 'link updated', data });
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};
