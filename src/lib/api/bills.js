import apiClient from "./client";

export const billsAPI = {
  getAll: async () => {
    const response = await apiClient.get("/bills");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/bills/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/bills", data);
    return response.data;
  },
  getReceipt: async (id) => {
    const response = await apiClient.get(`/bills/${id}/receipt`);
    return response.data;
  },
};
