import { enrichCategoryWithUrls, enrichImageWithUrls } from './cloudinaryTransforms.js';

export function serializeDecimal(value) {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export function serializeProduct(product, { includeDetails = false } = {}) {
  if (!product) return null;

  const serialized = {
    ...product,
    price: serializeDecimal(product.price),
  };

  if (product.variants) {
    serialized.variants = product.variants.map((variant) => ({
      ...variant,
      priceAdjustment: serializeDecimal(variant.priceAdjustment),
    }));
  }

  if (product.images) {
    serialized.images = product.images.map(enrichImageWithUrls);
  }

  if (product.category) {
    serialized.category = enrichCategoryWithUrls(product.category);
  }

  if (!includeDetails) {
    delete serialized.description;
  }

  return serialized;
}

export function serializeProducts(products, options = {}) {
  return products.map((product) => serializeProduct(product, options));
}
