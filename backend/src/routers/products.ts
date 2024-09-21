import { getAllProducts,createProduct } from '../controllers/products';
import express from 'express';

const router = express.Router();

router.get('/product', getAllProducts);
router.post('/product', createProduct);

export default router;