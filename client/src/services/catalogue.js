import apiClient from '@/api/client';

export async function fetchCategories() {
  const { data } = await apiClient.get('/categories');
  return data.data;
}

export async function fetchCategory(slug) {
  const { data } = await apiClient.get(`/categories/${slug}`);
  return data.data;
}

export async function fetchProducts(params = {}) {
  const { data } = await apiClient.get('/products', { params });
  return { products: data.data, meta: data.meta };
}

export async function fetchFeaturedProducts(limit = 8) {
  const { data } = await apiClient.get('/products/featured', { params: { limit } });
  return data.data;
}

export async function fetchProduct(slug) {
  const { data } = await apiClient.get(`/products/${slug}`);
  return data.data;
}

export async function fetchRelatedProducts(slug, limit = 8) {
  const { data } = await apiClient.get(`/products/${slug}/related`, { params: { limit } });
  return data.data;
}

export async function fetchProductFilters() {
  const { data } = await apiClient.get('/products/filters/options');
  return data.data;
}

export async function fetchPublicSiteSettings() {
  const { data } = await apiClient.get('/site-settings/public');
  return data.data;
}
