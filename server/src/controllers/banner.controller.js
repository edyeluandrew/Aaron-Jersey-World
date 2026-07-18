import { sendSuccess } from '../utils/apiResponse.js';
import { getParams } from '../middleware/validate.js';
import * as bannerService from '../services/banner.service.js';

export async function listBanners(_req, res, next) {
  try {
    const banners = await bannerService.listActiveBanners();
    sendSuccess(res, {
      message: 'Hero banners retrieved successfully',
      data: banners,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAdminBanners(_req, res, next) {
  try {
    const banners = await bannerService.listAdminBanners();
    sendSuccess(res, {
      message: 'Hero banners retrieved successfully',
      data: banners,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBanner(req, res, next) {
  try {
    const banner = await bannerService.createBanner(req.body);
    sendSuccess(res, {
      message: 'Hero banner created',
      data: banner,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBanner(req, res, next) {
  try {
    const banner = await bannerService.updateBanner(getParams(req).id, req.body);
    sendSuccess(res, {
      message: 'Hero banner updated',
      data: banner,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBanner(req, res, next) {
  try {
    await bannerService.deleteBanner(getParams(req).id);
    sendSuccess(res, { message: 'Hero banner deleted' });
  } catch (error) {
    next(error);
  }
}
