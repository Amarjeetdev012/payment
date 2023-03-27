import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },

    entity: {
      type: String,
    },

    created_at: {
      type: Number,
    },

    name: {
      type: String,
    },

    usage: {
      type: String,
    },

    type: {
      type: String,
    },

    image_url: {
      type: String,
    },

    payment_amount: {
      type: Number,
    },

    status: {
      type: String,
    },

    description: {
      type: String,
    },

    fixed_amount: {
      type: Boolean,
    },

    payments_amount_received: {
      type: Number,
    },

    payments_count_received: {
      type: Number,
    },

    notes: {
      type: Object,
    },

    customer_id: {
      type: String,
    },

    close_by: {
      type: Number,
    },

    closed_at: {
      type: Number,
    },

    close_reason: {
      type: String,
    },
  },
  { timestamps: true }
);

export const QrCode = mongoose.model('qrcode', qrSchema);
