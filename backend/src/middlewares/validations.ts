import Joi from 'joi';

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
  items: Joi.array().items(Joi.string()).required(),
  total: Joi.number().required(),
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/(?:\+|\d)[\d\-()]{9,}\d/).required(),
  address: Joi.string().required(),
});
