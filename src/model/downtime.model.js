import mongoose from 'mongoose';

const downtimeSchema = new mongoose.Schema(
  {
    entity: {
      type: String,
    },
    count: {
      type: Number,
    },
    items: [
      {
        id: {
          type: String,
        },
        entity: {
          type: String,
          default: 'payment.downtime',
        },
        method: {
          type: String,
          enum: ['card', 'netbanking', 'wallet', 'upi'],
        },
        begin: {
          type: Number,
        },
        end: {
          type: Number,
          default: null,
        },
        status: {
          type: String,
          enum: ['scheduled', 'started', 'resolved', 'cancelled'],
        },
        scheduled: {
          type: Boolean,
        },
        severity: {
          type: String,
          enum: ['high', 'medium', 'low'],
        },
        instrument: {
          type: String,
        },
        bank: {
          type: String,
        },
        network: {
          type: String,
          enum: ['AMEX', 'DICL', 'MC', 'RUPAY', 'VISA', 'ALL'],
        },
        psp: {
          type: String,
          enum: ['google_pay', 'phonepe', 'paytm', 'bhim'],
        },
        vpa_handle: {
          type: String,
        },
        wallet: {
          type: String,
        },
        created_at: {
          type: Number,
        },
        updated_at: {
          type: Number,
        },
        card_type: {
          type: String,
          enum: ['credit', 'debit'],
        },
      },
    ],
  },
  { timestamps: true }
);

export const Downtime = mongoose.model('Downtime', downtimeSchema);
