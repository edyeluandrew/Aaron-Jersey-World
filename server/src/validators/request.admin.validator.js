import { z } from 'zod';

const requestStatuses = [
  'NEW',
  'CONTACTED',
  'IN_REVIEW',
  'QUOTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
];

export const adminRequestListSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z.enum(requestStatuses).optional(),
  search: z.string().optional(),
});

export const adminRequestIdSchema = z.object({
  id: z.string().min(1),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(requestStatuses),
});
