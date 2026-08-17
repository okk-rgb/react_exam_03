import { SwiperImg } from '../models/index.js';

export const getAllSwipers = async (req, res, next) => {
  try {
    const swipers = await SwiperImg.findAll({ order: [['id', 'ASC']] });
    res.json({ success: true, count: swipers.length, swipers });
  } catch (error) {
    next(error);
  }
};

export const getSwiperById = async (req, res, next) => {
  try {
    const swiper = await SwiperImg.findByPk(req.params.id);
    if (!swiper) {
      return res.status(404).json({ success: false, message: 'Swiper image not found' });
    }
    res.json({ success: true, swiper });
  } catch (error) {
    next(error);
  }
};

export const createSwiper = async (req, res, next) => {
  try {
    const { url } = req.body;
    const swiper = await SwiperImg.create({ url });
    res.status(201).json({ success: true, message: 'Swiper image created successfully', swiper });
  } catch (error) {
    next(error);
  }
};

export const updateSwiper = async (req, res, next) => {
  try {
    const swiper = await SwiperImg.findByPk(req.params.id);
    if (!swiper) {
      return res.status(404).json({ success: false, message: 'Swiper image not found' });
    }
    const { url } = req.body;
    if (url) swiper.url = url;
    await swiper.save();
    res.json({ success: true, message: 'Swiper image updated successfully', swiper });
  } catch (error) {
    next(error);
  }
};

export const deleteSwiper = async (req, res, next) => {
  try {
    const swiper = await SwiperImg.findByPk(req.params.id);
    if (!swiper) {
      return res.status(404).json({ success: false, message: 'Swiper image not found' });
    }
    await swiper.destroy();
    res.json({ success: true, message: 'Swiper image deleted successfully' });
  } catch (error) {
    next(error);
  }
};
