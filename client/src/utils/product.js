import { PRICE_TYPES, STOCK_STATUSES } from '@/constants';

export const STOCK_LABELS = {
  [STOCK_STATUSES.IN_STOCK]: { label: 'In stock', variant: 'success' },
  [STOCK_STATUSES.LOW_STOCK]: { label: 'Low stock', variant: 'warning' },
  [STOCK_STATUSES.OUT_OF_STOCK]: { label: 'Out of stock', variant: 'error' },
  [STOCK_STATUSES.MADE_TO_ORDER]: { label: 'Made to order', variant: 'default' },
  [STOCK_STATUSES.CONTACT_FOR_AVAILABILITY]: {
    label: 'Contact for availability',
    variant: 'default',
  },
};

export function formatProductPrice(product) {
  if (!product?.isPriceVisible || product.price == null) {
    return product?.priceType === PRICE_TYPES.REQUEST_PRICE ? 'Request price' : null;
  }

  const formatted = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: product.currency || 'UGX',
    maximumFractionDigits: 0,
  }).format(product.price);

  if (product.priceType === PRICE_TYPES.STARTING_FROM) {
    return `From ${formatted}`;
  }

  return formatted;
}

export function getUniqueVariantValues(variants = [], key) {
  return [...new Set(variants.map((v) => v[key]).filter(Boolean))];
}

export function buildProductWhatsAppMessage(product, { size, colour } = {}) {
  const lines = [
    'Hello Aaron Jersey World,',
    `I would like to enquire about: ${product.name}`,
  ];

  if (product.sku) lines.push(`SKU: ${product.sku}`);
  if (size) lines.push(`Size: ${size}`);
  if (colour) lines.push(`Colour: ${colour}`);

  lines.push('Please share availability and pricing.');
  return lines.join('\n');
}
