import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_CONFIG, FORGOT_PASSWORD_DATA, FORGOT_PASSWORD_STEPS } from '../data/forgotPasswordData';

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.trim() === '') {
    return { isValid: false, error: FORGOT_PASSWORD_DATA.validation.emailRequired };
  }

  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: FORGOT_PASSWORD_DATA.validation.emailInvalid };
  }

  return { isValid: true, error: null };
};

// Navigation
export const handleBackToLogin = (navigation) => {
  navigation.goBack();
};

export const handleNavigateToLogin = (navigation) => {
  navigation.navigate('Login');
};


export const handleResetPassword = async (
  email,
  code,
  newPassword,
  confirmPassword,
  setLoading,
  setError,
  navigation
) => {
  const passwordRegex = /^[0-9]{6}$/; // sadece 6 haneli sayı

  if (!newPassword || !passwordRegex.test(newPassword.trim())) {
    setError('Password must be exactly 6 digits.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const result = await resetPasswordAPI(email, code, newPassword);

    if (result.success) {
      Alert.alert('Success', result.message || 'Password reset successful.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]);
    } else {
      setError(result.error || 'Password reset failed. Please try again.');
    }
  } catch (error) {
    setError('Unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};




// 🔹 1. Forgot Password API
export const forgotPasswordAPI = async (email) => {
  try {
    const response = await api.post('/user/forgot-password', {
      email: email.trim(),
    });

    // response.data = tüm backend cevabı
    const responseData = response.data || {};

    return {
      success: responseData.success === true,
      message: responseData.message || FORGOT_PASSWORD_DATA.successMessage,
      data: responseData.data || {},   // expiresAt burada
    };
  } catch (error) {
    console.error('Forgot Password API Error:', error);

    const errorMsg =
      error.response?.data?.message || error.message || 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.';

    if (error.response?.status === 404 || errorMsg.toLowerCase().includes('not found')) {
      return {
        success: false,
        error: FORGOT_PASSWORD_DATA.validation.emailNotFound,
      };
    }

    return {
      success: false,
      error: errorMsg,
    };
  }
};


// 🔹 2. Verification API
export const verifyForgotPasswordCodeAPI = async (email,code) => {
  try {
    const response = await api.post('/user/verify-reset-code', {
      email: email.trim(),
      code: code.trim(),
    });

    return {
      success: true,
      message: response.data.message,
      data: response.data,
    };
  } catch (error) {
    console.error('Verify Code API Error:', error);

    const errorMsg =
      error.response?.data?.message || error.message || 'Doğrulama başarısız. Lütfen tekrar deneyin.';

    return {
      success: false,
      error: errorMsg,
    };
  }
};

export const resetPasswordAPI = async (email, code, newPassword) => {
  try {
    const response = await api.post('/user/reset-password', {
      email: email.trim(),
      code:code.trim(),
      newPassword: newPassword.trim(),
    });

    return {
      success: true,
      message: response.data.message || FORGOT_PASSWORD_DATA.resetSuccessMessage || 'Password reset successful.',
      data: response.data,
    };
  } catch (error) {
    console.error('Reset Password API Error:', error);

    const errorMsg =
      error.response?.data?.message || error.message || 'Connection error occurred. Please try again.';

    return {
      success: false,
      error: errorMsg,
    };
  }
};

// 🔹 3. Resend Email API
export const resendForgotPasswordAPI = async (email) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.resendEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
      timeout: API_CONFIG.timeout,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return {
      success: true,
      message: data.message || 'E-posta tekrar gönderildi',
      data: data
    };
  } catch (error) {
    console.error('Resend Email API Error:', error);
    return {
      success: false,
      error: error.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.'
    };
  }
};

// 🔹 4. Business Logic

export const handleForgotPassword = async (email, setLoading, setStep, setError, setExpirationDate) => {
  setLoading(true);
  setError('');

  try {
    const result = await forgotPasswordAPI(email);

    if (result.success) {
      if (result.data?.expiresAt) {
        setExpirationDate(new Date(result.data.expiresAt));
      }
      setStep(FORGOT_PASSWORD_STEPS.VERIFY_CODE);
    } else {
      setError(result.error || 'Bir hata oluştu.');
    }
  } catch (err) {
    setError('Bir hata oluştu, tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};


export const handleResendEmail = async (email, setResendLoading, setResendTimer, setError) => {
  setResendLoading(true);
  setError('');

  try {
    const result = await resendForgotPasswordAPI(email);

    if (result.success) {
      setResendTimer(FORGOT_PASSWORD_DATA.resendTimer);
      showSuccessAlert('E-posta Gönderildi', result.message);
    } else {
      setError(result.error);
    }
  } catch (error) {
    setError('E-posta gönderilemedi. Lütfen tekrar deneyin.');
  } finally {
    setResendLoading(false);
  }
};

// 🔹 5. Timer
export const startResendTimer = (setResendTimer) => {
  const interval = setInterval(() => {
    setResendTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return interval;
};

// 🔹 6. Alerts
export const showSuccessAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'Tamam', style: 'default' }]);
};

export const showErrorAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'Tamam', style: 'default' }]);
};

export const showConfirmAlert = (title, message, onConfirm) => {
  Alert.alert(title, message, [
    { text: 'İptal', style: 'cancel' },
    { text: 'Tamam', onPress: onConfirm },
  ]);
};

// 🔹 7. Utility
export const formatEmailInput = (text) => text.trim().toLowerCase();

export const clearFormData = () => ({
  email: '',
  error: '',
  loading: false,
  step: FORGOT_PASSWORD_STEPS.EMAIL_INPUT,
});
