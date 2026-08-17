import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Marketplace E-Commerce API',
    version: '1.0.0',
    description: 'Complete PostgreSQL & Sequelize API with Auth, Roles, Joi Validations, Categories, Cards, Cart, Favorites, and Swiper',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login or /api/auth/register',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_name: { type: 'string', example: 'john_doe' },
          user_number: { type: 'string', example: '+123456789' },
          role: { type: 'string', enum: ['user', 'seller', 'admin'], example: 'user' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          category_name: { type: 'string', example: 'Electronics' },
        },
      },
      Card: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          thumbnail: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
          price: { type: 'number', example: 99.99 },
          item_name: { type: 'string', example: 'Wireless Headphones' },
          item_desc: { type: 'string', example: 'High quality noise cancelling headphones.' },
          rating: { type: 'number', example: 4.8 },
          category_id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          card_id: { type: 'integer', example: 1 },
          quantity: { type: 'integer', example: 2 },
          subtotal: { type: 'number', example: 199.98 },
        },
      },
      FavoriteItem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          user_id: { type: 'integer', example: 1 },
          card_id: { type: 'integer', example: 1 },
        },
      },
      SwiperImg: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          url: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_name', 'user_password'],
                properties: {
                  user_name: { type: 'string', example: 'john_doe' },
                  user_password: { type: 'string', example: 'password123' },
                  user_number: { type: 'string', example: '+123456789' },
                  role: { type: 'string', enum: ['user', 'seller', 'admin'], example: 'user' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error or username taken' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Sign in to obtain JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_name', 'user_password'],
                properties: {
                  user_name: { type: 'string', example: 'john_doe' },
                  user_password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Signed in successfully' },
          401: { description: 'Invalid username or password' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User profile retrieved' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users (Admin)'],
        summary: 'Get all users',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'List of users' } },
      },
      post: {
        tags: ['Users (Admin)'],
        summary: 'Create a new user',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_name', 'user_password'],
                properties: {
                  user_name: { type: 'string' },
                  user_password: { type: 'string' },
                  user_number: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'seller', 'admin'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'User created' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users (Admin)'],
        summary: 'Get user by ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User profile' } },
      },
      put: {
        tags: ['Users (Admin)'],
        summary: 'Update user or role',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User updated' } },
      },
      delete: {
        tags: ['Users (Admin)'],
        summary: 'Delete user',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'User deleted' } },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        responses: { 200: { description: 'List of categories' } },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create category (Seller/Admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['category_name'],
                properties: { category_name: { type: 'string', example: 'Electronics' } },
              },
            },
          },
        },
        responses: { 201: { description: 'Category created' } },
      },
    },
    '/api/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get category by ID with associated products',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Category details' } },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Category updated' } },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Category deleted' } },
      },
    },
    '/api/cards': {
      get: {
        tags: ['Cards (Products)'],
        summary: 'Get all products with optional filters (category, search, price range)',
        parameters: [
          { name: 'category_id', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'min_price', in: 'query', schema: { type: 'number' } },
          { name: 'max_price', in: 'query', schema: { type: 'number' } },
        ],
        responses: { 200: { description: 'List of cards' } },
      },
      post: {
        tags: ['Cards (Products)'],
        summary: 'Upload / Create a product to sell',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['item_name', 'price'],
                properties: {
                  item_name: { type: 'string', example: 'Smart Watch' },
                  price: { type: 'number', example: 149.99 },
                  thumbnail: { type: 'string', example: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30' },
                  item_desc: { type: 'string', example: 'Waterproof smart fitness tracker watch' },
                  rating: { type: 'number', example: 4.7 },
                  category_id: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Product uploaded to sell' } },
      },
    },
    '/api/cards/{id}': {
      get: {
        tags: ['Cards (Products)'],
        summary: 'Get product by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Product details' } },
      },
      put: {
        tags: ['Cards (Products)'],
        summary: 'Update product',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Product updated' } },
      },
      delete: {
        tags: ['Cards (Products)'],
        summary: 'Delete product',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Product deleted' } },
      },
    },
    '/api/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get logged in user cart with total price calculation',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'User cart items and total price' } },
      },
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['card_id'],
                properties: {
                  card_id: { type: 'integer', example: 1 },
                  quantity: { type: 'integer', example: 1 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Item added to cart' } },
      },
    },
    '/api/cart/total': {
      get: {
        tags: ['Cart'],
        summary: 'Get total price calculation for cart',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Cart total items and total price' } },
      },
    },
    '/api/cart/buy': {
      post: {
        tags: ['Cart'],
        summary: 'Buy / Checkout cart items',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Purchase completed receipt' } },
      },
    },
    '/api/cart/{id}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Quantity updated' } },
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove item from cart',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Item removed from cart' } },
      },
    },
    '/api/favorites': {
      get: {
        tags: ['Favorites / Wishlist'],
        summary: 'Get logged in user favorites',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'List of favorite cards' } },
      },
      post: {
        tags: ['Favorites / Wishlist'],
        summary: 'Add product to favorites',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['card_id'],
                properties: { card_id: { type: 'integer', example: 1 } },
              },
            },
          },
        },
        responses: { 201: { description: 'Item added to favorites' } },
      },
    },
    '/api/favorites/{card_id}': {
      delete: {
        tags: ['Favorites / Wishlist'],
        summary: 'Remove product from favorites',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'card_id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Item removed from favorites' } },
      },
    },
    '/api/swiper': {
      get: {
        tags: ['Swiper Images'],
        summary: 'Get all swiper slider images',
        responses: { 200: { description: 'List of swiper image URLs' } },
      },
      post: {
        tags: ['Swiper Images'],
        summary: 'Create swiper slider image (Admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: { url: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' } },
              },
            },
          },
        },
        responses: { 201: { description: 'Swiper image created' } },
      },
    },
    '/api/swiper/{id}': {
      get: {
        tags: ['Swiper Images'],
        summary: 'Get swiper image by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Swiper image details' } },
      },
      put: {
        tags: ['Swiper Images'],
        summary: 'Update swiper image (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Swiper image updated' } },
      },
      delete: {
        tags: ['Swiper Images'],
        summary: 'Delete swiper image (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Swiper image deleted' } },
      },
    },
  },
};

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
