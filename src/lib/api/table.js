import apiClient, { fetchGet, clearCache } from './client';

// Clear floor view localStorage cache
function clearFloorViewCache() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('floorViewTables');
  }
}

export const tablesAPI = {
  getAll: async () => {
    return fetchGet('/tables');
  },

  create: async (data) => {
    const response = await apiClient.post('/tables', data);
    clearCache('/tables');
    clearFloorViewCache();
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tables/${id}`, data);
    clearCache('/tables');
    clearCache(`/tables/${id}`);
    clearFloorViewCache();
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tables/${id}`);
    clearCache('/tables');
    clearCache(`/tables/${id}`);
    clearFloorViewCache();
    return response.data;
  },
};
