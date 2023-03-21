import express from 'express';
import {
  createOrder,
  paymentVerification,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/checkout', createOrder);
router.post('/paymentverify', paymentVerification);

export default router;
