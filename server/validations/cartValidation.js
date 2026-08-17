import Joi from 'joi';

export const addToCartSchema = Joi.object({
  card_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Product card ID must be a number',
    'any.required': 'Product card ID is required',
  }),
  quantity: Joi.number().integer().min(1).default(1),
});

export const updateCartQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
  }),
});
