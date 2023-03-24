import express from 'express';
import {
  createCustomer,
  createSubscription,
} from '../controllers/user.controller.js';

const userRoute = express.Router();

userRoute.post('/customer', createCustomer);
userRoute.post('/subscription', createSubscription);

export default userRoute;
