import express from 'express';
import {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cardController.js';
import { validate } from '../middlewares/validate.js';
import { createCardSchema, updateCardSchema } from '../validations/cardValidation.js';
import { verifyToken, optionalToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/cards:
 *   get:
 *     tags:
 *       - Cards (Products)
 *     summary: Get all products with optional filters (public)
 *     parameters:
 *       - name: category_id
 *         in: query
 *         description: Filter by category ID
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: search
 *         in: query
 *         description: Search term for product name or description
 *         schema:
 *           type: string
 *         example: headphones
 *       - name: min_price
 *         in: query
 *         description: Minimum price filter
 *         schema:
 *           type: number
 *         example: 10
 *       - name: max_price
 *         in: query
 *         description: Maximum price filter
 *         schema:
 *           type: number
 *         example: 500
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *   post:
 *     tags:
 *       - Cards (Products)
 *     summary: Upload / Create a product to sell (Seller or Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item_name
 *               - price
 *             properties:
 *               item_name:
 *                 type: string
 *                 example: Smart Watch
 *               price:
 *                 type: number
 *                 example: 149.99
 *               thumbnail:
 *                 type: string
 *                 example: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
 *               item_desc:
 *                 type: string
 *                 example: Waterproof smart fitness tracker watch
 *               rating:
 *                 type: number
 *                 example: 4.7
 *               category_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product uploaded to sell
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/', optionalToken, getAllCards);
router.post('/', verifyToken, validate(createCardSchema), createCard);

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     tags:
 *       - Cards (Products)
 *     summary: Get a product by ID (public)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Product not found
 *   put:
 *     tags:
 *       - Cards (Products)
 *     summary: Update a product (owner Seller or Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *                 example: Updated Smart Watch
 *               price:
 *                 type: number
 *                 example: 129.99
 *               thumbnail:
 *                 type: string
 *                 example: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
 *               item_desc:
 *                 type: string
 *                 example: Updated product description
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 *   delete:
 *     tags:
 *       - Cards (Products)
 *     summary: Delete a product (owner Seller or Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden - not the product owner
 *       404:
 *         description: Product not found
 */
router.get('/:id', optionalToken, getCardById);
router.put('/:id', verifyToken, validate(updateCardSchema), updateCard);
router.delete('/:id', verifyToken, deleteCard);

export default router;
