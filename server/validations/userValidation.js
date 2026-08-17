import Joi from 'joi';

export const createUserSchema = Joi.object({
  user_name: Joi.string().min(3).max(50).required(),
  user_password: Joi.string().min(4).max(100).required(),
  user_number: Joi.string().allow('', null).optional(),
  role: Joi.string().valid('user', 'seller', 'admin').default('user'),
});

export const updateUserSchema = Joi.object({
  user_name: Joi.string().min(3).max(50).optional(),
  user_password: Joi.string().min(4).max(100).optional(),
  user_number: Joi.string().allow('', null).optional(),
  role: Joi.string().valid('user', 'seller', 'admin').optional(),
});
