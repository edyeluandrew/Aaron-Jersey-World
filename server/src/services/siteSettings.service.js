import { prisma } from '../config/database.js';

export async function getPublicSiteSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { isPublic: true },
    orderBy: [{ group: 'asc' }, { key: 'asc' }],
  });

  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
}
