import express from 'express';
import {
  allPlans,
  allSubscriptions,
  cancelSubscription,
  createSubscription,
  pauseSubscription,
  plansById,
  resumeSubscription,
  SubscriptionById,
  subscriptionInvoices,
  updateSubscription,
  verify,
} from '../controllers/subscriptions.controller.js';

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', allSubscriptions);

subscriptionRouter.get('/plans', allPlans);
subscriptionRouter.get('/plans/:id', plansById);
subscriptionRouter.get('/:sub_id', SubscriptionById);
subscriptionRouter.get('/invoices?subscription_id=:sub_id', subscriptionInvoices);

subscriptionRouter.post('/', createSubscription);
subscriptionRouter.post('/:sub_id/pause', pauseSubscription);
subscriptionRouter.post('/:sub_id/resume', resumeSubscription);
subscriptionRouter.post('/verify', verify);
subscriptionRouter.post('/:sub_id/cancel', cancelSubscription);

subscriptionRouter.patch('/subscriptions/:sub_id', updateSubscription);

export default subscriptionRouter;
