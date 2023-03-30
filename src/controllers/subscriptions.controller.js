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
    console.log('subscription', subscription);
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

export const allPlans = (req, res) => {
  try {
    instance.plans.all({}, (err, data) => {
      if (err) {
        return res.status(400).send({ status: true, message: err });
      }
      console.log('data', typeof data);
      return res.render('plans', { data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const plansById = (req, res) => {
  try {
    let id = req.query.id;
    console.log('id', id);
    instance.plans.fetch(id, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .send({ status: true, message: 'plan  details', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const updateSubscription = (req, res) => {
  try {
    let id = req.params.id || req.query.id;
    instance.subscriptions.update(id, {}, (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      return res
        .status(200)
        .send({ status: true, message: 'subscription updated', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const pauseSubscription = (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    instance.subscriptions.pause(
      id,
      {
        pause_at: 'now',
      },
      (err, data) => {
        if (err) {
          return res.status(400).send({ status: false, message: err });
        }
        return res
          .status(200)
          .send({ status: true, message: 'subscription paused', data });
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const resumeSubscription = (req, res) => {
  try {
    const id = req.params.id || req.query.id;
    instance.subscriptions.resume(
      id,
      {
        resume_at: 'now',
      },
      (err, data) => {
        if (err) {
          return res.status(400).send({ status: false, message: err });
        }
        return res
          .status(200)
          .send({ status: true, message: 'subscription paused', data });
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const subscriptionInvoices = (req, res) => {
  try {
    console.log('data', req.query.id);
    const id = req.query.id;
    instance.invoices.all(
      {
        id,
      },
      (err, data) => {
        if (err) {
          return res.status(400).send({ status: false, message: err });
        }
        return res
          .status(200)
          .send({ status: true, message: 'subscription invoices', data });
      }
    );
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};
