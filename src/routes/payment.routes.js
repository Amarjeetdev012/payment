import express from 'express';
import { cancelLink, createLink } from '../controllers/linkController.js';
import {
  order,
  successResponse,
  updatePayment,
  verifyOrder,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const paymentRouter = express.Router();

// handle payment and order
// get all payments
paymentRouter.get('/success', (req, res) => {
  res.redirect('https://razorpay-ahec.onrender.com');
});
paymentRouter.get('/order/:id', verifyOrder);
// create order
paymentRouter.post('/order', order);
// update order and create success and history of payment
paymentRouter.post('/payment', updatePayment);
// verify payment using order id and payment id
paymentRouter.post('/verify', verifyPayment);
paymentRouter.post('/success', successResponse);
// handle link
// create standard link
paymentRouter.post('/link', createLink);
paymentRouter.post('/cancellink', cancelLink);

export default paymentRouter;
