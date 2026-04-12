import apiClient from './client';

export const tablesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/tables');
    return response.data;
  },
};
