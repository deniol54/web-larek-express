import Joi from 'joi';
import { ObjectId } from 'mongodb';
import product from '../models/product';

const checkTitle = async (title: string) => {
  const res = await product.find({ title });
  return res.length === 0;
};

const checkProducts = async (productIds: string[]) => {
  const res = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  return res.length === productIds.length;
};

const checkPrice = async (productIds: string[]) => {
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
// Создание схемы Joi
export const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required()
    .external(checkTitle),
  category: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().allow(null),
  image: Joi.object({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }).required(),
});

export const orderSchema = Joi.object({
  items: Joi.array().items(Joi.string().external(checkProducts)).required(),
  total: Joi.number().external(checkPrice).required(),
  payment: Joi.string().allow('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/(?:\+|\d)[\d\-()]{9,}\d/).required(),
  address: Joi.string().required(),
});
