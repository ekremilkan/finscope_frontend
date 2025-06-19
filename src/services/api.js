import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BASE_URL =  Platform.OS === 'ios'
    ? 'http://localhost:5005/api/v1' // iOS Simulator
    : 'http://10.0.2.2:5005/api/v1'; // Android Emulator

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  console.log('Interceptor token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersizse logout yap
      global.userToken = null;
      // NavigationService ile login'e yönlendir
    }
    return Promise.reject(error);
  }
);

export default api;