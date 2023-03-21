import express from 'express';
import {
  createOrder,
  failPayment,
  paymentVerification,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/checkout', createOrder);
router.post('/fail', failPayment);
router.post('/paymentverify', paymentVerification);

export default router;
