import express from 'express';
import {
  allCustomer,
  createCustomer,
  customerData,
  editCustomer,
} from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.get('/', allCustomer);
customerRouter.get('/:id', customerData);
customerRouter.post('/', createCustomer);
customerRouter.patch('/:id', editCustomer);

export default customerRouter;
