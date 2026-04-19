import apiClient from "./client";

export const paymentsAPI = {
  process: async (data) => {
    const response = await apiClient.post("/payments", data);
    return response.data;
  },
};
