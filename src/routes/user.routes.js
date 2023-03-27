import express from 'express';
import {
  createCustomer,
  createQr,
  createSubscription,
} from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.post('/customer', createCustomer);
userRoute.post('/subscription', createSubscription);
userRoute.post('/qrCode',createQr );

export default userRoute;
