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

router.use(verifyToken);

router.get('/', getFavorites);
router.post('/', validate(addFavoriteSchema), addFavorite);
router.delete('/:card_id', removeFavorite);

export default router;
