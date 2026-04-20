import apiClient, { fetchGet, clearCache } from './client';

export const categoriesAPI = {
  create: async (data) => {
    const response = await apiClient.post('/categories', data);
    clearCache('/categories');
    return response.data;
  },

  getAll: async () => {
    return fetchGet('/categories');
  }

};
