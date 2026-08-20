import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoriteController.js';
import { validate } from '../middlewares/validate.js';
import { addFavoriteSchema } from '../validations/favoriteValidation.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// All favorite routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     tags:
 *       - Favorites / Wishlist
 *     summary: Get current user's favorite products
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavoriteItem'
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Favorites / Wishlist
 *     summary: Add a product to favorites / wishlist
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_id
 *             properties:
 *               card_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product added to favorites successfully
 *       400:
 *         description: Validation error or already in favorites
 *       401:
 *         description: Unauthorized
 */
router.get('/', getFavorites);
router.post('/', validate(addFavoriteSchema), addFavorite);

/**
 * @swagger
 * /api/favorites/{card_id}:
 *   delete:
 *     tags:
 *       - Favorites / Wishlist
 *     summary: Remove a product from favorites / wishlist
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: card_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       404:
 *         description: Favorite item not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:card_id', removeFavorite);

export default router;
