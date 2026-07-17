import { env } from '../config/env.js';

const TRANSFORM_PRESETS = {
  productCard: ['f_auto', 'q_auto', 'w_600', 'h_600', 'c_fill'],
  productDetail: ['f_auto', 'q_auto', 'w_1200', 'h_1200', 'c_limit'],
  productThumbnail: ['f_auto', 'q_auto', 'w_200', 'h_200', 'c_fill'],
  categoryCard: ['f_auto', 'q_auto', 'w_800', 'h_600', 'c_fill'],
  heroBanner: ['f_auto', 'q_auto', 'w_1600', 'h_900', 'c_fill'],
  testimonialAvatar: ['f_auto', 'q_auto', 'w_120', 'h_120', 'c_fill'],
};

function buildTransformUrl(publicId, preset, resourceType = 'image') {
  if (!publicId || !env.CLOUDINARY_CLOUD_NAME) return null;

  const transforms = TRANSFORM_PRESETS[preset];
  if (!transforms) return null;

  const transformPath = transforms.join(',');
  const deliveryType = resourceType === 'raw' ? 'raw' : 'image';

  return `https://res.cloudinary.com/${env.CLOUDINARY_CLOUD_NAME}/${deliveryType}/upload/${transformPath}/${publicId}`;
}

export function getProductCardUrl(publicId) {
  return buildTransformUrl(publicId, 'productCard');
}

export function getProductDetailUrl(publicId) {
  return buildTransformUrl(publicId, 'productDetail');
}

export function getProductThumbnailUrl(publicId) {
  return buildTransformUrl(publicId, 'productThumbnail');
}

export function getCategoryCardUrl(publicId) {
  return buildTransformUrl(publicId, 'categoryCard');
}

export function getHeroBannerUrl(publicId) {
  return buildTransformUrl(publicId, 'heroBanner');
}

export function getTestimonialAvatarUrl(publicId) {
  return buildTransformUrl(publicId, 'testimonialAvatar');
}

export function enrichImageWithUrls(image) {
  if (!image?.publicId) return image;

  return {
    ...image,
    urls: {
      original: image.secureUrl,
      card: getProductCardUrl(image.publicId),
      detail: getProductDetailUrl(image.publicId),
      thumbnail: getProductThumbnailUrl(image.publicId),
    },
  };
}

export function enrichCategoryWithUrls(category) {
  if (!category?.imagePublicId) return category;

  return {
    ...category,
    imageUrls: {
      original: category.imageUrl,
      card: getCategoryCardUrl(category.imagePublicId),
    },
  };
}
