import { instance } from '../middleware/razorpay.middleware.js';

export const orders = (req, res) => {
  try {
    let orders;
    instance.orders.all({}, function (err, data) {
      if (err) {
        return res.status(400).send(err);
      } else {
        orders = data;
      }
      return res.status(200).send({ status: false, message: 'orders', orders });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const payments = async (req, res) => {
  try {
    let payments;
    instance.payments.all({ count: 100 }, function (error, payment) {
      if (error) {
        return res.status(400).send(error);
      } else {
        payments = payment;
      }
      res.render('allPayment', { payments });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
