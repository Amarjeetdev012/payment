import express from 'express';
import { login, register } from '../auth/auth.js';
import { loginSchema, registerSchema } from '../middleware/ajv.middleware.js';
import validateSchema from '../utils/ajv.utils.js';

const authRouter = express.Router();

authRouter.post('/register', validateSchema(registerSchema), register);
authRouter.post('/login', validateSchema(loginSchema), login);

export default authRouter;
