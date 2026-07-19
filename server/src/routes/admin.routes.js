import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize, adminRoles } from '../middleware/authorize.middleware.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getAdminDashboardData } from '../services/adminDashboard.service.js';
import adminCategoryRoutes from './admin/category.routes.js';
import adminProductRoutes from './admin/product.routes.js';
import adminUploadRoutes from './admin/upload.routes.js';
import adminRequestRoutes from './admin/request.routes.js';
import adminBannerRoutes from './admin/banner.routes.js';

const router = Router();

router.use(authenticate);
router.use(authorize(...adminRoles));

router.get('/dashboard', async (_req, res, next) => {
  try {
    const data = await getAdminDashboardData();

    sendSuccess(res, {
      message: 'Dashboard statistics retrieved',
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.use('/categories', adminCategoryRoutes);
router.use('/banners', adminBannerRoutes);
router.use('/products', adminProductRoutes);
router.use('/uploads', adminUploadRoutes);
router.use('/', adminRequestRoutes);

export default router;
