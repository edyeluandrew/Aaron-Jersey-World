import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { buildPaginationMeta, getPagination } from '../utils/pagination.js';
import { serializeProduct, serializeProducts } from '../utils/serialize.js';
import { generateUniqueSlug } from '../utils/slug.js';
import { deleteMultipleAssets, safeDeleteCloudinaryAsset } from './cloudinary.service.js';

const productListInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
    take: 1,
  },
  variants: {
    select: {
      id: true,
      size: true,
      colour: true,
      version: true,
      stockStatus: true,
    },
  },
};

const productDetailInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  images: {
    orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
  },
  variants: {
    orderBy: [{ size: 'asc' }, { colour: 'asc' }],
  },
};

function getSortOrder(sort = 'featured') {
  const sortMap = {
    featured: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    newest: [{ createdAt: 'desc' }],
    'name-asc': [{ name: 'asc' }],
    'name-desc': [{ name: 'desc' }],
    'price-asc': [{ price: 'asc' }, { name: 'asc' }],
    'price-desc': [{ price: 'desc' }, { name: 'asc' }],
  };

  return sortMap[sort] || sortMap.featured;
}

async function resolveCategoryId(categoryParam) {
  if (!categoryParam) return null;

  const category = await prisma.category.findFirst({
    where: {
      OR: [{ slug: categoryParam }, { id: categoryParam }],
      isActive: true,
    },
  });

  return category?.id || null;
}

async function buildProductWhere(query) {
  const {
    search,
    category,
    stockStatus,
    minPrice,
    maxPrice,
    size,
    colour,
    featured,
    brandingAvailable,
    includeInactive = false,
  } = query;

  const where = {
    ...(includeInactive ? {} : { isActive: true }),
  };

  if (category) {
    const categoryId = await resolveCategoryId(category);
    if (!categoryId) {
      return { impossible: true };
    }
    where.categoryId = categoryId;
  }

  if (stockStatus) where.stockStatus = stockStatus;
  if (featured !== undefined) where.isFeatured = featured;
  if (brandingAvailable !== undefined) where.brandingAvailable = brandingAvailable;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.isPriceVisible = true;
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (size || colour) {
    where.variants = {
      some: {
        ...(size ? { size: { equals: size, mode: 'insensitive' } } : {}),
        ...(colour ? { colour: { equals: colour, mode: 'insensitive' } } : {}),
      },
    };
  }

  return where;
}

export async function listProducts(query) {
  const { page, limit, skip } = getPagination(query);
  const where = await buildProductWhere(query);

  if (where.impossible) {
    return {
      products: [],
      meta: buildPaginationMeta({ page, limit, total: 0 }),
    };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: getSortOrder(query.sort),
      include: productListInclude,
    }),
  ]);

  return {
    products: serializeProducts(products),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    orderBy: [{ createdAt: 'desc' }],
    include: productListInclude,
  });

  return serializeProducts(products);
}

export async function getProductBySlug(slug, { includeInactive = false } = {}) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: productDetailInclude,
  });

  if (!product || (!includeInactive && !product.isActive)) {
    throw new AppError('Product not found', 404);
  }

  return serializeProduct(product, { includeDetails: true });
}

export async function getRelatedProducts(slug, limit = 8) {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true, categoryId: true, isActive: true },
  });

  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: limit,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: productListInclude,
  });

  return serializeProducts(products);
}

export async function getProductFilterOptions() {
  const [sizes, colours, priceRange] = await Promise.all([
    prisma.productVariant.findMany({
      where: { product: { isActive: true }, size: { not: null } },
      distinct: ['size'],
      select: { size: true },
      orderBy: { size: 'asc' },
    }),
    prisma.productVariant.findMany({
      where: { product: { isActive: true }, colour: { not: null } },
      distinct: ['colour'],
      select: { colour: true },
      orderBy: { colour: 'asc' },
    }),
    prisma.product.aggregate({
      where: { isActive: true, isPriceVisible: true, price: { not: null } },
      _min: { price: true },
      _max: { price: true },
      _count: { price: true },
    }),
  ]);

  return {
    sizes: sizes.map((item) => item.size).filter(Boolean),
    colours: colours.map((item) => item.colour).filter(Boolean),
    priceRange: {
      min: priceRange._min.price ? Number(priceRange._min.price) : null,
      max: priceRange._max.price ? Number(priceRange._max.price) : null,
      hasPricedProducts: priceRange._count.price > 0,
    },
  };
}

export async function listAdminProducts(query) {
  const { page, limit, skip } = getPagination(query);
  const where = await buildProductWhere({ ...query, includeInactive: true });

  if (where.impossible) {
    return { products: [], meta: buildPaginationMeta({ page, limit, total: 0 }) };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ updatedAt: 'desc' }],
      include: productDetailInclude,
    }),
  ]);

  return {
    products: serializeProducts(products, { includeDetails: true }),
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

export async function getAdminProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productDetailInclude,
  });

  if (!product) throw new AppError('Product not found', 404);

  return serializeProduct(product, { includeDetails: true });
}

export async function createProduct(data) {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw new AppError('Category not found', 404);

  const slug = data.slug || (await generateUniqueSlug(prisma, 'product', data.name));

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      price: data.price ?? null,
      minimumOrderQuantity: data.minimumOrderQuantity ?? null,
    },
    include: productDetailInclude,
  });

  return serializeProduct(product, { includeDetails: true });
}

export async function updateProduct(id, data) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new AppError('Product not found', 404);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new AppError('Category not found', 404);
  }

  let slug;
  if (data.slug) {
    slug = await generateUniqueSlug(prisma, 'product', data.slug, id);
  } else if (data.name) {
    slug = await generateUniqueSlug(prisma, 'product', data.name, id);
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(slug ? { slug } : {}),
    },
    include: productDetailInclude,
  });

  return serializeProduct(product, { includeDetails: true });
}

export async function deleteProduct(id) {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) throw new AppError('Product not found', 404);

  await deleteMultipleAssets(
    existing.images.map((image) => ({ publicId: image.publicId })),
  );

  await prisma.product.delete({ where: { id } });
}

export async function addProductImage(productId, data) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);

  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
  }

  return prisma.productImage.create({
    data: {
      productId,
      ...data,
    },
  });
}

export async function updateProductImage(productId, imageId, data) {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });

  if (!image) throw new AppError('Product image not found', 404);

  if (data.isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });
  }

  return prisma.productImage.update({
    where: { id: imageId },
    data,
  });
}

export async function deleteProductImage(productId, imageId) {
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId },
  });

  if (!image) throw new AppError('Product image not found', 404);

  await safeDeleteCloudinaryAsset(image.publicId);
  await prisma.productImage.delete({ where: { id: imageId } });

  return image;
}

export async function addProductVariant(productId, data) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new AppError('Product not found', 404);

  return prisma.productVariant.create({
    data: {
      productId,
      ...data,
      priceAdjustment: data.priceAdjustment ?? null,
    },
  });
}

export async function updateProductVariant(productId, variantId, data) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });

  if (!variant) throw new AppError('Product variant not found', 404);

  return prisma.productVariant.update({
    where: { id: variantId },
    data: {
      ...data,
      priceAdjustment: data.priceAdjustment ?? undefined,
    },
  });
}

export async function deleteProductVariant(productId, variantId) {
  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });

  if (!variant) throw new AppError('Product variant not found', 404);

  await prisma.productVariant.delete({ where: { id: variantId } });
}
