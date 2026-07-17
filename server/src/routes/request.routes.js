import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBrandingRequest,
  createInquiry,
  createInstitutionalRequest,
  createQuoteRequest,
} from '../controllers/request.controller.js';
import { validate } from '../middleware/validate.js';
import {
  createBrandingSchema,
  createInquirySchema,
  createInstitutionalSchema,
  createQuoteSchema,
} from '../validators/request.validator.js';

const router = Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many form submissions. Please try again later.',
  },
});

router.post('/inquiries', formLimiter, validate(createInquirySchema), createInquiry);
router.post('/quotes', formLimiter, validate(createQuoteSchema), createQuoteRequest);
router.post('/branding-requests', formLimiter, validate(createBrandingSchema), createBrandingRequest);
router.post(
  '/institutional-requests',
  formLimiter,
  validate(createInstitutionalSchema),
  createInstitutionalRequest,
);

export default router;
