import express from 'express';
import {
  allLinks,
  cancelLink,
  createLink,
  linkData,
  resendLink,
} from '../controllers/linkController.js';

const linkRouter = express.Router();

linkRouter.get('/payment_links', allLinks);
linkRouter.get('/payment_links/:id', linkData);

linkRouter.post('/payment_links', createLink);
// resend link
linkRouter.post('/payment_links/:id/notify_by/:medium', resendLink);
linkRouter.post('/cancel', cancelLink);

export default linkRouter;
