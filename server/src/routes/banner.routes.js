import { Router } from 'express';
import { listBanners } from '../controllers/banner.controller.js';

const router = Router();

router.get('/', listBanners);

export default router;
