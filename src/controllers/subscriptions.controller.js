import { instance } from '../middleware/razorpay.middleware.js';
import { Plan } from '../model/plan.model.js';
import { Subscriptions } from '../model/subscriptions.model.js';

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
    if (subscription) {
      await Subscriptions.create(subscription);
    }
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
    instance.subscriptions.all({ count: 50 }, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res.render('subscriptions', { data: data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

// Fetch a Subscription given Subcription ID
export const SubscriptionById = async (req, res) => {
  try {
    let sub_id = req.query.id;
    instance.subscriptions.fetch(sub_id, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .send({ status: true, message: 'subscription data', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const verify = async (req, res) => {
  try {
    const subscription = req.body.payload.subscription.entity;
    if (
      subscription.status === 'completed' ||
      subscription.status === 'active'
    ) {
      const dbData = await Subscriptions.findOneAndUpdate(
        {
          id: subscription.id,
        },
        {
          paid_count: subscription.paid_count,
          remaining_count: subscription.remaining_count,
          status: subscription.status,
        }
      );
    }
    return res
      .status(200)
      .send({ status: true, message: 'subscription updated' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};
