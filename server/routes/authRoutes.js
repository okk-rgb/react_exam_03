import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - user_password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: john_doe
 *               user_password:
 *                 type: string
 *                 example: password123
 *               user_number:
 *                 type: string
 *                 example: '+123456789'
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or username already taken
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in to obtain a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - user_password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: john_doe
 *               user_password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Signed in successfully, returns JWT token
 *       401:
 *         description: Invalid username or password
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current authenticated user profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get('/me', verifyToken, getMe);

export default router;
