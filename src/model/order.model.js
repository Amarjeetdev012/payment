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
      type: Boolean,
    },
    amount_due: {
      type: String,
    },
    currency: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
