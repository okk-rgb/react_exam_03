import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema } from '../validations/userValidation.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users (Admin)
 *     summary: Get all users (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *   post:
 *     tags:
 *       - Users (Admin)
 *     summary: Create a new user (Admin only)
 *     security:
 *       - BearerAuth: []
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
 *                 example: jane_doe
 *               user_password:
 *                 type: string
 *                 example: securePass123
 *               user_number:
 *                 type: string
 *                 example: '+987654321'
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *                 example: seller
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', authorizeRoles('admin'), getAllUsers);
router.post('/', authorizeRoles('admin'), validate(createUserSchema), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users (Admin)
 *     summary: Get a user by ID (Admin only)
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
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *   put:
 *     tags:
 *       - Users (Admin)
 *     summary: Update a user or their role (Admin only)
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
 *               user_name:
 *                 type: string
 *                 example: updated_name
 *               user_number:
 *                 type: string
 *                 example: '+111222333'
 *               role:
 *                 type: string
 *                 enum: [user, seller, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *   delete:
 *     tags:
 *       - Users (Admin)
 *     summary: Delete a user (Admin only)
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.get('/:id', authorizeRoles('admin'), getUserById);
router.put('/:id', authorizeRoles('admin'), validate(updateUserSchema), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

export default router;
