import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  listAdminCategories,
  updateCategory,
} from '../../controllers/category.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../../validators/category.validator.js';
import { z } from 'zod';

const router = Router();

const idSchema = z.object({ id: z.string().min(1) });

router.get('/', listAdminCategories);
router.post('/', validate(createCategorySchema), createCategory);
router.patch('/:id', validate(idSchema, 'params'), validate(updateCategorySchema), updateCategory);
router.delete('/:id', validate(idSchema, 'params'), deleteCategory);

export default router;
