import { Router } from 'express';
import {
  createBanner,
  deleteBanner,
  listAdminBanners,
  updateBanner,
} from '../../controllers/banner.controller.js';
import { validate } from '../../middleware/validate.js';
import {
  bannerIdSchema,
  createBannerSchema,
  updateBannerSchema,
} from '../../validators/banner.validator.js';

const router = Router();

router.get('/', listAdminBanners);
router.post('/', validate(createBannerSchema), createBanner);
router.patch('/:id', validate(bannerIdSchema, 'params'), validate(updateBannerSchema), updateBanner);
router.delete('/:id', validate(bannerIdSchema, 'params'), deleteBanner);

export default router;
