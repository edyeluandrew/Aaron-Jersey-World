import apiClient from '@/api/client';
import { clearAuthTokens, getRefreshToken, persistAuthTokens } from '@/api/authToken';

export async function login(credentials) {
  const { data } = await apiClient.post('/auth/login', credentials);
  persistAuthTokens(data.data);
  return data.data.user;
}

export async function logout() {
  try {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  } finally {
    clearAuthTokens();
  }
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me');
  return data.data.user ?? null;
}

export async function refreshSession() {
  const refreshToken = getRefreshToken();
  const { data } = await apiClient.post('/auth/refresh', refreshToken ? { refreshToken } : {});
  persistAuthTokens(data.data);
  return data.data.user;
}

export async function changePassword(payload) {
  const { data } = await apiClient.patch('/auth/change-password', payload);
  clearAuthTokens();
  return data.data.user;
}
