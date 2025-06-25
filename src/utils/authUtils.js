import { Alert } from 'react-native';
import { AUTH_CONFIG, MOCK_AUTH_DATA } from '../constants/authConstants';
import { authService } from '../services/authService';
import { storageService } from '../services/AsyncStorage';

// Validation functions
export const validateEmail = (email) => {
  return AUTH_CONFIG.emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= AUTH_CONFIG.minPasswordLength;
};

export const validateForm = (formData, type = 'login') => {
  const { email, password, name, confirmPassword } = formData;
  
  if (type === 'register') {
    if (!name?.trim() || !email?.trim() || !password?.trim() || !confirmPassword?.trim()) {
      return { isValid: false, error: AUTH_CONFIG.errors.emptyFields };
    }
    
    if (password !== confirmPassword) {
      return { isValid: false, error: AUTH_CONFIG.errors.passwordMismatch };
    }
  } else {
    if (!email?.trim() || !password?.trim()) {
      return { isValid: false, error: AUTH_CONFIG.errors.emptyFields };
    }
  }
  
  if (!validateEmail(email)) {
    return { isValid: false, error: AUTH_CONFIG.errors.invalidEmail };
  }
  
  if (!validatePassword(password)) {
    return { isValid: false, error: AUTH_CONFIG.errors.passwordTooShort };
  }
  
  return { isValid: true };
};

// Authentication functions
export const handleLogin = async (email, password, navigation, setLoading) => {
  const validation = validateForm({ email, password }, 'login');
  
  if (!validation.isValid) {
    Alert.alert('Validation Error', validation.error);
    return;
  }

  setLoading(true);

  try {
    // Use mock data for now (uncomment real API call when ready)
    // const response = await authService.login(email.trim(), password);
    const { token, user, refreshToken } = MOCK_AUTH_DATA;

    if (!token) {
      Alert.alert('Error', AUTH_CONFIG.errors.authFailed);
      return;
    }

    // Save authentication data
    await Promise.all([
      storageService.setToken(token),
      storageService.setUser(user),
      refreshToken && storageService.setRefreshToken(refreshToken),
    ]);

    // Navigate to home
    navigation.replace('Home');
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        AUTH_CONFIG.errors.loginFailed;
    Alert.alert('Login Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleRegister = async (formData, navigation, setLoading) => {
  const { name, email, password, confirmPassword } = formData;
  const validation = validateForm({ name, email, password, confirmPassword }, 'register');
  
  if (!validation.isValid) {
    Alert.alert('Validation Error', validation.error);
    return;
  }

  setLoading(true);

  try {
    // Use mock registration for now
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Automatically login after registration
    await handleLogin(email, password, navigation, () => {});
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 
                        error?.message || 
                        'Registration failed. Please try again.';
    Alert.alert('Registration Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};

export const handleSocialLogin = (provider) => {
  Alert.alert(AUTH_CONFIG.errors.comingSoon, `${provider} login will be available soon!`);
};

export const handleForgotPassword = () => {
  Alert.alert(AUTH_CONFIG.errors.comingSoon, 'Forgot password feature will be available soon!');
}; 