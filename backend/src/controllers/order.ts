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
    return missingIds[0];
  }
  return 0;
};

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
  const products = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  const missingIds = products.filter((prod) => prod.price === null);
  if (missingIds.length) {
    return missingIds[0]._id;
  }
  return 0;
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { items, total } = req.body;
  const missId = await checkProducts(items);
  if (missId) {
    return next(new BadRequestError(`Товар с id ${missId} не найден`));
  }
  const noBuyId = await checkPrice(items);
  if (noBuyId) {
    return next(new BadRequestError(`Товар с id ${noBuyId} не продается`));
  }
  const validTotal = await checkTotal(items);
  if (validTotal !== total) {
    return next(new BadRequestError('Неверная сумма заказа'));
  }
  const id = faker.string.uuid();
  return res.status(200).send({ id, total });
};

export default createOrder;
