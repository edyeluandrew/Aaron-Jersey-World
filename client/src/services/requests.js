import apiClient from '@/api/client';

export async function submitInquiry(payload) {
  const { data } = await apiClient.post('/inquiries', payload);
  return data.data;
}

export async function submitQuoteRequest(payload) {
  const { data } = await apiClient.post('/quotes', payload);
  return data.data;
}

export async function submitBrandingRequest(payload) {
  const { data } = await apiClient.post('/branding-requests', payload);
  return data.data;
}

export async function submitInstitutionalRequest(payload) {
  const { data } = await apiClient.post('/institutional-requests', payload);
  return data.data;
}

export async function uploadRequestFile(file, purpose) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post(`/uploads/request-file?purpose=${purpose}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}
