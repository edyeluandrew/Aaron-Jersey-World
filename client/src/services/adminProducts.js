import apiClient from '@/api/client';

export async function fetchAdminProducts(params = {}) {
  const { data } = await apiClient.get('/admin/products', { params: { ...params, includeInactive: true } });
  return { products: data.data, meta: data.meta };
}

export async function fetchAdminProduct(id) {
  const { data } = await apiClient.get(`/admin/products/${id}`);
  return data.data;
}

export async function createAdminProduct(payload) {
  const { data } = await apiClient.post('/admin/products', payload);
  return data.data;
}

export async function updateAdminProduct(id, payload) {
  const { data } = await apiClient.patch(`/admin/products/${id}`, payload);
  return data.data;
}

export async function deleteAdminProduct(id) {
  const { data } = await apiClient.delete(`/admin/products/${id}`);
  return data;
}
