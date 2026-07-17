import { prisma } from '../config/database.js';

export async function createAuditLog({ userId, action, entityType, entityId, metadata, ipAddress, userAgent }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        metadata,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('[AuditLog] Failed to write audit log:', error.message);
  }
}
