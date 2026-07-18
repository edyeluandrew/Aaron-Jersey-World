import { z } from 'zod';

const phoneSchema = z.string().min(9, 'Phone number is required').max(20);
const optionalEmailSchema = z
  .string()
  .email('Enter a valid email address')
  .optional()
  .or(z.literal(''));

const attachmentSchema = z.object({
  secureUrl: z.string().url(),
  publicId: z.string().min(1),
  originalName: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
});

export const inquirySchema = z.object({
  type: z.enum(['GENERAL', 'PRODUCT', 'PRICING', 'DELIVERY', 'OTHER']).default('GENERAL'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: phoneSchema,
  email: optionalEmailSchema,
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL', 'ANY']).default('ANY'),
  attachments: z.array(attachmentSchema).max(5).default([]),
});

export const quoteSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  organisationName: z.string().optional(),
  phone: phoneSchema,
  email: optionalEmailSchema,
  location: z.string().optional(),
  productSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional().or(z.literal('')),
  selectedSize: z.string().max(40).optional(),
  selectedColour: z.string().max(80).optional(),
  sizeQuantities: z.string().max(2000).optional(),
  brandingRequired: z.boolean().default(false),
  requiredDate: z.string().optional(),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  preferredContactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL', 'ANY']).default('ANY'),
  attachments: z.array(attachmentSchema).max(5).default([]),
});

export const brandingSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  organisationName: z.string().optional(),
  phone: phoneSchema,
  email: optionalEmailSchema,
  serviceType: z.string().min(2, 'Service type is required'),
  productType: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional().or(z.literal('')),
  preferredColour: z.string().optional(),
  sizes: z.string().optional(),
  requiredDate: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  preferredContactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL', 'ANY']).default('ANY'),
  attachments: z.array(attachmentSchema).max(5).default([]),
});

export const institutionalSchema = z.object({
  contactPerson: z.string().min(2, 'Contact person is required'),
  institutionName: z.string().min(2, 'Institution name is required'),
  institutionType: z.enum([
    'SCHOOL',
    'UNIVERSITY',
    'FOOTBALL_CLUB',
    'COMPANY',
    'NGO',
    'ASSOCIATION',
    'CHURCH',
    'TOURNAMENT_ORGANISER',
    'GOVERNMENT',
    'COMMUNITY',
    'OTHER',
  ]),
  phone: phoneSchema,
  email: optionalEmailSchema,
  location: z.string().optional(),
  productsRequired: z.string().min(10, 'Please describe what you need'),
  estimatedQuantity: z.string().optional(),
  brandingRequired: z.boolean().default(false),
  requiredDate: z.string().optional(),
  budgetRange: z.string().optional(),
  additionalNotes: z.string().optional(),
  preferredContactMethod: z.enum(['PHONE', 'WHATSAPP', 'EMAIL', 'ANY']).default('ANY'),
  attachments: z.array(attachmentSchema).max(5).default([]),
});

function cleanPayload(values) {
  const payload = { ...values };

  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] == null) {
      delete payload[key];
    }
  });

  if (payload.email === '') delete payload.email;
  if (payload.quantity === '') delete payload.quantity;
  if (payload.sizeQuantities === '') delete payload.sizeQuantities;
  if (!payload.attachments?.length) delete payload.attachments;

  return payload;
}

export function toInquiryPayload(values) {
  return cleanPayload(values);
}

export function toQuotePayload(values) {
  return cleanPayload(values);
}

export function toBrandingPayload(values) {
  return cleanPayload(values);
}

export function toInstitutionalPayload(values) {
  return cleanPayload(values);
}
