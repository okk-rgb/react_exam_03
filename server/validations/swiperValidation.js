import Joi from 'joi';

export const createSwiperSchema = Joi.object({
  url: Joi.string().required().messages({
    'string.empty': 'Image URL is required',
  }),
});

export const updateSwiperSchema = Joi.object({
  url: Joi.string().optional(),
});
