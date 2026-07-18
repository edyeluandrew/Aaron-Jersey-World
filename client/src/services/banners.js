import apiClient from '@/api/client';

export async function fetchHeroBanners() {
  const { data } = await apiClient.get('/banners');
  return data.data;
}
