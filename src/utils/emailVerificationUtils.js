import { Alert } from 'react-native';
import { EMAIL_VERIFICATION_DATA, VERIFICATION_STATES } from '../data/emailVerificationData';
import api from '../services/api';  
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  VERIFICATION_DATA: '@email_verification_data',
  ATTEMPT_COUNT: '@verification_attempt_count',
  LAST_CODE_TIME: '@last_code_time'
};

// Timer Utilities
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateRemainingTime = (endTime) => {
  const now = Date.now();
  const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
  return remaining;
};

// Validation Utilities
export const validateCode = (code) => {
  if (!code) return { isValid: false, error: 'Doğrulama kodu boş olamaz' };
  if (code.length !== EMAIL_VERIFICATION_DATA.codeLength) {
    return { isValid: false, error: `Doğrulama kodu ${EMAIL_VERIFICATION_DATA.codeLength} haneli olmalıdır` };
  }
  if (!/^\d+$/.test(code)) {
    return { isValid: false, error: 'Doğrulama kodu sadece rakam içermelidir' };
  }
  return { isValid: true, error: null };
};

// Storage Utilities
export const saveVerificationData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.VERIFICATION_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Verification data save error:', error);
  }
};

export const getVerificationData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Verification data get error:', error);
    return null;
  }
};

export const clearVerificationData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.VERIFICATION_DATA,
      STORAGE_KEYS.ATTEMPT_COUNT,
      STORAGE_KEYS.LAST_CODE_TIME
    ]);
  } catch (error) {
    console.error('Clear verification data error:', error);
  }
};

// Attempt Tracking
export const getAttemptCount = async () => {
  try {
    const count = await AsyncStorage.getItem(STORAGE_KEYS.ATTEMPT_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error('Get attempt count error:', error);
    return 0;
  }
};

export const incrementAttemptCount = async () => {
  try {
    const currentCount = await getAttemptCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(STORAGE_KEYS.ATTEMPT_COUNT, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Increment attempt count error:', error);
    return 0;
  }
};

export const resetAttemptCount = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ATTEMPT_COUNT);
  } catch (error) {
    console.error('Reset attempt count error:', error);
  }
};

// API Calls with axios api service
export const verifyEmailCode = async (email, verificationCode) => {
  try {
    console.log('🔄 Verifying email code for:', email);
    console.log('📡 API URL:', '/user/verify-login');
    
    const response = await api.post('/user/verify-login', {
      email,
      verificationCode,
    });

    console.log('✅ Email verification response:', {
      success: response.data?.success,
      isVerified: response.data?.data?.isVerified,
      hasUser: !!response.data?.data?.user,
      hasToken: !!response.data?.data?.token
    });

    return {
      success: true,
      data: response.data,
      message: response.data.message || EMAIL_VERIFICATION_DATA.messages.success,
    };
  } catch (error) {
    console.error('❌ Email verification error:', error);
    console.error('📡 Error details:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });

    // Axios hatasından kullanıcıya anlamlı mesaj çıkarmak için
    const errorMsg = error.response?.data?.message || EMAIL_VERIFICATION_DATA.messages.networkError;

    return {
      success: false,
      error: errorMsg,
    };
  }
};

export const resendVerificationCode = async (email) => {
  try {
    console.log('🔄 Resending verification code for:', email);
    console.log('📡 API URL:', '/user/resend-verification-code');
    
    const response = await api.post('/user/resend-verification-code', {
      email,
    });

    console.log('✅ Resend verification code successful');
    const expiresIn = response.data.expiresIn || EMAIL_VERIFICATION_DATA.timerDuration;

    // Yeni kod bilgilerini kaydet
    const verificationData = {
      email,
      expiresAt: Date.now() + expiresIn * 1000,
      sentAt: Date.now(),
    };

    await saveVerificationData(verificationData);
    await resetAttemptCount();
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_CODE_TIME, Date.now().toString());

    return {
      success: true,
      data: verificationData,
      message: response.data.message || EMAIL_VERIFICATION_DATA.messages.codeSent,
      expiresIn,
    };
  } catch (error) {
    console.error('❌ Resend code error:', error);
    console.error('📡 Error details:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    
    const errorMsg = error.response?.data?.message || EMAIL_VERIFICATION_DATA.messages.networkError;

    return {
      success: false,
      error: errorMsg,
    };
  }
};

// Navigation Utilities
export const handleNavigation = (navigation, route, params = {}) => {
  if (navigation && typeof navigation.navigate === 'function') {
    navigation.navigate(route, params);
  }
};

export const handleBackPress = (navigation) => {
  if (navigation && typeof navigation.goBack === 'function') {
    navigation.goBack();
  }
};

// Alert Utilities
export const showAlert = (title, message, buttons = []) => {
  const defaultButtons = [{ text: 'Ok', style: 'default' }];
  Alert.alert(title, message, buttons.length > 0 ? buttons : defaultButtons);
};

export const showConfirmAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Ok',
      style: 'default',
      onPress: onConfirm,
    },
  ]);
};

// State Management Utilities
export const getInitialState = (email = '', expiresIn = EMAIL_VERIFICATION_DATA.timerDuration) => ({
  email,
  code: '',
  timeRemaining: expiresIn,
  attemptCount: 0,
  canResend: false,
  resendCooldown: 0,
  verificationState: VERIFICATION_STATES.IDLE,
  error: null,
  timerActive: true,
});

export const shouldShowResendButton = (timeRemaining, canResend, resendCooldown) =>
  timeRemaining <= 0 || (canResend && resendCooldown <= 0);

// Format Utilities
export const formatEmail = (email) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!domain) return email;

  const maskedUsername =
    username.length <= 2
      ? username
      : username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);

  return `${maskedUsername}@${domain}`;
};
