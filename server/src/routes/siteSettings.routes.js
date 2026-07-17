import { Router } from 'express';
import { getPublicSettings } from '../controllers/siteSettings.controller.js';

const router = Router();

router.get('/public', getPublicSettings);

export default router;
