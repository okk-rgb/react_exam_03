import { CartInfo, Card } from '../models/index.js';

export const getCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const cartItems = await CartInfo.findAll({
      where: { user_id },
      include: [{ model: Card, as: 'card' }],
      order: [['id', 'ASC']],
    });

    let totalPrice = 0;
    let totalItems = 0;

    const formattedItems = cartItems.map((item) => {
      const price = item.card ? parseFloat(item.card.price) : 0;
      const subtotal = price * item.quantity;
      totalPrice += subtotal;
      totalItems += item.quantity;

      return {
        id: item.id,
        user_id: item.user_id,
        card_id: item.card_id,
        quantity: item.quantity,
        subtotal: subtotal,
        card: item.card,
      };
    });

    res.json({
      success: true,
      count: formattedItems.length,
      total_items: totalItems,
      total_price: Number(totalPrice.toFixed(2)),
      cart: formattedItems,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { card_id, quantity = 1 } = req.body;

    const card = await Card.findByPk(card_id);
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card/Product not found' });
    }

    let cartItem = await CartInfo.findOne({ where: { user_id, card_id } });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartInfo.create({ user_id, card_id, quantity });
    }

    const updatedItem = await CartInfo.findByPk(cartItem.id, {
      include: [{ model: Card, as: 'card' }],
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      cartItem: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartInfo.findOne({ where: { id, user_id } });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: 'Cart quantity updated',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const cartItem = await CartInfo.findOne({ where: { id, user_id } });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const getCartTotal = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const cartItems = await CartInfo.findAll({
      where: { user_id },
      include: [{ model: Card, as: 'card' }],
    });

    let totalPrice = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
      if (item.card) {
        const price = parseFloat(item.card.price) || 0;
        totalPrice += price * item.quantity;
        totalItems += item.quantity;
      }
    });

    res.json({
      success: true,
      total_items: totalItems,
      total_price: Number(totalPrice.toFixed(2)),
    });
  } catch (error) {
    next(error);
  }
};

export const buyCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const cartItems = await CartInfo.findAll({
      where: { user_id },
      include: [{ model: Card, as: 'card' }],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    let totalPrice = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
      if (item.card) {
        const price = parseFloat(item.card.price) || 0;
        totalPrice += price * item.quantity;
        totalItems += item.quantity;
      }
    });

    // Clear cart after checkout
    await CartInfo.destroy({ where: { user_id } });

    res.json({
      success: true,
      message: 'Purchase completed successfully! Thank you for buying.',
      receipt: {
        order_id: `ORD-${Date.now()}`,
        total_items: totalItems,
        total_price: Number(totalPrice.toFixed(2)),
        purchased_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};
