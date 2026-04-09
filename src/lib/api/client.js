import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
apiClient.interceptors.request.use((config) => {
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  if (!token && typeof window !== 'undefined') {
    token = Cookies.get('token');
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
