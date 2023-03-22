import express from 'express';
import {
  order,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.post('/order', order);
router.post('/verify', verifyPayment);


export default router;
