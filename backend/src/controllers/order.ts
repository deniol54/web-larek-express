import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const checkProducts = async (productIds: string[]) => {
  const products = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  const missingIds = productIds.filter((id) => !products.some((p) => p._id.toString() === id));
  if (missingIds.length) {
    throw new BadRequestError(`Товар с id ${missingIds[0]} не найден`);
  }
  return 0;
};

const checkTotal = async (productIds: string[], total: number) => {
  const res = await product.aggregate([
    {
      $match: {
        _id: { $in: productIds.map((id) => new ObjectId(id)) },
      },
    },
    {
      $group: {
        _id: null,
        totalSum: { $sum: '$price' }, // Суммируем цены
      },
    },
  ]);
  const totalSum = res[0]?.totalSum || 0;
  if ((totalSum !== total)) {
    throw new BadRequestError('Неверная сумма заказа');
  }
  return 0;
};

const checkPrice = async (productIds: string[]) => {
  const products = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  const missingIds = products.filter((prod) => prod.price === null);
  if (missingIds.length) {
    throw new BadRequestError(`Товар с id ${missingIds[0]._id} не продается`);
  }
  return 0;
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body;
    await checkProducts(items);
    await checkPrice(items);
    await checkTotal(items, total);
    const id = faker.string.uuid();
    return res.status(200).send({ id, total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
