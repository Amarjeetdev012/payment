import express from 'express';
import { order, orders, verifyOrder } from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.get('/orders', orders);
orderRouter.get('/:id', verifyOrder);

orderRouter.post('/order', order);

export default orderRouter;
