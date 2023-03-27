import { instance } from "../middleware/razorpay.middleware.js";
import { Customer } from "../model/customer.model.js";

export const createCustomer = async (req, res) => {
  try {
    let data = req.body;
    const { name, email, contact, gstin } = data;
    const customer = await instance.customers.create({ name, email, contact });
    const saveData = {
      id: customer.id,
      entity: customer.entity,
      name: customer.name,
      email: customer.email,
      contact: customer.contact,
    };
    data.id = customer.id;
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
