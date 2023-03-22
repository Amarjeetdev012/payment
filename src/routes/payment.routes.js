import express from 'express';
import {
  createOrder,
  failPayment,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/checkout', createOrder);
router.post('/fail', failPayment);
router.post('/paymentverify', verifyPayment);

export default router;
