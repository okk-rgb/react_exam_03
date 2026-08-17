import Joi from 'joi';

export const addFavoriteSchema = Joi.object({
  card_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Product card ID must be a number',
    'any.required': 'Product card ID is required',
  }),
});
