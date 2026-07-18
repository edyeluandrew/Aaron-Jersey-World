import { z } from 'zod';
import {
  attachmentsSchema,
  optionalBooleanSchema,
  optionalDateSchema,
  optionalEmailSchema,
  phoneSchema,
  preferredContactSchema,
} from './request.shared.js';

const inquiryTypes = ['GENERAL', 'PRODUCT', 'PRICING', 'DELIVERY', 'OTHER'];
const institutionTypes = [
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
];

export const createInquirySchema = z.object({
  type: z.enum(inquiryTypes).optional().default('GENERAL'),
  fullName: z.string().min(2, 'Full name is required').max(120),
  phone: phoneSchema,
  email: optionalEmailSchema,
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  preferredContactMethod: preferredContactSchema,
  attachments: attachmentsSchema,
});

export const createQuoteSchema = z.object({
  customerName: z.string().min(2, 'Name is required').max(120),
  organisationName: z.string().max(200).optional(),
  phone: phoneSchema,
  email: optionalEmailSchema,
  location: z.string().max(200).optional(),
  productId: z.string().optional(),
  productSlug: z.string().optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  selectedSize: z.string().max(40).optional(),
  selectedColour: z.string().max(80).optional(),
  sizeQuantities: z.string().max(2000).optional(),
  brandingRequired: optionalBooleanSchema.optional().default(false),
  requiredDate: optionalDateSchema,
  budgetRange: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
  preferredContactMethod: preferredContactSchema,
  attachments: attachmentsSchema,
});

export const createBrandingSchema = z.object({
  customerName: z.string().min(2, 'Name is required').max(120),
  organisationName: z.string().max(200).optional(),
  phone: phoneSchema,
  email: optionalEmailSchema,
  serviceType: z.string().min(2, 'Service type is required').max(200),
  productType: z.string().max(200).optional(),
  quantity: z.coerce.number().int().positive().optional(),
  preferredColour: z.string().max(120).optional(),
  sizes: z.string().max(200).optional(),
  requiredDate: optionalDateSchema,
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  preferredContactMethod: preferredContactSchema,
  attachments: attachmentsSchema,
});

export const createInstitutionalSchema = z.object({
  contactPerson: z.string().min(2, 'Contact person is required').max(120),
  institutionName: z.string().min(2, 'Institution name is required').max(200),
  institutionType: z.enum(institutionTypes),
  phone: phoneSchema,
  email: optionalEmailSchema,
  location: z.string().max(200).optional(),
  productsRequired: z.string().min(10, 'Please describe what you need').max(5000),
  estimatedQuantity: z.string().max(120).optional(),
  brandingRequired: optionalBooleanSchema.optional().default(false),
  requiredDate: optionalDateSchema,
  budgetRange: z.string().max(120).optional(),
  additionalNotes: z.string().max(5000).optional(),
  preferredContactMethod: preferredContactSchema,
  attachments: attachmentsSchema,
});
