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
  { label: 'Jerseys', to: '/products/jerseys' },
  { label: 'Training Equipment', to: '/products/training-equipment' },
  { label: 'Custom Kits', to: '/products/custom-kits' },
  { label: 'Trophies & Medals', to: '/products/trophies-and-medals' },
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
