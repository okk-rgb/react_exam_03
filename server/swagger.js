import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Marketplace E-Commerce API',
      version: '1.0.0',
      description:
        'Complete PostgreSQL & Sequelize API with Auth, Roles, Joi Validations, Categories, Cards, Cart, Favorites, and Swiper',
    },
  
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
