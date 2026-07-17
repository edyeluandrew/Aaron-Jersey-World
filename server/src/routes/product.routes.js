import { Router } from 'express';
import {
  getFeaturedProducts,
  getProductBySlug,
  getProductFilterOptions,
  getRelatedProducts,
  listProducts,
} from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.js';
import {
  featuredQuerySchema,
  productQuerySchema,
  productSlugSchema,
  relatedQuerySchema,
} from '../validators/product.validator.js';

const router = Router();

router.get('/filters/options', getProductFilterOptions);
router.get('/featured', validate(featuredQuerySchema, 'query'), getFeaturedProducts);
router.get('/', validate(productQuerySchema, 'query'), listProducts);
router.get('/:slug/related', validate(productSlugSchema, 'params'), validate(relatedQuerySchema, 'query'), getRelatedProducts);
router.get('/:slug', validate(productSlugSchema, 'params'), getProductBySlug);

export default router;
