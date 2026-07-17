import apiClient from '@/api/client';

const ENDPOINTS = {
  inquiries: '/admin/inquiries',
  quotes: '/admin/quotes',
  branding: '/admin/branding-requests',
  institutional: '/admin/institutional-requests',
};

export async function fetchAdminRequests(type, params = {}) {
  const { data } = await apiClient.get(ENDPOINTS[type], { params });
  return { records: data.data, meta: data.meta };
}

export async function fetchAdminRequest(type, id) {
  const { data } = await apiClient.get(`${ENDPOINTS[type]}/${id}`);
  return data.data;
}

export async function updateAdminRequestStatus(type, id, status) {
  const { data } = await apiClient.patch(`${ENDPOINTS[type]}/${id}/status`, { status });
  return data.data;
}
