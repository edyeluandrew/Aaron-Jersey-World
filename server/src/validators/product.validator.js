import { z } from 'zod';

const stockStatuses = [
  'IN_STOCK',
  'LOW_STOCK',
  'OUT_OF_STOCK',
  'MADE_TO_ORDER',
  'CONTACT_FOR_AVAILABILITY',
];

const priceTypes = ['FIXED', 'STARTING_FROM', 'REQUEST_PRICE'];

const sortOptions = [
  'featured',
  'newest',
  'name-asc',
  'name-desc',
  'price-asc',
  'price-desc',
];

const optionalBooleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((val) => (val === undefined ? undefined : val === 'true'));

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  stockStatus: z.enum(stockStatuses).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  size: z.string().optional(),
  colour: z.string().optional(),
  featured: optionalBooleanQuery,
  brandingAvailable: optionalBooleanQuery,
  sort: z.enum(sortOptions).optional(),
  includeInactive: optionalBooleanQuery,
});

export const productSlugSchema = z.object({
  slug: z.string().min(1),
});

export const productIdSchema = z.object({
  id: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  sku: z.string().optional(),
  price: z.coerce.number().nonnegative().optional().nullable(),
  priceType: z.enum(priceTypes).optional(),
  currency: z.string().optional(),
  isPriceVisible: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  stockStatus: z.enum(stockStatuses).optional(),
  brandingAvailable: z.boolean().optional(),
  minimumOrderQuantity: z.coerce.number().int().positive().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();

export const createProductImageSchema = z.object({
  secureUrl: z.string().url('A valid image URL is required'),
  publicId: z.string().min(1, 'Cloudinary public ID is required'),
  altText: z.string().optional(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
  sortOrder: z.coerce.number().int().optional(),
  isPrimary: z.boolean().optional(),
});

export const updateProductImageSchema = createProductImageSchema.partial();

export const productImageParamsSchema = z.object({
  id: z.string().min(1),
  imageId: z.string().min(1),
});

export const createProductVariantSchema = z.object({
  size: z.string().optional().nullable(),
  colour: z.string().optional().nullable(),
  version: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  priceAdjustment: z.coerce.number().optional().nullable(),
  stockStatus: z.enum(stockStatuses).optional(),
});

export const updateProductVariantSchema = createProductVariantSchema.partial();

export const productVariantParamsSchema = z.object({
  id: z.string().min(1),
  variantId: z.string().min(1),
});

export const importProductFolderSchema = z.object({
  folder: z
    .string()
    .min(1, 'Cloudinary folder path is required')
    .max(200)
    .transform((value) => value.replace(/^\/+|\/+$/g, '')),
});

export const featuredQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(24).optional(),
});

export const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(12).optional(),
});
