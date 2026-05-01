import apiClient, { clearCache, clearTableOrdersCache } from "./client";

function clearFloorViewCache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("floorViewTables");
  }
}

export const paymentsAPI = {
  process: async (data) => {
    const response = await apiClient.post("/payments", data);

    if (data?.table_id) {
      clearTableOrdersCache(data.table_id);
      clearCache(`/orders/table/${data.table_id}`);
    } else {
      clearTableOrdersCache();
    }

    clearCache("/tables");
    clearCache("/bills");
    clearFloorViewCache();

    return response;
  },
};
