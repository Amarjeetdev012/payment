import mongoose from 'mongoose';
import { mongo_url } from '../config.js';

export const connectDatabase = () => {
  console.log('mongodb is connecting');
  mongoose
    .connect(mongo_url)
    .then(() => {
      console.log('mongodb is connected');
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
};