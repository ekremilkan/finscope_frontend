import api from './api';

export const authService = {
  // Giriş yap
  login: async (email, password) => {
    try {
      const response = await api.post('/user/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kayıt ol
  register: async userData => {
    try {
      const response = await api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kullanıcı bilgilerini al
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Şifre sıfırlama
  forgotPassword: async email => {
    try {
      const response = await api.post('/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  //çıkış yap
  logoutUser: async (userId, token) => {
    try {
      const response = await api.post(
        `/user/logout/${userId}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
