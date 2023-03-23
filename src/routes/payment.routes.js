import express from 'express';
import { createLink } from '../controllers/linkController.js';
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
// create link
router.post('/link', createLink)

export default router;
