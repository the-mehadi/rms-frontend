import apiClient, { fetchGet, clearCache } from './client';

export const menuItemsAPI = {
  getAll: async () => {
    return fetchGet('/menu-items');
  },

  create: async (formData) => {
    const response = await apiClient.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    clearCache('/menu-items');
    return response.data;
  },
};

