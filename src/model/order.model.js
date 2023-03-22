import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    entity: {
      type: String,
    },
    amount: {
      type: Number,
    },
    amount_paid: {
      type: Number,
    },
    amount_due: {
      type: Number,
    },
    currency: {
      type: String,
    },
    receipt: {
      type: String,
    },
    status: {
      type: String,
    },
    payment_id: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('order', orderSchema);
