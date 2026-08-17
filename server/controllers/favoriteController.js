import { HeartInfo, Card } from '../models/index.js';

export const getFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const favorites = await HeartInfo.findAll({
      where: { user_id },
      include: [{ model: Card, as: 'card' }],
      order: [['id', 'DESC']],
    });

    res.json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { card_id } = req.body;

    const card = await Card.findByPk(card_id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card/Product not found' });
    }

    let favorite = await HeartInfo.findOne({ where: { user_id, card_id } });
    if (favorite) {
      return res.status(400).json({ success: false, message: 'Item already in favorites' });
    }

    favorite = await HeartInfo.create({ user_id, card_id });
    const fullFav = await HeartInfo.findByPk(favorite.id, {
      include: [{ model: Card, as: 'card' }],
    });

    res.status(201).json({
      success: true,
      message: 'Item added to favorites',
      favorite: fullFav,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { card_id } = req.params;

    const favorite = await HeartInfo.findOne({ where: { user_id, card_id } });
    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite item not found' });
    }

    await favorite.destroy();
    res.json({ success: true, message: 'Item removed from favorites' });
  } catch (error) {
    next(error);
  }
};
