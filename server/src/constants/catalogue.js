export const MAIN_CATEGORY_SLUGS = [
  'jerseys',
  'training-equipment',
  'custom-kits',
  'trophies-and-medals',
];

export const HOMEPAGE_MARQUEE_IMAGE_LIMIT = 7;

export function isMainCategorySlug(slug) {
  return MAIN_CATEGORY_SLUGS.includes(slug);
}
