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

export function formatProductPrice(product, variant = null) {
  if (!product?.isPriceVisible || product.price == null) {
    return product?.priceType === PRICE_TYPES.REQUEST_PRICE ? 'Request price' : null;
  }

  const basePrice = Number(product.price);
  const adjustment = variant?.priceAdjustment != null ? Number(variant.priceAdjustment) : 0;
  const total = basePrice + adjustment;

  const formatted = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: product.currency || 'UGX',
    maximumFractionDigits: 0,
  }).format(total);

  if (product.priceType === PRICE_TYPES.STARTING_FROM) {
    return `From ${formatted}`;
  }

  return formatted;
}

export function findMatchingVariant(variants = [], { size, colour } = {}) {
  if (!variants.length) return null;

  return (
    variants.find((variant) => {
      const sizeMatch = !size || variant.size === size;
      const colourMatch = !colour || variant.colour === colour;
      return sizeMatch && colourMatch;
    }) || null
  );
}

export function parseSizeQuantities(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((line) => line?.size && Number(line.quantity) > 0)
      : [];
  } catch {
    return [];
  }
}

export function formatSizeQuantitiesSummary(value) {
  const lines = parseSizeQuantities(value);
  if (!lines.length) return '';

  return lines.map((line) => `${line.size} × ${line.quantity}`).join(', ');
}

export function buildQuoteSearchParams({ product, size, colour, quantity, sizeQuantities }) {
  const params = new URLSearchParams();
  if (product?.slug) params.set('product', product.slug);
  if (size) params.set('size', size);
  if (colour) params.set('colour', colour);
  if (quantity) params.set('quantity', String(quantity));
  if (sizeQuantities?.length) {
    params.set('sizeQuantities', JSON.stringify(sizeQuantities));
  }
  return params.toString();
}

export function getUniqueVariantValues(variants = [], key) {
  return [...new Set(variants.map((v) => v[key]).filter(Boolean))];
}

export function buildProductWhatsAppMessage(product, { size, colour, quantity, sizeQuantities } = {}) {
  const lines = [
    'Hello Aaron Jersey World,',
    `I would like to enquire about: ${product.name}`,
  ];

  if (product.sku) lines.push(`SKU: ${product.sku}`);
  if (size) lines.push(`Size: ${size}`);
  if (colour) lines.push(`Colour: ${colour}`);
  if (quantity) lines.push(`Quantity: ${quantity}`);

  const breakdown = formatSizeQuantitiesSummary(
    sizeQuantities?.length ? JSON.stringify(sizeQuantities) : '',
  );
  if (breakdown) lines.push(`Size breakdown: ${breakdown}`);

  lines.push('Please share availability and pricing.');
  return lines.join('\n');
}
