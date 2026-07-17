import { z } from 'zod';

export const phoneSchema = z
  .string()
  .min(9, 'Phone number is required')
  .max(20, 'Phone number is too long');

export const optionalEmailSchema = z
  .string()
  .email('A valid email address is required')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

export const preferredContactSchema = z
  .enum(['PHONE', 'WHATSAPP', 'EMAIL', 'ANY'])
  .optional()
  .default('ANY');

export const attachmentSchema = z.object({
  secureUrl: z.string().url('Attachment URL is invalid'),
  publicId: z.string().min(1, 'Attachment public ID is required'),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.coerce.number().int().positive().optional(),
});

export const attachmentsSchema = z.array(attachmentSchema).max(5).optional().default([]);

export const optionalDateSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? new Date(value) : undefined));

export const optionalBooleanSchema = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === 'boolean') return value;
    return value === 'true';
  });
