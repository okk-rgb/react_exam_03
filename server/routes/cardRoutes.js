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

router.get('/', optionalToken, getAllCards);
router.get('/:id', optionalToken, getCardById);
router.post('/', verifyToken, validate(createCardSchema), createCard);
router.put('/:id', verifyToken, validate(updateCardSchema), updateCard);
router.delete('/:id', verifyToken, deleteCard);

export default router;
