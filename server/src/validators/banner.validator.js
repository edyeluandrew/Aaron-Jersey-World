import { z } from 'zod';

export const createBannerSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  subtitle: z.string().max(240).optional().nullable(),
  imageUrl: z.string().url('A valid Cloudinary image URL is required'),
  imagePublicId: z.string().optional().nullable(),
  buttonText: z.string().max(80).optional().nullable(),
  buttonUrl: z.string().max(500).optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();

export const bannerIdSchema = z.object({
  id: z.string().min(1),
});
