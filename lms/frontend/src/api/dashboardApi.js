import axiosInstance from './axios';

export const dashboardApi = {
  // Get dashboard summary statistics
  getSummary: async () => {
    const response = await axiosInstance.get('/dashboard/summary/');
    return response.data;
  },
};