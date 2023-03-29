import { instance } from '../middleware/razorpay.middleware.js';
import { Order } from '../model/order.model.js';

export const order = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount <= -1 || amount == '0') {
      return res.status(400).json({
        status: false,
        message: 'Minimum transaction amount allowed is Re 1',
      });
    }
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
    return res.redirect(`http://localhost:3000/api/order/${order.id}`);
  } catch (error) {
    return res.status(500).send(error);
  }
};

export const verifyOrder = async (req, res) => {
  let id = req.params.id;
  const order = await instance.orders.fetch(id);
  if (order && order.status === 'paid') {
    return res.redirect('http://localhost:3000');
  }
  const dbOrder = await Order.findOne({ id: id });
  if (dbOrder && dbOrder.status === 'paid') {
    return res.redirect('http://localhost:3000');
  }
  res.render('payment', { data: order });
};

export const orders = (req, res) => {
  try {
    let orders;
    instance.orders.all({}, function (err, data) {
      if (err) {
        return res.status(400).send(err);
      } else {
        orders = data;
      }
      return res.render('orders', { orders });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
