import { Router } from 'express';
import {
  addProductImage,
  addProductVariant,
  createProduct,
  deleteProduct,
  deleteProductImage,
  deleteProductVariant,
  getAdminProductById,
  listAdminProducts,
  updateProduct,
  updateProductImage,
  updateProductVariant,
} from '../../controllers/product.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  createProductImageSchema,
  createProductSchema,
  createProductVariantSchema,
  productIdSchema,
  productImageParamsSchema,
  productQuerySchema,
  productVariantParamsSchema,
  updateProductImageSchema,
  updateProductSchema,
  updateProductVariantSchema,
} from '../../validators/product.validator.js';

const router = Router();

router.get('/', validate(productQuerySchema, 'query'), listAdminProducts);
router.post('/', validate(createProductSchema), createProduct);
router.get('/:id', validate(productIdSchema, 'params'), getAdminProductById);
router.patch('/:id', validate(productIdSchema, 'params'), validate(updateProductSchema), updateProduct);
router.delete('/:id', validate(productIdSchema, 'params'), deleteProduct);

router.post(
  '/:id/images',
  validate(productIdSchema, 'params'),
  validate(createProductImageSchema),
  addProductImage,
);
router.patch(
  '/:id/images/:imageId',
  validate(productImageParamsSchema, 'params'),
  validate(updateProductImageSchema),
  updateProductImage,
);
router.delete(
  '/:id/images/:imageId',
  validate(productImageParamsSchema, 'params'),
  deleteProductImage,
);

router.post(
  '/:id/variants',
  validate(productIdSchema, 'params'),
  validate(createProductVariantSchema),
  addProductVariant,
);
router.patch(
  '/:id/variants/:variantId',
  validate(productVariantParamsSchema, 'params'),
  validate(updateProductVariantSchema),
  updateProductVariant,
);
router.delete(
  '/:id/variants/:variantId',
  validate(productVariantParamsSchema, 'params'),
  deleteProductVariant,
);

export default router;
