export const UPLOAD_LIMITS = {
  IMAGE_MAX_BYTES: 5 * 1024 * 1024,
  FILE_MAX_BYTES: 10 * 1024 * 1024,
};

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_FILE_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  'application/pdf',
];

export const PUBLIC_UPLOAD_FOLDERS = {
  branding: 'BRANDING_REQUESTS',
  institutional: 'INSTITUTIONAL_REQUESTS',
  quote: 'QUOTE_ATTACHMENTS',
  inquiry: 'INQUIRY_ATTACHMENTS',
};

export const ADMIN_UPLOAD_FOLDERS = {
  product: 'PRODUCTS',
  category: 'CATEGORIES',
  banner: 'BANNERS',
  testimonial: 'TESTIMONIALS',
};

export function getResourceType(mimeType) {
  return mimeType === 'application/pdf' ? 'raw' : 'image';
}
