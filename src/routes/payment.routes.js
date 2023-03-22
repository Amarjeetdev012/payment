import express from 'express';
import {
  failPayment,
  payment,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/payment', payment);
router.post('/fail', failPayment);
router.post('/verify', verifyPayment);

export default router;
