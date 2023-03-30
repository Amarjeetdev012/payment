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
subscriptionRouter.get('/invoices', subscriptionInvoices);
subscriptionRouter.get('/:sub_id', SubscriptionById);

subscriptionRouter.post('/', createSubscription);
subscriptionRouter.post('/pause', pauseSubscription);
subscriptionRouter.post('/resume', resumeSubscription);
subscriptionRouter.post('/verify', verify);
subscriptionRouter.post('/:sub_id/cancel', cancelSubscription);

subscriptionRouter.patch('/subscriptions/:sub_id', updateSubscription);

export default subscriptionRouter;
