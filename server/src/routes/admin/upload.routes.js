import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  uploadAdminFile,
  uploadBannerImage,
  uploadCategoryImage,
  uploadProductImage,
  uploadTestimonialImage,
} from '../../controllers/upload.controller.js';
import {
  handleMulterError,
  uploadSingleFile,
  uploadSingleImage,
} from '../../middleware/upload.middleware.js';
import { validate } from '../../middleware/validate.js';
import { adminUploadSchema, productImageUploadSchema } from '../../validators/upload.validator.js';
import { productIdSchema } from '../../validators/product.validator.js';
import { z } from 'zod';

const router = Router();

const adminUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload attempts. Please try again later.',
  },
});

const categoryIdSchema = z.object({ id: z.string().min(1) });

router.use(adminUploadLimiter);

router.post(
  '/',
  uploadSingleFile.single('file'),
  handleMulterError,
  validate(adminUploadSchema),
  uploadAdminFile,
);

router.post(
  '/products/:id/images',
  validate(productIdSchema, 'params'),
  uploadSingleImage.single('file'),
  handleMulterError,
  validate(productImageUploadSchema),
  uploadProductImage,
);

router.post(
  '/categories/:id/image',
  validate(categoryIdSchema, 'params'),
  uploadSingleImage.single('file'),
  handleMulterError,
  uploadCategoryImage,
);

router.post(
  '/banners',
  uploadSingleImage.single('file'),
  handleMulterError,
  uploadBannerImage,
);

router.post(
  '/testimonials',
  uploadSingleImage.single('file'),
  handleMulterError,
  uploadTestimonialImage,
);

export default router;
