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

router.get('/', authorizeRoles('admin'), getAllUsers);
router.get('/:id', authorizeRoles('admin'), getUserById);
router.post('/', authorizeRoles('admin'), validate(createUserSchema), createUser);
router.put('/:id', authorizeRoles('admin'), validate(updateUserSchema), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

export default router;
