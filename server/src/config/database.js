import { PrismaClient } from '@prisma/client';
import { isProduction } from '../config/env.js';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['error', 'warn'],
  });

if (!isProduction) {
  globalForPrisma.__prisma = prisma;
}

export async function connectDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('[Database] DATABASE_URL is not set — database features disabled.');
    return false;
  }

  await prisma.$connect();
  console.log('[Database] Connected to PostgreSQL');
  return true;
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export async function checkDatabaseHealth() {
  if (!process.env.DATABASE_URL) {
    return { connected: false, message: 'DATABASE_URL not configured' };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, message: 'Database connection healthy' };
  } catch (error) {
    return {
      connected: false,
      message: error.message || 'Database connection failed',
    };
  }
}
