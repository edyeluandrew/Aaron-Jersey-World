import { AppError, sendError } from '../utils/apiResponse.js';
import { isProduction } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  sendError(res, {
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404,
  });
};

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    return sendError(res, {
      message: err.message,
      errors: err.errors,
      statusCode: err.statusCode,
    });
  }

  if (err.name === 'ZodError') {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, {
      message: 'Validation failed',
      errors,
      statusCode: 400,
    });
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return sendError(res, {
      message: `A record with this ${field} already exists`,
      statusCode: 409,
    });
  }

  if (err.code === 'P2025') {
    return sendError(res, {
      message: 'Record not found',
      statusCode: 404,
    });
  }

  if (err.code?.startsWith('P')) {
    return sendError(res, {
      message: isProduction ? 'Database error' : err.message,
      statusCode: 400,
    });
  }

  console.error('[Error]', err);

  return sendError(res, {
    message: isProduction ? 'Internal server error' : err.message,
    statusCode: 500,
  });
};
