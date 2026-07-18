import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { safeDeleteCloudinaryAsset } from './cloudinary.service.js';
import { enrichBannerWithUrls } from '../utils/cloudinaryTransforms.js';

function enrichBanners(banners) {
  return banners.map(enrichBannerWithUrls);
}

export async function listActiveBanners() {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return enrichBanners(banners);
}

export async function listAdminBanners() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  });

  return enrichBanners(banners);
}

export async function getBannerById(id) {
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) throw new AppError('Banner not found', 404);
  return enrichBannerWithUrls(banner);
}

export async function createBanner(data) {
  const banner = await prisma.banner.create({
    data: {
      title: data.title?.trim() || 'Hero slide',
      subtitle: data.subtitle?.trim() || null,
      imageUrl: data.imageUrl,
      imagePublicId: data.imagePublicId || null,
      buttonText: data.buttonText?.trim() || null,
      buttonUrl: data.buttonUrl?.trim() || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  return enrichBannerWithUrls(banner);
}

export async function updateBanner(id, data) {
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new AppError('Banner not found', 404);

  if (
    data.imagePublicId &&
    existing.imagePublicId &&
    data.imagePublicId !== existing.imagePublicId
  ) {
    await safeDeleteCloudinaryAsset(existing.imagePublicId);
  }

  const banner = await prisma.banner.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() || 'Hero slide' } : {}),
      ...(data.subtitle !== undefined ? { subtitle: data.subtitle?.trim() || null } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl || existing.imageUrl } : {}),
      ...(data.imagePublicId !== undefined ? { imagePublicId: data.imagePublicId || null } : {}),
      ...(data.buttonText !== undefined ? { buttonText: data.buttonText?.trim() || null } : {}),
      ...(data.buttonUrl !== undefined ? { buttonUrl: data.buttonUrl?.trim() || null } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });

  return enrichBannerWithUrls(banner);
}

export async function deleteBanner(id) {
  const existing = await prisma.banner.findUnique({ where: { id } });
  if (!existing) throw new AppError('Banner not found', 404);

  if (existing.imagePublicId) {
    await safeDeleteCloudinaryAsset(existing.imagePublicId);
  }

  await prisma.banner.delete({ where: { id } });
}
