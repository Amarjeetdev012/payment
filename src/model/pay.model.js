import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
    },
    signature: {
      type: String,
    },
    receipt: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Pay = mongoose.model('Pay', paymentSchema);
