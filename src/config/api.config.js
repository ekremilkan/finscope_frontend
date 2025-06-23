import { Platform } from 'react-native';

// ENV dosyasının bir kopyasını burada tutuyoruz
// Her geliştirici kendi IP'sini .env dosyasına yazacak
// NOT: .env dosyasını değiştirdikten sonra uygulamayı yeniden başlatın

// .env dosyasından kopyalanan değerler
// Bu değerleri .env dosyasındaki ile aynı tutun
const ENV_VALUES = {
  DEVELOPMENT_HOST: '192.168.1.21', // .env dosyasından kopyalayın
  API_PORT: '5005',
  PRODUCTION_API_URL: 'https://your-production-api.com/api/v1',
  NODE_ENV: 'development'
};

// Geliştirme/Prodüksiyon kontrolü
const isDevelopment = __DEV__;

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? Platform.OS === 'ios'
      ? `http://localhost:${ENV_VALUES.API_PORT}/api/v1`
      : `http://${ENV_VALUES.DEVELOPMENT_HOST}:${ENV_VALUES.API_PORT}/api/v1`
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
        ? `http://localhost:${ENV_VALUES.API_PORT}/api/v1`
        : `http://${ENV_VALUES.DEVELOPMENT_HOST}:${ENV_VALUES.API_PORT}/api/v1`
      : ENV_VALUES.PRODUCTION_API_URL
  }
};

export default API_CONFIG; 