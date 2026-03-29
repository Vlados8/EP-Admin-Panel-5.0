import { apiClient } from './client';

export const loginAPI = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
