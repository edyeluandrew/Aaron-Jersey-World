import { COOKIE_NAMES } from '../config/cookies.js';
import { AppError } from '../utils/apiResponse.js';
import { verifyAccessToken } from '../services/token.service.js';
import { prisma } from '../config/database.js';

export async function authenticate(req, _res, next) {
  try {
    const bearerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;

    const token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] || bearerToken;

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new AppError('Authentication required', 401);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuthenticate(req, _res, next) {
  const bearerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  const token = req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] || bearerToken;

  if (!token) {
    return next();
  }

  return authenticate(req, _res, next);
}
