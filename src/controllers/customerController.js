import { instance } from '../middleware/razorpay.middleware.js';
import { Customer } from '../model/customer.model.js';

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

export const editCustomer = async (req, res) => {
  const id = req.params.id;
  const { name, contact, email } = req.body;
  instance.customers.edit(
    id,
    {
      name: name,
      email: email,
      contact: contact,
    },
    async (err, data) => {
      if (err) {
        return res.status(400).send({ status: false, message: err });
      }
      await Customer.findOneAndUpdate(
        { id: id },
        {
          name: name,
          email: email,
          contact: contact,
        }
      );
      const sendData = {
        name,
        email,
        contact,
      };
      return res
        .status(200)
        .send({ status: true, message: 'customer updated', sendData });
    }
  );
};

export const allCustomer = async (req, res) => {
  try {
    instance.customers.all({}, (err, data) => {
      if (err) {
        return res.status(400).send({ status: true, message: err });
      }
      const result = data.items.map((customer) => {
        const customerData = {
          name: customer.name,
          email: customer.email,
          contact: customer.contact,
        };
        return customerData;
      });
      data.items = result;
      return res
        .status(200)
        .json({ status: false, message: 'all customers', data });
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error });
  }
};

export const customerData = async (req, res) => {
  const id = req.params.id;
  instance.customers.fetch(id, (err, data) => {
    if (err) {
      return res.status(400).send({ status: false, message: err });
    }
    const customerData = {
      name: data.name,
      email: data.email,
      contact: data.contact,
    };
    return res
      .status(200)
      .send({ status: true, message: 'customer data', customerData });
  });
};
