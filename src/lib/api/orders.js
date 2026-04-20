import apiClient, { fetchGet, clearCache, clearTableOrdersCache } from "./client";

// Clear floor view localStorage cache
function clearFloorViewCache() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('floorViewTables');
  }
}

export const ordersAPI = {
  create: async (data) => {
    const response = await apiClient.post("/orders", data);
    console.log("Order created:", response.data);
    // Clear table orders cache for the table
    if (data.table_id) {
      clearTableOrdersCache(data.table_id);
      clearCache(`/orders/table/${data.table_id}`);
    }
    clearCache('/tables');
    clearFloorViewCache();
    return response;
  },
  updateStatus: async (id, status, tableId) => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    if (tableId) {
      clearTableOrdersCache(tableId);
    } else {
      clearTableOrdersCache(); // Clear all
    }
    clearCache(`/orders/table/`);
    clearCache('/tables');
    clearFloorViewCache();
    return response.data;
  },
  getByTable: async (tableId) => {
    return fetchGet(`/orders/table/${tableId}`);
  },
};
