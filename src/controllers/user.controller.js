import { instance } from '../middleware/razorpay.middleware.js';
import { Customer } from '../model/customer.model.js';
import { Plan } from '../model/plan.model.js';

export const createSubscription = async (req, res) => {
  try {
    let data = req.body;
    const {
      period,
      interval,
      item: { name, amount, currency, description },
    } = data;
    console.log('data', data);
    const plan = await instance.plans.create({
      period,
      interval,
      item: {
        name,
        amount,
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
      quantity: 5,
      total_count: plan.interval,
    });

    return res.status(200).send({
      status: true,
      message: 'Subscription created',
      subscriptionData,
    });
  } catch (error) {
    return res
      .status(500)
      .send({ status: false, message: error, url: subscription.short_url });
  }
};

export const createCustomer = async (req, res) => {
  try {
    let data = req.body;
    const { name, email, contact } = data;
    const customer = await instance.customers.create({ name, email, contact });
    const saveData = {
      id: customer.id,
      entity: customer.entity,
      name: customer.name,
      email: customer.email,
      contact: customer.contact,
    };
    await Customer.create(saveData);
    res
      .status(201)
      .send({ status: true, message: 'customer created successfully', data });
  } catch (error) {
    return res
      .status(Number(`${error.statusCode}`))
      .send({ status: false, message: error });
  }
};
