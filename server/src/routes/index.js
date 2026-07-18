import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.routes.js';
import uploadRoutes from './upload.routes.js';
import bannerRoutes from './banner.routes.js';
import siteSettingsRoutes from './siteSettings.routes.js';
import requestRoutes from './request.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { API_PREFIX } from '../constants/index.js';

const router = Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/uploads', uploadRoutes);
router.use('/banners', bannerRoutes);
router.use('/site-settings', siteSettingsRoutes);
router.use(requestRoutes);
router.use('/admin', adminRoutes);

router.get('/', (_req, res) => {
  sendSuccess(res, {
    message: 'Welcome to Aaron Jersey World API',
    data: {
      version: 'v1',
      documentation: 'See README.md for API overview',
    },
  });
});

export { router as apiRouter, API_PREFIX };
