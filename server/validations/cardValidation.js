import Joi from 'joi';

export const createCardSchema = Joi.object({
  thumbnail: Joi.string().allow('', null).optional(),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required',
  }),
  item_name: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Item name is required',
  }),
  item_desc: Joi.string().allow('', null).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  category_id: Joi.number().integer().positive().allow(null).optional(),
});

export const updateCardSchema = Joi.object({
  thumbnail: Joi.string().allow('', null).optional(),
  price: Joi.number().min(0).optional(),
  item_name: Joi.string().min(2).max(255).optional(),
  item_desc: Joi.string().allow('', null).optional(),
  rating: Joi.number().min(0).max(5).optional(),
  category_id: Joi.number().integer().positive().allow(null).optional(),
});
