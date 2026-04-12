import apiClient from './client';

export const menuItemsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/menu-items');
    return response.data;
  },

  create: async (formData) => {
    const response = await apiClient.post('/menu-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

