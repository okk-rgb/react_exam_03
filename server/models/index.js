import sequelize from '../config/database.js';
import User from './User.js';
import Category from './Category.js';
import Card from './Card.js';
import CartInfo from './CartInfo.js';
import HeartInfo from './HeartInfo.js';
import SwiperImg from './SwiperImg.js';

// Associations

// Category <-> Card
Category.hasMany(Card, { foreignKey: 'category_id', as: 'cards', onDelete: 'SET NULL' });
Card.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User <-> Card (Seller upload)
User.hasMany(Card, { foreignKey: 'user_id', as: 'uploadedCards', onDelete: 'SET NULL' });
Card.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

// User <-> CartInfo
User.hasMany(CartInfo, { foreignKey: 'user_id', as: 'cartItems', onDelete: 'CASCADE' });
CartInfo.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Card <-> CartInfo
Card.hasMany(CartInfo, { foreignKey: 'card_id', as: 'inCarts', onDelete: 'CASCADE' });
CartInfo.belongsTo(Card, { foreignKey: 'card_id', as: 'card' });

// User <-> HeartInfo (Wishlist)
User.hasMany(HeartInfo, { foreignKey: 'user_id', as: 'favorites', onDelete: 'CASCADE' });
HeartInfo.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Card <-> HeartInfo
Card.hasMany(HeartInfo, { foreignKey: 'card_id', as: 'favoritedBy', onDelete: 'CASCADE' });
HeartInfo.belongsTo(Card, { foreignKey: 'card_id', as: 'card' });

export {
  sequelize,
  User,
  Category,
  Card,
  CartInfo,
  HeartInfo,
  SwiperImg,
};
