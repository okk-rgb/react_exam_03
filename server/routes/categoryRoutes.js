import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { validate } from '../middlewares/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validations/categoryValidation.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', verifyToken, authorizeRoles('admin', 'seller'), validate(createCategorySchema), createCategory);
router.put('/:id', verifyToken, authorizeRoles('admin'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCategory);

export default router;
