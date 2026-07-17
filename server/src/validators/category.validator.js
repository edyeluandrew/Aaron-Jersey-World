import { z } from 'zod';

const optionalBooleanQuery = z
  .enum(['true', 'false'])
  .optional()
  .transform((val) => (val === undefined ? undefined : val === 'true'));

export const categoryQuerySchema = z.object({
  includeInactive: optionalBooleanQuery,
});

export const categorySlugSchema = z.object({
  slug: z.string().min(1),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
