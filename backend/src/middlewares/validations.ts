import Joi from 'joi';
import { ObjectId } from 'mongodb';
import product from '../models/product';

const checkProducts = async (productIds: string[], helpers: Joi.CustomHelpers) => {
  const res = await product.find({
    _id: { $in: productIds.map((id) => new ObjectId(id)) },
  });
  const resIds = res.map((res) => res._id.toString());
  for (const id of productIds) {
    if (!(resIds.includes(id))) {
      return helpers.error('any.invalid', {
        message: `Товар с id ${id} не найден`,
      });
    }
  }
  return productIds;
};

// Создание схемы Joi
export const productSchema = Joi.object({
  title: Joi.string().min(2).max(30).required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().allow(null),
  image: Joi.object({
    fileName: Joi.string(),
    originalName: Joi.string(),
  }).required(),
});

export const orderSchema = Joi.object({
  items: Joi.array().items(Joi.string()).external(checkProducts).required(),
  total: Joi.number().required(),
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/(?:\+|\d)[\d\-()]{9,}\d/).required(),
  address: Joi.string().required(),
});
