import multer from 'multer';
import { AppError } from '../utils/apiResponse.js';
import {
  ALLOWED_FILE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  UPLOAD_LIMITS,
} from '../constants/uploads.js';

const storage = multer.memoryStorage();

function createUploader({ maxFileSize, allowedMimeTypes, maxFiles = 1 }) {
  return multer({
    storage,
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
    fileFilter: (_req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new AppError(
            `Unsupported file type. Allowed: ${allowedMimeTypes.map((t) => t.split('/')[1]).join(', ')}`,
            400,
          ),
        );
      }
      cb(null, true);
    },
  });
}

export const uploadSingleImage = createUploader({
  maxFileSize: UPLOAD_LIMITS.IMAGE_MAX_BYTES,
  allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
});

export const uploadSingleFile = createUploader({
  maxFileSize: UPLOAD_LIMITS.FILE_MAX_BYTES,
  allowedMimeTypes: ALLOWED_FILE_MIME_TYPES,
});

export const uploadMultipleFiles = createUploader({
  maxFileSize: UPLOAD_LIMITS.FILE_MAX_BYTES,
  allowedMimeTypes: ALLOWED_FILE_MIME_TYPES,
  maxFiles: 5,
});

export function handleMulterError(err, _req, _res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File is too large. Maximum allowed size exceeded.', 400));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('Too many files uploaded.', 400));
    }
    return next(new AppError(err.message, 400));
  }

  return next(err);
}
