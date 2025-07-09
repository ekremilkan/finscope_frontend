import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Add userToken before each request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Get new userToken with refresh token on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        console.log('🔄 Attempting token refresh...');

        // YENİ ENDPOINT: /api/v1/user/refresh-token
        const res = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/user/refresh-token`, {
          refreshToken,
        });

        // YENİ RESPONSE FORMAT
        if (res.data.success) {
          const { token: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

          // YENİ TOKEN'LARI KAYDET - Token Rotation
          await AsyncStorage.setItem('userToken', newAccessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          console.log('✅ Token refresh successful');

          // Original request'i yeni token ile tekrar dene
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          throw new Error(res.data.message || 'Token refresh failed');
        }
      } catch (refreshError) {
        // Refresh token invalid: logout
        console.log('❌ Refresh token expired, logging out user');
        console.error('Refresh error:', refreshError.response?.data || refreshError.message);
        
        await AsyncStorage.multiRemove(['userToken', 'refreshToken']);

        // Kullanıcıyı login ekranına yönlendir
        // NavigationService varsa burada kullanabiliriz
        // NavigationService.navigate('Login')
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper: Manual token refresh function
export const refreshAuthToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    console.log('🔄 Manual token refresh...');

    const response = await axios.post(`${API_CONFIG.BASE_URL}/api/v1/user/refresh-token`, {
      refreshToken,
    });

    if (response.data.success) {
      const { token: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

      await AsyncStorage.setItem('userToken', newAccessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);

      console.log('✅ Manual token refresh successful');
      return {
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } else {
      throw new Error(response.data.message || 'Token refresh failed');
    }
  } catch (error) {
    console.error('❌ Manual token refresh failed:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
};

// Helper: Logout function
export const logout = async () => {
  try {
    console.log('🚪 Logging out user...');
    await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
    console.log('✅ Logout successful');
    return true;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return false;
  }
};

// Helper: Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('userToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    return !!(accessToken || refreshToken);
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export default api;
