import express from 'express';
import {
  createOrder,
  payment,
  paymentVerification,
} from '../controllers/payment.controllers.js';

const router = express.Router();

router.get('/payment', (req, res) => {
  res.render('index');
});

router.post('/checkout', createOrder);
router.post('/payment', payment);
router.post('/paymentverify', paymentVerification);

export default router;
