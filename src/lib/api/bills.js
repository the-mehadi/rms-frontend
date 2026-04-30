import apiClient, { fetchGet, clearCache, clearTableOrdersCache } from "./client";

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

    if (data?.table_id) {
      clearTableOrdersCache(data.table_id);
      clearCache(`/orders/table/${data.table_id}`);
    } else {
      clearTableOrdersCache();
    }

    clearCache("/bills");
    clearCache("/tables");
    clearFloorViewCache();
    return response;
  },
  getReceipt: async (id) => {
    return fetchGet(`/bills/${id}/receipt`);
  },
};
