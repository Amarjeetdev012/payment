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
    type: Date,
  },
  current_end: {
    type: Date,
  },
  ended_at: {
    type: Date,
  },
  quantity: {
    type: Number,
  },
  notes: {
    type: [String],
  },
  charge_at: {
    type: Date,
  },
  start_at: {
    type: Date,
  },
  end_at: {
    type: Date,
  },
  auth_attempts: {
    type: Number,
  },
  total_count: {
    type: Number,
  },
  paid_count: {
    type: Number,
  },
  customer_notify: {
    type: Boolean,
  },
  created_at: {
    type: Date,
  },
  expire_by: {
    type: Date,
  },
  short_url: {
    type: String,
  },
  has_scheduled_changes: {
    type: Boolean,
  },
  change_scheduled_at: {
    type: Date,
  },
  source: {
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
