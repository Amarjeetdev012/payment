import express from 'express';
import { validAdmin } from '../auth/auth.js';
import { cancelLink, createLink } from '../controllers/linkController.js';
import {
  order,
  orders,
  payments,
  successResponse,
  updatePayment,
  verifyOrder,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const paymentRouter = express.Router();

// handle payment and order
paymentRouter.get('/order/:id', verifyOrder);
paymentRouter.get('/payments', payments);
paymentRouter.get('/orders', orders);
paymentRouter.get('/success', successResponse);

paymentRouter.post('/order', order);
paymentRouter.post('/payment', updatePayment);
paymentRouter.post('/verify', verifyPayment);
paymentRouter.post('/success', successResponse);

// handle link
paymentRouter.post('/link', createLink);
paymentRouter.post('/cancellink', cancelLink);

export default paymentRouter;
