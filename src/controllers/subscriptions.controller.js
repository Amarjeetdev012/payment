import { instance } from '../middleware/razorpay.middleware.js';
import { Plan } from '../model/plan.model.js';

export const createSubscription = async (req, res) => {
  try {
    let data = req.body;
    const {
      period,
      interval,
      customer_id,
      total_count,
      quantity,
      item: { name, amount, currency, description },
    } = data;
    const plan = await instance.plans.create({
      period,
      interval,
      item: {
        name,
        amount: amount * 100,
        currency,
        description,
      },
    });
    if (plan) {
      Plan.create(plan);
    }
    const subscription = await instance.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      customer_id: customer_id,
      quantity: quantity,
      total_count: total_count,
    });
    return res.redirect(`${subscription.short_url}`);
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const sub_id = req.params.sub_id;
    const subscription = await instance.subscriptions.cancel(sub_id);
    return res
      .status(200)
      .send({ status: true, message: 'subscription cancelled' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const allSubscriptions = async (req, res) => {
  try {
    instance.subscriptions.all({}, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .json({ status: true, message: 'all subscription', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const SubscriptionById = async (req, res) => {
  try {
    let sub_id = req.params.sub_id;
    instance.subscriptions.fetch(sub_id, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .send({ status: false, message: 'subscription data', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};