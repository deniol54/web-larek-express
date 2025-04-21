import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const checkTotal = async (productIds: string[]) => {
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
  return res[0]?.totalSum || 0;
};

const checkPrice = async (productIds: string[]) => {
  const res = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  for (const product of res) {
    if (!product.price) {
      return product._id;
    }
  }
  return null;
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { items, total } = req.body;
  const validTotal = await checkTotal(items);
  if (validTotal !== total) {
    return next(new BadRequestError('Неверная сумма заказа'));
  }
  const noBuyId = await checkPrice(items);
  if (noBuyId) {
    return next(new BadRequestError(`Товар с id ${noBuyId} не продается`));
  }
  const id = faker.string.uuid();
  return res.status(200).send({ id, total });
};

export default createOrder;
