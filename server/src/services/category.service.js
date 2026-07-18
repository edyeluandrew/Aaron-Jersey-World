import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { safeDeleteCloudinaryAsset } from './cloudinary.service.js';
import { enrichCategoryWithUrls } from '../utils/cloudinaryTransforms.js';
import { MAIN_CATEGORY_SLUGS } from '../constants/catalogue.js';

function enrichCategories(categories) {
  return categories.map(enrichCategoryWithUrls);
}

export async function listCategories({ includeInactive = false } = {}) {
  const categories = await prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  return enrichCategories(categories);
}

export async function getCategoryBySlug(slug, { includeInactive = false } = {}) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
  });

  if (!category || (!includeInactive && !category.isActive)) {
    throw new AppError('Category not found', 404);
  }

  return enrichCategoryWithUrls(category);
}

export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
}

export async function updateCategoryImage(id, { imageUrl, imagePublicId, previousPublicId }) {
  if (previousPublicId && previousPublicId !== imagePublicId) {
    await safeDeleteCloudinaryAsset(previousPublicId);
  }

  const category = await prisma.category.update({
    where: { id },
    data: { imageUrl, imagePublicId },
  });

  return enrichCategoryWithUrls(category);
}

export async function createCategory(data) {
  const slug = data.slug || (await generateUniqueSlug(prisma, 'category', data.name));

  return prisma.category.create({
    data: {
      ...data,
      slug,
      imageUrl: data.imageUrl || null,
      imagePublicId: data.imagePublicId || null,
    },
  });
}

export async function updateCategory(id, data) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found', 404);

  let slug = data.slug;
  if (data.name && !data.slug) {
    slug = await generateUniqueSlug(prisma, 'category', data.name, id);
  } else if (data.slug) {
    slug = await generateUniqueSlug(prisma, 'category', data.slug, id);
  }

  if (
    data.imagePublicId &&
    existing.imagePublicId &&
    data.imagePublicId !== existing.imagePublicId
  ) {
    await safeDeleteCloudinaryAsset(existing.imagePublicId);
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...data,
      ...(slug ? { slug } : {}),
      imageUrl: data.imageUrl === '' ? null : data.imageUrl,
    },
  });

  return enrichCategoryWithUrls(category);
}

export async function deleteCategory(id) {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!existing) throw new AppError('Category not found', 404);

  if (existing._count.products > 0) {
    throw new AppError('Cannot delete a category that has products assigned to it', 400);
  }

  if (existing.imagePublicId) {
    await safeDeleteCloudinaryAsset(existing.imagePublicId);
  }

  await prisma.category.delete({ where: { id } });
}

export async function listAdminCategories() {
  const categories = await prisma.category.findMany({
    where: {
      slug: { in: MAIN_CATEGORY_SLUGS },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: { select: { products: true } },
    },
  });

  return enrichCategories(categories);
}
