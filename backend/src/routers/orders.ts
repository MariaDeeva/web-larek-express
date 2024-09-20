import { createOrderValidator } from '../middleware/validations';
import createOrder from '../controllers/orders';
import express from 'express';

const router = express.Router();

router.post('/order', createOrderValidator, createOrder);

export default router;