import apiClient from '@/api/client';

export async function fetchAdminCategories() {
  const { data } = await apiClient.get('/admin/categories');
  return data.data;
}

export async function createAdminCategory(payload) {
  const { data } = await apiClient.post('/admin/categories', payload);
  return data.data;
}

export async function updateAdminCategory(id, payload) {
  const { data } = await apiClient.patch(`/admin/categories/${id}`, payload);
  return data.data;
}

export async function deleteAdminCategory(id) {
  const { data } = await apiClient.delete(`/admin/categories/${id}`);
  return data;
}

export async function uploadAdminCategoryImage(categoryId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post(`/admin/uploads/categories/${categoryId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
