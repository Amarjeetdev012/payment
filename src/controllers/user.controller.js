import { instance } from '../middleware/razorpay.middleware.js';
import { Customer } from '../model/customer.model.js';
import { Plan } from '../model/plan.model.js';

export const createSubscription = async (req, res) => {
  try {
    let data = req.body;
    const {
      period,
      interval,
      total_count,
      quantity,
      item: { name, amount, currency, description },
    } = data;
    const plan = await instance.plans.create({
      period,
      interval,
      item: {
        name,
        amount:amount*100,
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
      quantity: quantity,
      total_count: total_count,
    });
    return res.redirect(`${subscription.short_url}`);
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
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
