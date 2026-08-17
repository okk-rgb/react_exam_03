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

router.get('/', getAllSwipers);
router.get('/:id', getSwiperById);
router.post('/', verifyToken, authorizeRoles('admin'), validate(createSwiperSchema), createSwiper);
router.put('/:id', verifyToken, authorizeRoles('admin'), validate(updateSwiperSchema), updateSwiper);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteSwiper);

export default router;
