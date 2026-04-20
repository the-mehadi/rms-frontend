import apiClient, { fetchGet, clearCache } from "./client";

// Clear floor view localStorage cache
function clearFloorViewCache() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('floorViewTables');
  }
}

export const billsAPI = {
  getAll: async () => {
    return fetchGet("/bills");
  },
  getById: async (id) => {
    return fetchGet(`/bills/${id}`);
  },
  create: async (data) => {
    const response = await apiClient.post("/bills", data);
    clearCache("/bills");
    clearFloorViewCache();
    return response.data;
  },
  getReceipt: async (id) => {
    return fetchGet(`/bills/${id}/receipt`);
  },
};
