import { checkDatabaseHealth } from '../config/database.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getHealth(_req, res) {
  const db = await checkDatabaseHealth();

  sendSuccess(res, {
    message: 'Aaron Jersey World API is running',
    data: {
      status: db.connected ? 'ok' : 'degraded',
      environment: env.NODE_ENV,
      database: db,
      cloudinary: {
        configured: isCloudinaryConfigured(),
      },
      timestamp: new Date().toISOString(),
    },
  });
}
