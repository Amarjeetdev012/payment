import express from 'express';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { dirname, join } from 'path';
import paymentRouter from './routes/payment.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('*', function (req, res) {
  res.json('404 page not found');
});

app.use('/api', paymentRouter);

export default app;
