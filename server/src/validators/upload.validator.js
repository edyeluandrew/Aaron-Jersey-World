import { z } from 'zod';

export const publicUploadSchema = z.object({
  purpose: z.enum(['branding', 'institutional', 'quote', 'inquiry'], {
    required_error: 'Upload purpose is required',
  }),
});

export const adminUploadSchema = z.object({
  folder: z.enum(['product', 'category', 'banner', 'testimonial']),
});

export const productImageUploadSchema = z.object({
  altText: z.string().optional(),
  isPrimary: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => (val === undefined ? false : val === 'true')),
  sortOrder: z.coerce.number().int().optional(),
});
