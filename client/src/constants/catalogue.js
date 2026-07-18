export const MAIN_CATEGORIES = [
  {
    name: 'Jerseys',
    slug: 'jerseys',
    description: 'Club jerseys, vintage shirts, fan tops and team apparel.',
  },
  {
    name: 'Training Equipment',
    slug: 'training-equipment',
    description: 'Balls, boots, cones, bibs, nets, gloves and training gear.',
  },
  {
    name: 'Custom Kits',
    slug: 'custom-kits',
    description: 'Fully custom team kits, tracksuits and branded sets.',
  },
  {
    name: 'Trophies and Medals',
    slug: 'trophies-and-medals',
    description: 'Trophies, medals and awards for schools, clubs and events.',
  },
];

export const MAIN_CATEGORY_SLUGS = MAIN_CATEGORIES.map((category) => category.slug);

export const STANDARD_APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const LEGACY_CATEGORY_SLUGS = [
  'club-jerseys',
  'vintage-jerseys',
  'custom-team-kits',
  'football-boots',
  'goalkeeper-gloves',
  'balls',
  'branded-t-shirts',
  'goal-nets',
  'pool-tables',
  'sports-accessories',
];

export const CATEGORY_SLUG_REMAP = {
  'club-jerseys': 'jerseys',
  'vintage-jerseys': 'jerseys',
  'branded-t-shirts': 'jerseys',
  'football-boots': 'training-equipment',
  'goalkeeper-gloves': 'training-equipment',
  balls: 'training-equipment',
  'goal-nets': 'training-equipment',
  'sports-accessories': 'training-equipment',
  'training-equipment': 'training-equipment',
  'custom-team-kits': 'custom-kits',
  'trophies-and-medals': 'trophies-and-medals',
  'pool-tables': 'trophies-and-medals',
};

export function isMainCategory(slug) {
  return MAIN_CATEGORY_SLUGS.includes(slug);
}

export function filterMainCategories(categories = []) {
  return categories
    .filter((category) => isMainCategory(category.slug))
    .sort(
      (a, b) =>
        MAIN_CATEGORY_SLUGS.indexOf(a.slug) - MAIN_CATEGORY_SLUGS.indexOf(b.slug),
    );
}
