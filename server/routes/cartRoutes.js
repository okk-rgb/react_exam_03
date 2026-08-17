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

router.use(verifyToken);

router.get('/', getCart);
router.get('/total', getCartTotal);
router.post('/', validate(addToCartSchema), addToCart);
router.put('/:id', validate(updateCartQuantitySchema), updateCartQuantity);
router.delete('/:id', removeFromCart);
router.post('/buy', buyCart);

export default router;
