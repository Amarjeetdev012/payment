import express from 'express';
import { cancelLink, createLink } from '../controllers/linkController.js';
import {
  allPayments,
  order,
  updatePayment,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const router = express.Router();

// handle payment and order
// get all payments
router.get('/payments', allPayments);
// create order
router.post('/order', order);
// update order and create success and history of payment
router.post('/payment', updatePayment);
// verify payment using order id and payment id
router.post('/verify', verifyPayment);

// handle link
// create standard link
router.post('/link', createLink);
router.post('/cancellink', cancelLink);

export default router;
