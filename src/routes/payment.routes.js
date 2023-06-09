import express from 'express';
// import { validAdmin } from '../auth/auth.js';
import { cancelLink, createLink } from '../controllers/linkController.js';
import {
  allQr,
  closeQr,
  createQr,
  downtime,
  payments,
  qrCodeCustomerId,
  qrcodeFetch,
  qrId,
  successResponse,
  updatePayment,
  verifyPayment,
} from '../controllers/payment.controllers.js';

const paymentRouter = express.Router();

// handle payment and order
paymentRouter.get('/payments', payments);
paymentRouter.get('/payments/downtimes', downtime);
paymentRouter.get('/success', successResponse);

paymentRouter.post('/payment', updatePayment);
paymentRouter.post('/verify', verifyPayment);
paymentRouter.post('/success', successResponse);

// qr code
paymentRouter.get('/qr_codes', allQr);
paymentRouter.get('/qr_codes/customer', qrCodeCustomerId);
paymentRouter.get('/qr_codes/:qr_id/payments', qrId);
paymentRouter.get('/qr_codes/:qr_id', qrcodeFetch);

paymentRouter.post('/qr_codes', createQr);
paymentRouter.post('/qr_codes/:qr_id/close', closeQr);

// handle link
paymentRouter.post('/link', createLink);
paymentRouter.post('/cancellink', cancelLink);

export default paymentRouter;
