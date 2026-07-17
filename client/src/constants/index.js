export const APP_NAME = 'Aaron Jersey World';
export const APP_TAGLINE = 'Your Life Partner';
export const APP_DESCRIPTION =
  'Shop club jerseys, custom teamwear, sports equipment, trophies, medals and professional branding services from Aaron Jersey World at Arua Park Plaza, Kampala.';

export const DEFAULT_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '256781161690';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
export const GOOGLE_MAPS_EMBED_URL = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || '';

export const CONTACT = {
  location: 'Kampala, Arua Park Plaza, Uganda',
  phones: ['+256 781 161690', '+256 781 712276', '+256 792 773146'],
};

export const PRICE_TYPES = {
  FIXED: 'FIXED',
  STARTING_FROM: 'STARTING_FROM',
  REQUEST_PRICE: 'REQUEST_PRICE',
};

export const STOCK_STATUSES = {
  IN_STOCK: 'IN_STOCK',
  LOW_STOCK: 'LOW_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  MADE_TO_ORDER: 'MADE_TO_ORDER',
  CONTACT_FOR_AVAILABILITY: 'CONTACT_FOR_AVAILABILITY',
};

export const REQUEST_STATUSES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  IN_REVIEW: 'IN_REVIEW',
  QUOTED: 'QUOTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED',
};
