import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (req: Request, res: Response, next: NextFunction) => product.find({})
  .then((products) => res.send({ items: products, total: products.length }))
  .catch(() => next());

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    description, image, title, category, price,
  } = req.body;
  return product.create({
    description, image, title, category, price,
  })
    .then((film) => res.status(201).send({ data: film }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error instanceof Error && error.message.includes('E11000')) {
        next(new ConflictError(error.message));
      } else {
        next();
      }
    });
};
