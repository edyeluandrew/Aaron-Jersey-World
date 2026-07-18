import { env } from '../config/env.js';

const TRANSFORM_PRESETS = {
  productCard: ['f_auto', 'q_auto', 'w_600', 'h_600', 'c_fill'],
  productDetail: ['f_auto', 'q_auto', 'w_1200', 'h_1200', 'c_limit'],
  productThumbnail: ['f_auto', 'q_auto', 'w_200', 'h_200', 'c_fill'],
  categoryCard: ['f_auto', 'q_auto', 'w_800', 'h_600', 'c_fill'],
  heroBannerCard: ['f_auto', 'q_auto:best', 'w_1000', 'h_1250', 'c_fill', 'dpr_auto'],
  heroBannerFull: ['f_auto', 'q_auto:best', 'w_1920', 'h_1200', 'c_fill', 'dpr_auto'],
  testimonialAvatar: ['f_auto', 'q_auto', 'w_120', 'h_120', 'c_fill'],
};

function buildTransformUrl(publicId, preset, resourceType = 'image') {
  if (!publicId || !env.CLOUDINARY_CLOUD_NAME) return null;

  const cloudName = env.CLOUDINARY_CLOUD_NAME.trim();
  if (!cloudName || /\s/.test(cloudName)) return null;

  const transforms = TRANSFORM_PRESETS[preset];
  if (!transforms) return null;

  const transformPath = transforms.join(',');
  const deliveryType = resourceType === 'raw' ? 'raw' : 'image';

  return `https://res.cloudinary.com/${cloudName}/${deliveryType}/upload/${transformPath}/${publicId}`;
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

export function getHeroBannerCardUrl(publicId) {
  return buildTransformUrl(publicId, 'heroBannerCard');
}

export function getHeroBannerFullUrl(publicId) {
  return buildTransformUrl(publicId, 'heroBannerFull');
}

/** @deprecated Use getHeroBannerCardUrl */
export function getHeroBannerUrl(publicId) {
  return getHeroBannerCardUrl(publicId);
}

export function getTestimonialAvatarUrl(publicId) {
  return buildTransformUrl(publicId, 'testimonialAvatar');
}

export function enrichImageWithUrls(image) {
  if (!image?.publicId) return image;

  const card = getProductCardUrl(image.publicId) || image.secureUrl;
  const detail = getProductDetailUrl(image.publicId) || image.secureUrl;
  const thumbnail = getProductThumbnailUrl(image.publicId) || image.secureUrl;

  return {
    ...image,
    urls: {
      original: image.secureUrl,
      card,
      detail,
      thumbnail,
    },
  };
}

export function enrichCategoryWithUrls(category) {
  if (!category?.imageUrl && !category?.imagePublicId) return category;

  const card = getCategoryCardUrl(category.imagePublicId) || category.imageUrl;

  return {
    ...category,
    imageUrls: {
      original: category.imageUrl,
      card: card || category.imageUrl,
    },
  };
}

export function enrichBannerWithUrls(banner) {
  if (!banner?.imageUrl) return banner;

  const hero = getHeroBannerCardUrl(banner.imagePublicId) || banner.imageUrl;
  const heroFull = getHeroBannerFullUrl(banner.imagePublicId) || banner.imageUrl;

  return {
    ...banner,
    imageUrls: {
      original: banner.imageUrl,
      hero: hero || banner.imageUrl,
      heroFull: heroFull || banner.imageUrl,
    },
  };
}
