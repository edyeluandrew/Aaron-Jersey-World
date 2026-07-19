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

export async function importAdminProductImagesFromFolder(productId, payload) {
  const { data } = await apiClient.post(`/admin/products/${productId}/images/import-folder`, payload);
  return data.data;
}

export async function addAdminProductImage(productId, payload) {
  const { data } = await apiClient.post(`/admin/products/${productId}/images`, payload);
  return data.data;
}

export async function updateAdminProductImage(productId, imageId, payload) {
  const { data } = await apiClient.patch(`/admin/products/${productId}/images/${imageId}`, payload);
  return data.data;
}

export async function deleteAdminProductImage(productId, imageId) {
  const { data } = await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
  return data;
}

export async function uploadAdminProductImage(productId, file, meta = {}) {
  const formData = new FormData();
  formData.append('file', file);
  if (meta.altText) formData.append('altText', meta.altText);
  if (meta.isPrimary != null) formData.append('isPrimary', String(meta.isPrimary));
  if (meta.sortOrder != null) formData.append('sortOrder', String(meta.sortOrder));

  const { data } = await apiClient.post(`/admin/uploads/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function addAdminProductVariant(productId, payload) {
  const { data } = await apiClient.post(`/admin/products/${productId}/variants`, payload);
  return data.data;
}

export async function updateAdminProductVariant(productId, variantId, payload) {
  const { data } = await apiClient.patch(`/admin/products/${productId}/variants/${variantId}`, payload);
  return data.data;
}

export async function deleteAdminProductVariant(productId, variantId) {
  const { data } = await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`);
  return data;
}
