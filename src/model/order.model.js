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
      type: String,
    },
    amount_paid: {
      type: String,
    },
    amount_due: {
      type: String,
    },
    currency: {
      type: String,
      enum: ['INR', 'USD'],
    },
    receipt: {
      type: String,
    },
    offer_id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
