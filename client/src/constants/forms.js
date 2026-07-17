export const INQUIRY_TYPES = [
  { value: 'GENERAL', label: 'General enquiry' },
  { value: 'PRODUCT', label: 'Product question' },
  { value: 'PRICING', label: 'Pricing' },
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'OTHER', label: 'Other' },
];

export const PREFERRED_CONTACT_METHODS = [
  { value: 'ANY', label: 'Any method' },
  { value: 'PHONE', label: 'Phone call' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL', label: 'Email' },
];

export const INSTITUTION_TYPES = [
  { value: 'SCHOOL', label: 'School' },
  { value: 'UNIVERSITY', label: 'University / College' },
  { value: 'FOOTBALL_CLUB', label: 'Football club' },
  { value: 'COMPANY', label: 'Company' },
  { value: 'NGO', label: 'NGO' },
  { value: 'ASSOCIATION', label: 'Association' },
  { value: 'CHURCH', label: 'Church / Community group' },
  { value: 'TOURNAMENT_ORGANISER', label: 'Tournament organiser' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'COMMUNITY', label: 'Community' },
  { value: 'OTHER', label: 'Other' },
];

export const BRANDING_SERVICE_TYPES = [
  'Team logos & crests',
  'Names & numbers',
  'Corporate branding',
  'School & institution branding',
  'Embroidery',
  'Other custom branding',
];

export const UPLOAD_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp,application/pdf';
export const UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const UPLOAD_MAX_FILES = 5;

export const inputClassName =
  'w-full rounded-button border border-border-light bg-white px-3 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red';

export const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

export const selectClassName = inputClassName;

export const labelClassName = 'mb-2 block text-sm font-semibold text-brand-black';

export const errorClassName = 'mt-1 text-sm text-error';
