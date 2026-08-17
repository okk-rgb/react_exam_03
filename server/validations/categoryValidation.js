import Joi from 'joi';

export const createCategorySchema = Joi.object({
  category_name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Category name is required',
  }),
});

export const updateCategorySchema = Joi.object({
  category_name: Joi.string().min(2).max(100).optional(),
});
