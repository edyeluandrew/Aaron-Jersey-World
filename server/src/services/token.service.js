import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/apiResponse.js';
import { hashToken, parseDurationToMs } from '../utils/auth.js';

const ACCESS_EXPIRES_MS = parseDurationToMs(env.JWT_ACCESS_EXPIRES_IN);
const REFRESH_EXPIRES_MS = parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN);

function assertJwtSecrets() {
  if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
    throw new AppError('Authentication is not configured on this server', 503);
  }
}

export function signAccessToken(user) {
  assertJwtSecrets();

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  );
}

export function signRefreshToken(user, tokenId) {
  assertJwtSecrets();

  return jwt.sign(
    {
      sub: user.id,
      jti: tokenId,
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );
}

export function verifyAccessToken(token) {
  assertJwtSecrets();

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

    if (payload.type !== 'access') {
      throw new AppError('Invalid access token', 401);
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired access token', 401);
  }
}

export function verifyRefreshToken(token) {
  assertJwtSecrets();

  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);

    if (payload.type !== 'refresh' || !payload.jti) {
      throw new AppError('Invalid refresh token', 401);
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired refresh token', 401);
  }
}

export function getAccessTokenMaxAge() {
  return ACCESS_EXPIRES_MS;
}

export function getRefreshTokenMaxAge() {
  return REFRESH_EXPIRES_MS;
}

export function getRefreshTokenExpiryDate() {
  return new Date(Date.now() + REFRESH_EXPIRES_MS);
}

export { hashToken };
