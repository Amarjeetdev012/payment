import express from 'express';
import { cancelLink, createLink } from '../controllers/linkController.js';
import {
  allPayments,
  order,
  successResponse,
  updatePayment,
  verifyOrder,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const router = express.Router();

// handle payment and order
// get all payments
router.get('/payments', allPayments);
router.get('/order', (req, res) => {
  res.redirect('https://razorpay-ahec.onrender.com/');
});
router.get('/success', (req, res) => {
  res.redirect('https://razorpay-ahec.onrender.com');
});
router.get('/order/:id', verifyOrder);
// create order
router.post('/order', order);
// update order and create success and history of payment
router.post('/payment', updatePayment);
// verify payment using order id and payment id
router.post('/verify', verifyPayment);
router.post('/success', successResponse);

// handle link
// create standard link
router.post('/link', createLink);
router.post('/cancellink', cancelLink);

export default router;
