import { CLOUDINARY_FOLDERS } from '../constants/index.js';
import {
  ADMIN_UPLOAD_FOLDERS,
  PUBLIC_UPLOAD_FOLDERS,
} from '../constants/uploads.js';
import { AppError, sendSuccess } from '../utils/apiResponse.js';
import { uploadBuffer } from '../services/cloudinary.service.js';
import * as productService from '../services/product.service.js';
import * as categoryService from '../services/category.service.js';
import { getQuery } from '../middleware/validate.js';

function mapPurposeToFolder(purpose) {
  const key = PUBLIC_UPLOAD_FOLDERS[purpose];
  return CLOUDINARY_FOLDERS[key];
}

function mapAdminFolder(folder) {
  const key = ADMIN_UPLOAD_FOLDERS[folder];
  return CLOUDINARY_FOLDERS[key];
}

function getUploadedFile(req) {
  if (!req.file) {
    throw new AppError('A file is required', 400);
  }
  return req.file;
}

export async function uploadRequestFile(req, res, next) {
  try {
    const file = getUploadedFile(req);
    const { purpose } = getQuery(req);

    const result = await uploadBuffer(file.buffer, {
      folder: mapPurposeToFolder(purpose),
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    sendSuccess(res, {
      message: 'File uploaded successfully',
      data: result,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAdminFile(req, res, next) {
  try {
    const file = getUploadedFile(req);
    const { folder } = req.body;

    const result = await uploadBuffer(file.buffer, {
      folder: mapAdminFolder(folder),
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    sendSuccess(res, {
      message: 'File uploaded successfully',
      data: result,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadProductImage(req, res, next) {
  try {
    const file = getUploadedFile(req);
    const meta = req.body;

    const upload = await uploadBuffer(file.buffer, {
      folder: CLOUDINARY_FOLDERS.PRODUCTS,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    const image = await productService.addProductImage(req.params.id, {
      secureUrl: upload.secureUrl,
      publicId: upload.publicId,
      altText: meta.altText || file.originalname,
      width: upload.width,
      height: upload.height,
      sortOrder: meta.sortOrder ?? 0,
      isPrimary: meta.isPrimary ?? false,
    });

    sendSuccess(res, {
      message: 'Product image uploaded successfully',
      data: image,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadCategoryImage(req, res, next) {
  try {
    const file = getUploadedFile(req);
    const category = await categoryService.getCategoryById(req.params.id);

    const upload = await uploadBuffer(file.buffer, {
      folder: CLOUDINARY_FOLDERS.CATEGORIES,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    const updated = await categoryService.updateCategoryImage(category.id, {
      imageUrl: upload.secureUrl,
      imagePublicId: upload.publicId,
      previousPublicId: category.imagePublicId,
    });

    sendSuccess(res, {
      message: 'Category image uploaded successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadBannerImage(req, res, next) {
  try {
    const file = getUploadedFile(req);

    const result = await uploadBuffer(file.buffer, {
      folder: CLOUDINARY_FOLDERS.BANNERS,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    sendSuccess(res, {
      message: 'Banner image uploaded successfully',
      data: result,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadTestimonialImage(req, res, next) {
  try {
    const file = getUploadedFile(req);

    const result = await uploadBuffer(file.buffer, {
      folder: CLOUDINARY_FOLDERS.TESTIMONIALS,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    sendSuccess(res, {
      message: 'Testimonial image uploaded successfully',
      data: result,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}
