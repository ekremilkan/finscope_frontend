import api from './api';
import axios from 'axios';
import { storageService } from './AsyncStorage';

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
  
}





