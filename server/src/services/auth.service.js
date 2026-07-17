import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { sanitizeUser } from '../utils/auth.js';
import { createAuditLog } from './auditLog.service.js';
import {
  getRefreshTokenExpiryDate,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './token.service.js';

function createTempTokenHash() {
  return hashToken(crypto.randomBytes(32).toString('hex'));
}

async function issueTokens(user) {
  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: createTempTokenHash(),
      expiresAt: getRefreshTokenExpiryDate(),
    },
  });

  const refreshToken = signRefreshToken(user, refreshTokenRecord.id);

  await prisma.refreshToken.update({
    where: { id: refreshTokenRecord.id },
    data: { tokenHash: hashToken(refreshToken) },
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken,
    user: sanitizeUser(user),
  };
}

export async function login({ email, password, ipAddress, userAgent }) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = await issueTokens(updatedUser);

  await createAuditLog({
    userId: user.id,
    action: 'AUTH_LOGIN',
    entityType: 'User',
    entityId: user.id,
    ipAddress,
    userAgent,
  });

  return tokens;
}

export async function refreshSession(refreshToken, { ipAddress, userAgent }) {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      id: payload.jti,
      userId: payload.sub,
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!storedToken || !storedToken.user.isActive) {
    throw new AppError('Invalid or expired session', 401);
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokens(storedToken.user);

  await createAuditLog({
    userId: storedToken.user.id,
    action: 'AUTH_REFRESH',
    entityType: 'User',
    entityId: storedToken.user.id,
    ipAddress,
    userAgent,
  });

  return tokens;
}

export async function logout(refreshToken, userId, { ipAddress, userAgent }) {
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
        ...(userId ? { userId } : {}),
      },
      data: { revokedAt: new Date() },
    });
  } else if (userId) {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  if (userId) {
    await createAuditLog({
      userId,
      action: 'AUTH_LOGOUT',
      entityType: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    });
  }
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
}

export async function changePassword(userId, { currentPassword, newPassword, ipAddress, userAgent }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.isActive) {
    throw new AppError('User not found', 404);
  }

  const passwordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!passwordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  const samePassword = await bcrypt.compare(newPassword, user.passwordHash);
  if (samePassword) {
    throw new AppError('New password must be different from current password', 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  await createAuditLog({
    userId,
    action: 'AUTH_PASSWORD_CHANGED',
    entityType: 'User',
    entityId: userId,
    ipAddress,
    userAgent,
  });

  return sanitizeUser(await prisma.user.findUnique({ where: { id: userId } }));
}
