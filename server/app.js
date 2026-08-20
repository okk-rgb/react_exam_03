import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, User, Category, Card, SwiperImg } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import swiperRoutes from './routes/swiperRoutes.js';
import { setupSwagger } from './swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
setupSwagger(app);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/swiper', swiperRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running smoothly' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Database Sync and Initial Seed Data
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Database connected successfully via Sequelize.');

    // Auto-create/sync tables (drop:false prevents PostgreSQL ENUM "already exists" error on restart)
    await sequelize.sync({ alter: { drop: false } });
    console.log('Database tables synchronized.');

    // Seed default categories if empty
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const defaultCategories = [
        { category_name: 'Smartphones & Tech' },
        { category_name: 'Audio & Music' },
        { category_name: 'Laptops & Computers' },
        { category_name: 'Gaming & Accessories' },
        { category_name: 'Wearables & Watches' },
      ];
      await Category.bulkCreate(defaultCategories);
      console.log('Default categories seeded.');
    }

    // Seed default admin user if empty
    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        user_name: 'admin',
        user_password: hashedPassword,
        user_number: '+1000000000',
        role: 'admin',
      });
      console.log('Default admin user created (username: admin, password: admin123).');
    }

    // Seed default products/cards if empty
    const cardCount = await Card.count();
    if (cardCount === 0) {
      const cat1 = await Category.findOne({ where: { category_name: 'Audio & Music' } });
      const cat2 = await Category.findOne({ where: { category_name: 'Wearables & Watches' } });
      const cat3 = await Category.findOne({ where: { category_name: 'Smartphones & Tech' } });

      const defaultCards = [
        {
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          price: 199.99,
          item_name: 'Wireless Noise-Canceling Headphones',
          item_desc: 'Immersive sound quality with 30 hours battery life and active noise cancellation.',
          rating: 4.8,
          category_id: cat1 ? cat1.id : null,
        },
        {
          thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          price: 249.50,
          item_name: 'Futuristic Fitness Smartwatch',
          item_desc: 'Track heart rate, sleep, oxygen levels, and GPS workout routes.',
          rating: 4.9,
          category_id: cat2 ? cat2.id : null,
        },
        {
          thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
          price: 899.00,
          item_name: 'Next-Gen Ultra Smartphone',
          item_desc: 'High refresh rate display, 108MP camera, and lightning fast 5G connectivity.',
          rating: 4.7,
          category_id: cat3 ? cat3.id : null,
        },
      ];
      await Card.bulkCreate(defaultCards);
      console.log('Default cards/products seeded.');
    }

    // Seed default swiper images if empty
    const swiperCount = await SwiperImg.count();
    if (swiperCount === 0) {
      await SwiperImg.bulkCreate([
        { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200' },
        { url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200' },
      ]);
      console.log('Default swiper images seeded.');
    }
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.log('Ensure PostgreSQL service is running and database exists.');
  }
};

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger UI Documentation available at http://localhost:${PORT}/api-docs`);
  await initDatabase();
});

export default app;
