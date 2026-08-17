import Joi from 'joi';

export const registerSchema = Joi.object({
  user_name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
  }),
  user_password: Joi.string().min(4).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 4 characters',
  }),
  user_number: Joi.string().allow('', null).optional(),
  role: Joi.string().valid('user', 'seller', 'admin').default('user'),
});

export const loginSchema = Joi.object({
  user_name: Joi.string().required().messages({
    'string.empty': 'Username is required',
  }),
  user_password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});
