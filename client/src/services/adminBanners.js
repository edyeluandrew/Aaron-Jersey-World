import apiClient from '@/api/client';

export async function fetchAdminBanners() {
  const { data } = await apiClient.get('/admin/banners');
  return data.data;
}

export async function createAdminBanner(payload) {
  const { data } = await apiClient.post('/admin/banners', payload);
  return data.data;
}

export async function updateAdminBanner(id, payload) {
  const { data } = await apiClient.patch(`/admin/banners/${id}`, payload);
  return data.data;
}

export async function deleteAdminBanner(id) {
  const { data } = await apiClient.delete(`/admin/banners/${id}`);
  return data;
}
