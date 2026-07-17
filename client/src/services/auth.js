import apiClient from '@/api/client';

export async function login(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data.data.user;
}

export async function logout() {
  const { data } = await apiClient.post('/auth/logout');
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data.data.user ?? null;
}

export async function refreshSession() {
  const { data } = await apiClient.post('/auth/refresh');
  return data.data.user;
}

export async function changePassword(payload) {
  const { data } = await apiClient.patch('/auth/change-password', payload);
  return data.data.user;
}
