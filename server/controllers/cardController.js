import { Card, Category, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllCards = async (req, res, next) => {
  try {
    const { category_id, search, min_price, max_price } = req.query;
    const where = {};

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where.item_name = { [Op.iLike]: `%${search}%` };
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    const cards = await Card.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'category_name'] },
        { model: User, as: 'seller', attributes: ['id', 'user_name', 'role'] },
      ],
      order: [['id', 'DESC']],
    });

    res.json({ success: true, count: cards.length, cards });
  } catch (error) {
    next(error);
  }
};

export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'category_name'] },
        { model: User, as: 'seller', attributes: ['id', 'user_name', 'role'] },
      ],
    });

    if (!card) {
      return res.status(404).json({ success: false, message: 'Card/Product not found' });
    }

    res.json({ success: true, card });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const { thumbnail, price, item_name, item_desc, rating, category_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category_id: Category does not exist' });
      }
    }

    const card = await Card.create({
      thumbnail,
      price,
      item_name,
      item_desc,
      rating: rating || 5.0,
      category_id,
      user_id,
    });

    res.status(201).json({ success: true, message: 'Card/Product created successfully', card });
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card/Product not found' });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && card.user_id && card.user_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own products' });
    }

    const { thumbnail, price, item_name, item_desc, rating, category_id } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category_id' });
      }
      card.category_id = category_id;
    }

    if (thumbnail !== undefined) card.thumbnail = thumbnail;
    if (price !== undefined) card.price = price;
    if (item_name !== undefined) card.item_name = item_name;
    if (item_desc !== undefined) card.item_desc = item_desc;
    if (rating !== undefined) card.rating = rating;

    await card.save();

    res.json({ success: true, message: 'Card/Product updated successfully', card });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card/Product not found' });
    }

    // Check ownership if not admin or seller
    const isOwner = card.user_id && card.user_id.toString() === req.user.id.toString();
    const isSellerOrAdmin = req.user.role === 'seller' || req.user.role === 'admin';

    if (!isSellerOrAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own products' });
    }

    await card.destroy();
    res.json({ success: true, message: 'Card/Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
