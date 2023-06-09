import express from 'express';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import helmet from 'helmet';
import methodOverride from 'method-override';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(helmet());
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser());

app.post('/', (req, res) => {
  res.redirect('http://localhost:3000');
});
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/link', (req, res) => {
  res.render('link');
});
app.get('/auth', (req, res) => {
  res.render('auth');
});
app.get('/subscription', (req, res) => {
  res.render('subscription');
});
app.get('/qrcode', (req, res) => {
  res.render('qrcode');
});
app.get('/customer', (req, res) => {
  res.render('customer');
});
app.get('/success', (req, res) => {
  res.render('success');
});
app.get('/payment', (req, res) => {
  res.render('pay');
});

app.use('/api', router);

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something Broke and Unhandled Error');
});

export default app;
