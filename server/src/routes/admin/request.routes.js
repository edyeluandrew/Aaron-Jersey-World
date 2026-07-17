import { Router } from 'express';
import {
  getBrandingRequestById,
  getInquiryById,
  getInstitutionalRequestById,
  getQuoteRequestById,
  listBrandingRequests,
  listInquiries,
  listInstitutionalRequests,
  listQuoteRequests,
  updateBrandingRequestStatus,
  updateInquiryStatus,
  updateInstitutionalRequestStatus,
  updateQuoteRequestStatus,
} from '../../controllers/request.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  adminRequestIdSchema,
  adminRequestListSchema,
  updateRequestStatusSchema,
} from '../../validators/request.admin.validator.js';

const router = Router();

router.get('/inquiries', validate(adminRequestListSchema, 'query'), listInquiries);
router.get('/inquiries/:id', validate(adminRequestIdSchema, 'params'), getInquiryById);
router.patch(
  '/inquiries/:id/status',
  validate(adminRequestIdSchema, 'params'),
  validate(updateRequestStatusSchema),
  updateInquiryStatus,
);

router.get('/quotes', validate(adminRequestListSchema, 'query'), listQuoteRequests);
router.get('/quotes/:id', validate(adminRequestIdSchema, 'params'), getQuoteRequestById);
router.patch(
  '/quotes/:id/status',
  validate(adminRequestIdSchema, 'params'),
  validate(updateRequestStatusSchema),
  updateQuoteRequestStatus,
);

router.get('/branding-requests', validate(adminRequestListSchema, 'query'), listBrandingRequests);
router.get('/branding-requests/:id', validate(adminRequestIdSchema, 'params'), getBrandingRequestById);
router.patch(
  '/branding-requests/:id/status',
  validate(adminRequestIdSchema, 'params'),
  validate(updateRequestStatusSchema),
  updateBrandingRequestStatus,
);

router.get('/institutional-requests', validate(adminRequestListSchema, 'query'), listInstitutionalRequests);
router.get(
  '/institutional-requests/:id',
  validate(adminRequestIdSchema, 'params'),
  getInstitutionalRequestById,
);
router.patch(
  '/institutional-requests/:id/status',
  validate(adminRequestIdSchema, 'params'),
  validate(updateRequestStatusSchema),
  updateInstitutionalRequestStatus,
);

export default router;
