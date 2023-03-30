import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    entity: {
      type: String,
    },
    interval: { type: Number },
    period: {
      type: String,
    },
    item: {
      id: {
        type: String,
      },
      active: {
        type: Boolean,
      },
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      amount: { type: Number },
      unit_amount: { type: Number },
      currency: {
        type: String,
      },
      type: {
        type: String,
      },
      unit: {
        type: String,
      },
      tax_inclusive: {
        type: Boolean,
      },
      hsn_code: {
        type: String,
      },
      sac_code: {
        type: String,
      },
      tax_rate: {
        type: String,
      },
      tax_id: {
        type: String,
      },
      tax_group_id: {
        type: String,
      },
      created_at: {
        type: Number,
      },
      updated_at: {
        type: Number,
      },
    },
    notes: [
      {
        type: String,
      },
    ],
    created_at: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.model('plan', planSchema);
