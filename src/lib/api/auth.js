import apiClient from './client';
import Cookies from 'js-cookie';

export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    // Returning the 'data' property which contains access_token and user info
    return response.data;
  },
  
  // logout: () => {
  //   if (typeof window !== 'undefined') {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //     Cookies.remove('token');
  //     Cookies.remove('user');
  //   }
  // },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout'); // call backend
    } catch (err) {
      // even if API fails, still force logout locally
      console.log('Logout API failed');
    } finally {
      // always clear client state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
  }

};
