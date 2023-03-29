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
  customer_id: {
    type: String,
  },
  total_count: {
    type: String,
  },
  customer_notify: {
    type: Boolean,
  },
  start_at: {
    type: String,
  },
  quantity: {
    type: String,
  },
  notes: {
    type: String,
  },
  addons: {
    type: String,
  },
  status: {
    type: String,
  },
  paid_count: {
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
  charge_at: {
    type: Number,
  },
  auth_attempts: {
    type: Number,
  },
  expire_by: {
    type: Number,
  },
  addons: [
    {
      item: {
        name: {
          type: String,
        },
        amount: {
          type: Number,
        },
        currency: {
          type: String,
        },
      },
    },
  ],
  offer_id: {
    type: String,
  },
  notes: {
    type: Object,
  },
  short_url: {
    type: String,
  },
  has_scheduled_changes: {
    type: Boolean,
  },
  schedule_change_at: {
    type: String,
  },
  remaining_count: {
    type: Number,
  },
});

export const Subscriptions = mongoose.model(
  'subscriptions',
  subscriptionsSchema
);
