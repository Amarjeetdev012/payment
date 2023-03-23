import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    razorpay_payment_id: {
      type: String,
    },
    entity: {
      type: String,
    },
    currency: {
      type: String,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    method: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('payment', paymentSchema);
