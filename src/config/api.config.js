import { Platform } from 'react-native';
// ENV dosyası için değişkenleri import ediyoruz
import {
  DEVELOPMENT_HOST,
  API_PORT,
  PRODUCTION_API_URL,
  NODE_ENV
} from '@env';

// ENV değerlerini bir kez al ve varsayılan değerlerle birleştir
const ENV_VALUES = {
  DEVELOPMENT_HOST: DEVELOPMENT_HOST || '10.0.2.2', // .env dosyasından
  API_PORT: API_PORT || '5005', // .env dosyasından  
  PRODUCTION_API_URL: PRODUCTION_API_URL || 'https://your-production-api.com/api/v1', // .env dosyasından
  NODE_ENV: NODE_ENV || 'development' // .env dosyasından
};

// Geliştirme/Prodüksiyon kontrolü
const isDevelopment = __DEV__;

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? Platform.OS === 'ios'
      ? `https://finscope.app/api/v1`
      : `https://finscope.app/api/v1`
    : ENV_VALUES.PRODUCTION_API_URL,
    
  TIMEOUT: 10000,
  
  // Port yapılandırması
  PORT: parseInt(ENV_VALUES.API_PORT),
  
  // Development Host
  DEVELOPMENT_HOST: ENV_VALUES.DEVELOPMENT_HOST,
  
  // Environment info
  IS_DEVELOPMENT: isDevelopment,
  
  // Debug info
  DEBUG_INFO: {
    Platform: Platform.OS,
    isDev: isDevelopment,
    BASE_URL: isDevelopment 
      ? Platform.OS === 'ios'
        ? `https://finscope.app/api/v1`
        : `https://finscope.app/api/v1`
      : ENV_VALUES.PRODUCTION_API_URL
  }
};

export default API_CONFIG; 