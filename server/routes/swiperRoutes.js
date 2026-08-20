import express from 'express';
import {
  getAllSwipers,
  getSwiperById,
  createSwiper,
  updateSwiper,
  deleteSwiper,
} from '../controllers/swiperController.js';
import { validate } from '../middlewares/validate.js';
import { createSwiperSchema, updateSwiperSchema } from '../validations/swiperValidation.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/swiper:
 *   get:
 *     tags:
 *       - Swiper Images
 *     summary: Get all swiper / hero banner images (public)
 *     responses:
 *       200:
 *         description: List of swiper image URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SwiperImg'
 *   post:
 *     tags:
 *       - Swiper Images
 *     summary: Create a new swiper image (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
 *     responses:
 *       201:
 *         description: Swiper image created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', getAllSwipers);
router.post('/', verifyToken, authorizeRoles('admin'), validate(createSwiperSchema), createSwiper);

/**
 * @swagger
 * /api/swiper/{id}:
 *   get:
 *     tags:
 *       - Swiper Images
 *     summary: Get a swiper image by ID (public)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Swiper image details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SwiperImg'
 *       404:
 *         description: Swiper image not found
 *   put:
 *     tags:
 *       - Swiper Images
 *     summary: Update a swiper image URL (Admin only)
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
 *               url:
 *                 type: string
 *                 example: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da'
 *     responses:
 *       200:
 *         description: Swiper image updated successfully
 *       404:
 *         description: Swiper image not found
 *   delete:
 *     tags:
 *       - Swiper Images
 *     summary: Delete a swiper image (Admin only)
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
 *         description: Swiper image deleted successfully
 *       404:
 *         description: Swiper image not found
 */
router.get('/:id', getSwiperById);
router.put('/:id', verifyToken, authorizeRoles('admin'), validate(updateSwiperSchema), updateSwiper);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteSwiper);

export default router;
