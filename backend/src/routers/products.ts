import { getAllProducts,createProduct } from '../controllers/products';
import express from 'express';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);

export default router;