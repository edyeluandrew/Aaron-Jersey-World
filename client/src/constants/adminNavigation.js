export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', end: true },
  { label: 'Products', to: '/admin/products' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Inquiries', to: '/admin/inquiries' },
  { label: 'Quotes', to: '/admin/quotes' },
  { label: 'Branding', to: '/admin/branding' },
  { label: 'Institutional', to: '/admin/institutional' },
];

export const REQUEST_STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_REVIEW', label: 'In review' },
  { value: 'QUOTED', label: 'Quoted' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export const REQUEST_TYPES = {
  inquiries: {
    label: 'Inquiries',
    singular: 'Inquiry',
    listPath: '/admin/inquiries',
  },
  quotes: {
    label: 'Quote requests',
    singular: 'Quote request',
    listPath: '/admin/quotes',
  },
  branding: {
    label: 'Branding requests',
    singular: 'Branding request',
    listPath: '/admin/branding',
  },
  institutional: {
    label: 'Institutional requests',
    singular: 'Institutional request',
    listPath: '/admin/institutional',
  },
};

export const ADMIN_QUERY_KEYS = {
  dashboard: ['admin', 'dashboard'],
  products: (params) => ['admin', 'products', params],
  product: (id) => ['admin', 'products', id],
  categories: ['admin', 'categories'],
  category: (id) => ['admin', 'categories', id],
  requests: (type, params) => ['admin', 'requests', type, params],
  request: (type, id) => ['admin', 'requests', type, id],
  me: ['auth', 'me'],
};
