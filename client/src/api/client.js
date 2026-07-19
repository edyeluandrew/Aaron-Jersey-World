import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  persistAuthTokens,
} from '@/api/authToken';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();

    refreshPromise = apiClient
      .post('/auth/refresh', refreshToken ? { refreshToken } : {})
      .then((response) => {
        persistAuthTokens(response.data?.data ?? {});
        return response;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/me');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject({
          message: refreshError.response?.data?.message || 'Session expired. Please log in again.',
          errors: refreshError.response?.data?.errors || null,
          status: 401,
          unauthorized: true,
        });
      }
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.',
      errors: error.response?.data?.errors || null,
      status: error.response?.status || 500,
      unauthorized: status === 401,
    });
  },
);

export default apiClient;
