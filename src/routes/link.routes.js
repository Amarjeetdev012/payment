import express from 'express';
import { cancelLink, createLink } from '../controllers/linkController.js';

const linkRouter = express.Router();

linkRouter.post('/create', createLink);
linkRouter.post('/cancel', cancelLink);

export default linkRouter;
