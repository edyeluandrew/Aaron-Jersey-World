import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  uploadRequestFile,
} from '../controllers/upload.controller.js';
import {
  handleMulterError,
  uploadSingleFile,
} from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.js';
import { publicUploadSchema } from '../validators/upload.validator.js';

const router = Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many upload attempts. Please try again later.',
  },
});

router.post(
  '/request-file',
  uploadLimiter,
  validate(publicUploadSchema, 'query'),
  uploadSingleFile.single('file'),
  handleMulterError,
  uploadRequestFile,
);

export default router;
