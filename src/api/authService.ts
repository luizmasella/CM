import apiClient from './apiClient';

export const loginUser = async (credentials: any) => {
  const response = await apiClient.post('/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await apiClient.post('/register', userData);
  return response.data;
};
