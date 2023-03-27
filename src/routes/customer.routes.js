import express from 'express';
import { createCustomer } from '../controllers/customerController.js';

const customerRouter = express.Router();

customerRouter.post('/', createCustomer);

export default customerRouter;
