import express from 'express';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  buyCart,
} from '../controllers/cartController.js';
import { validate } from '../middlewares/validate.js';
import { addToCartSchema, updateCartQuantitySchema } from '../validations/cartValidation.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get the current user's cart with total price
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User cart items and total price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartItem'
 *                 total:
 *                   type: number
 *                   example: 399.97
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add an item to the cart
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
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);

/**
 * @swagger
 * /api/cart/total:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart total price and item count
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart total items and total price
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item_count:
 *                   type: integer
 *                   example: 3
 *                 total_price:
 *                   type: number
 *                   example: 399.97
 *       401:
 *         description: Unauthorized
 */
router.get('/total', getCartTotal);

/**
 * @swagger
 * /api/cart/buy:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Checkout / Buy all cart items
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_location:
 *                 type: string
 *                 example: '123 Main Street, City, Country'
 *     responses:
 *       200:
 *         description: Purchase completed, returns receipt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Purchase completed!
 *                 receipt:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Cart is empty
 */
router.post('/buy', buyCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity
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
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Cart item not found
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove an item from the cart
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
 *         description: Item removed from cart
 *       404:
 *         description: Cart item not found
 */
router.put('/:id', validate(updateCartQuantitySchema), updateCartQuantity);
router.delete('/:id', removeFromCart);

export default router;
