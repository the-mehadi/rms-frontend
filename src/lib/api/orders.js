import apiClient from "./client";

export const ordersAPI = {
  create: async (data) => {
    const response = await apiClient.post("/orders", data);
    return response.data;
  },
};
