import express from 'express';
import authRouter from './auth.routes.js';
import paymentRouter from './payment.routes.js';
import userRoute from './user.routes.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/payment', paymentRouter);
router.use('/user', userRoute);

export default router;
