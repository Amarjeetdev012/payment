import { config } from 'dotenv';
config();
import { connectDatabase } from './service/mongoose.service.js';
import app from './app.js';
import { port } from './config.js';

connectDatabase();

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
