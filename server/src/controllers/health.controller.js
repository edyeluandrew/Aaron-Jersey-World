import { checkDatabaseHealth } from '../config/database.js';
import { verifyCloudinaryCredentials } from '../services/cloudinary.service.js';
import { env } from '../config/env.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getHealth(_req, res) {
  const db = await checkDatabaseHealth();
  const cloudinary = await verifyCloudinaryCredentials();

  sendSuccess(res, {
    message: 'Aaron Jersey World API is running',
    data: {
      status: db.connected && cloudinary.valid !== false ? 'ok' : 'degraded',
      environment: env.NODE_ENV,
      database: db,
      cloudinary,
      timestamp: new Date().toISOString(),
    },
  });
}
