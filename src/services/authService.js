import api from './api';
import axios from 'axios';
import { storageService } from './AsyncStorage';
import { refreshAuthToken, logout, isAuthenticated } from './api';

export const authService = {
  // Login
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

  // Register
  register: async userData => {
    try {
      const response = await api.post('/user/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Password reset
  forgotPassword: async email => {
    try {
      const response = await api.post('/user/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
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

  // Google register
  registerWithGoogle: async googleUser => {
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/auth/google-register',
        {
          token: googleUser.idToken,
        },
      );
      return response.data;
    } catch (error) {
      console.error('Google register error:', error);
      throw error;
    }
  },

  // 🆕 YENİ TOKEN YENİLEME SİSTEMİ
  
  // Manual token refresh
  refreshToken: async () => {
    try {
      const result = await refreshAuthToken();
      if (result.success) {
        console.log('✅ Token başarıyla yenilendi');
        return {
          success: true,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        };
      } else {
        console.log('❌ Token yenileme başarısız');
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      return await isAuthenticated();
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Secure logout
  secureLogout: async () => {
    try {
      return await logout();
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  // 🔄 Authenticated API call with auto-refresh
  makeAuthenticatedCall: async (endpoint, options = {}) => {
    try {
      const response = await api({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data,
        params: options.params,
        headers: options.headers
      });
      return response.data;
    } catch (error) {
      // API interceptor zaten token yenileme işlemini yapacak
      throw error.response?.data || error.message;
    }
  }
  
}





