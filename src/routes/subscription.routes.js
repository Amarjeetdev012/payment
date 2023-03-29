import express from 'express';
import {
  allSubscriptions,
  cancelSubscription,
  createSubscription,
  SubscriptionById,
  verify,
} from '../controllers/subscriptions.controller.js';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', allSubscriptions);
subscriptionRouter.get('/:sub_id', SubscriptionById);

subscriptionRouter.post('/', createSubscription);
subscriptionRouter.post('/verify', verify);
subscriptionRouter.post('/:sub_id/cancel', cancelSubscription);

export default subscriptionRouter;
