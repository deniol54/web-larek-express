import { Router, Request, Response } from 'express';
import getProducts from '../controllers/product';

const router = Router();
router.get('/', getProducts);

export default router;
