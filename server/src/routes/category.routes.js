import { Router } from 'express';
import {
  getCategoryBySlug,
  listCategories,
} from '../controllers/category.controller.js';
import { validate } from '../middleware/validate.js';
import { categoryQuerySchema, categorySlugSchema } from '../validators/category.validator.js';

const router = Router();

router.get('/', validate(categoryQuerySchema, 'query'), listCategories);
router.get('/:slug', validate(categorySlugSchema, 'params'), validate(categoryQuerySchema, 'query'), getCategoryBySlug);

export default router;
