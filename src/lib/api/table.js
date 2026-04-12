import apiClient from './client';

export const tablesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/tables');
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/tables', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tables/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tables/${id}`);
    return response.data;
  },
};
