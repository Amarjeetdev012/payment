import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  amount: {
    type: Number,
  },
  currency: {
    type: String,
  },
  amount_paid: {
    type: String,
  },
  accept_partial: {
    type: Boolean,
  },
  id: {
    type: String,
  },
  cancelled_at: {
    type: Boolean,
  },
  expired_at: {
    type: Boolean,
  },
  first_min_partial_amount: {
    type: Number,
  },
  description: {
    type: String,
  },
  customer: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: Number,
    },
  },
  notify: {
    sms: {
      type: Boolean,
    },
    email: {
      type: Boolean,
    },
  },
  reminder_enable: {
    type: Boolean,
  },
  notes: {
    type: String,
  },
  reminders: {
    type: String,
  },
  short_url: {
    type: String,
  },
  status: {
    type: String,
  },
  upi_link: {
    type: String,
  },
});

export const Link = mongoose.model('link', linkSchema);
