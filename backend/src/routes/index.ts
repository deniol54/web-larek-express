import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import { getProducts, createProduct } from '../controllers/product';
import { productSchema } from '../middlewares/validations';

const router = Router();

const productRouteValidator = celebrate({
  [Segments.BODY]: productSchema,
}, {
  abortEarly: false, // Возвращать все ошибки, а не только первую
});

router.get('/', getProducts);
router.post('/', productRouteValidator, createProduct);

export default router;
