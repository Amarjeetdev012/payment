import mongoose from 'mongoose';

const subscriptionsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  entity: {
    type: String,
  },
  plan_id: {
    type: String,
  },
  status: {
    type: String,
  },
  current_start: {
    type: Number,
  },
  current_end: {
    type: Number,
  },
  ended_at: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  period: {
    type: String,
  },
  customer_notify: {
    type: Boolean,
  },
  short_url: {
    type: String,
  },
  remaining_count: {
    type: Number,
  },
});

export const subscriptions = mongoose.model(
  'subscriptions',
  subscriptionsSchema
);
