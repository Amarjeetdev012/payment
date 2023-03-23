import express from 'express';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import { dirname, join } from 'path';
import router from './routes/index.js';

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

app.get('/link', (req, res) => {
  res.render('link');
});

app.get('/success', (req, res) => {
  res.render('success');
});

app.use('/api', router);

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found on the server</h1>');
});

// app.get('*', function (req, res) {
//   res.json('404 page not found');
// });

export default app;
