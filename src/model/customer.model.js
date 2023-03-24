import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    entity: {
      type: String,
    },
    name: { type: String },
    contact: { type: Number },
    email: { type: String },
    notes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model('customer', customerSchema);
