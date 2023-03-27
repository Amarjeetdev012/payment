import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: { type: String },
    contact: { type: Number },
    email: { type: String },
    gstin: { type: String },
    notes: {
      type: [String],
    },
    created_at: { type: String },
    entity: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model('customer', customerSchema);
