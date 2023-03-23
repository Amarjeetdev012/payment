import express from 'express';
import { validAdmin } from '../auth/auth.js';
import { orders, payments } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/orders', validAdmin, orders);
userRouter.get('/payments',validAdmin, payments);

export default userRouter;
