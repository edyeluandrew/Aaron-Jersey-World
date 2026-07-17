import { sendSuccess } from '../utils/apiResponse.js';
import { getPublicSiteSettings } from '../services/siteSettings.service.js';

export async function getPublicSettings(_req, res, next) {
  try {
    const settings = await getPublicSiteSettings();

    sendSuccess(res, {
      message: 'Public site settings retrieved',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
}
