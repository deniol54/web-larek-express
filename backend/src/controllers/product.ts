import { Request, Response } from 'express';
import product from '../models/product';

const getProducts = (req: Request, res: Response) => {
  return product.find({})
    .then((products) => res.send({ items: products, total: products.length }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

export default getProducts;
