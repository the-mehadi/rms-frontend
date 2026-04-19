import apiClient from "./client";

export const ordersAPI = {
  create: async (data) => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  getByTable: async (tableId) => {
    const response = await apiClient.get(`/orders/table/${tableId}`);
    return response.data;
  },
};
