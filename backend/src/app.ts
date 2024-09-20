import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRouter from './routers/products';
import path from 'path';
import orderRouter from './routers/orders';
import errorHandler from './middleware/error-handler';
import { errorLogger, requestLogger } from './middleware/logger';

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/weblarek')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger);
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use(errorHandler);
app.use(errorLogger);
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});