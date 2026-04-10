import apiClient from './client';

export const categoriesAPI = {
  create: async (data) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },
  
  // getAll: async () => {
  //   const response = await apiClient.get('/categories');
  //   return response.data;
  // },

  getAll: async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    return res.json();
  }

};
