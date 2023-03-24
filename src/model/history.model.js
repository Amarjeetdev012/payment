import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    invoice_id: {
      type: String,
    },
    international: {
      type: Boolean,
    },
    method: {
      type: String,
    },
    amount_refunded: {
      type: Number,
    },
    refund_status: {
      type: String,
    },
    captured: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    card_id: {
      type: String,
    },
    bank: {
      type: String,
    },
    wallet: {
      type: String,
    },
    vpa: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    notes: {
      type: [String],
    },
    fee: {
      type: String,
    },
    tax: {
      type: String,
    },
    error_code: {
      type: String,
    },
    error_description: {
      type: String,
    },
    error_source: {
      type: String,
    },
    error_step: {
      type: String,
    },
    error_reason: {
      type: String,
    },
    acquirer_data: {
     type:String
    },
    order_id: {
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

export const History = mongoose.model('history', historySchema);
