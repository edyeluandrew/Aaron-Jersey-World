export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Custom Branding', to: '/custom-branding' },
  { label: 'Institutions', to: '/institutions' },
  { label: 'Trophies & Awards', to: '/trophies-awards' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_PRODUCT_LINKS = [
  { label: 'Club Jerseys', to: '/categories/club-jerseys' },
  { label: 'Custom Team Kits', to: '/categories/custom-team-kits' },
  { label: 'Football Boots', to: '/categories/football-boots' },
  { label: 'Balls & Equipment', to: '/categories/balls' },
  { label: 'Trophies & Medals', to: '/trophies-awards' },
];

export const FOOTER_SERVICE_LINKS = [
  { label: 'Custom Branding', to: '/custom-branding' },
  { label: 'Institutional Supply', to: '/institutions' },
  { label: 'Request a Quote', to: '/request-quote' },
];

export const QUERY_KEYS = {
  categories: ['categories'],
  category: (slug) => ['category', slug],
  products: (params) => ['products', params],
  product: (slug) => ['product', slug],
  featuredProducts: ['products', 'featured'],
  relatedProducts: (slug) => ['products', slug, 'related'],
  siteSettings: ['site-settings'],
  productFilters: ['products', 'filters'],
};
