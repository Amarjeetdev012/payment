import express from 'express';
import authRouter from './auth.routes.js';
import customerRouter from './customer.routes.js';
import linkRouter from './link.routes.js';
import orderRouter from './order.routes.js';
import paymentRouter from './payment.routes.js';
import subscriptionRouter from './subscription.routes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/payment', paymentRouter);
router.use('/customer', customerRouter);
router.use('/link', linkRouter);
router.use('/order', orderRouter);
router.use('/subscribe', subscriptionRouter);

export default router;
