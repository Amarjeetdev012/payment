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
    invoice_id: {
      type: String,
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
    international: {
      type: Boolean,
    },
    refund_status: {
      type: String,
    },
    amount_refunded: {
      type: String,
    },
    captured: {
      type: String,
    },
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    fee: {
      type: Number,
    },

    tax: {
      type: Number,
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

    notes: {
      type: String,
    },

    created_at: {
      type: String,
    },

    card_id: {
      type: String,
    },

    card: {
      type: String,
    },

    bank: {
      type: String,
    },

    vpa: {
      type: String,
    },

    wallet: {
      type: String,
    },

    acquirer_data: [
      {
        rrn: {
          type: String,
        },
        arn: {
          type: String,
        },

        auth_code: {
          type: String,
        },

        authentication_reference_number: {
          type: String,
        },
        upi_transaction_id: {
          type: String,
        },
        bank_transaction_id: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Payment = mongoose.model('payment', paymentSchema);
