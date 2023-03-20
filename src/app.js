import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import paymentRouter from './routes/payment.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api', paymentRouter);

export default app;
