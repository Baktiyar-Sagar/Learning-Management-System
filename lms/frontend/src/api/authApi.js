import axiosInstance from './axios';

export const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register/', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login/', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.put('/auth/profile/', profileData);
    return response.data;
  },
};