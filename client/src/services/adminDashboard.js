import apiClient from '@/api/client';

export async function fetchDashboardStats() {
  const { data } = await apiClient.get('/admin/dashboard');
  return data.data;
}
