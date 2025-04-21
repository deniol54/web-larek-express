import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';
import router from './routes';

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(errors());

// напишите код здесь
mongoose.connect(DB_ADDRESS);

app.use('/product', router, errorHandler);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});
