//misafir kullanıcı ?
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authService } from '../services/authService';
import { storageService } from '../services/AsyncStorage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email.trim(), password);

      console.log('Login yanıtı:', JSON.stringify(response, null, 2));

      // Backend'den gelen response'u kontrol et
      const responseData = response?.data || response;
      const isVerified = responseData?.isVerified;
      const userData = responseData?.user;
      const token = responseData?.token;
      const refreshToken = responseData?.refreshToken;

      if (isVerified === true && userData && token) {
        // Kullanıcı zaten doğrulanmış, direkt giriş yap
        console.log('✅ User already verified, proceeding to app');
        
        // User data'yı AsyncStorage'a kaydet
        await storageService.setUser(userData);
        await storageService.setToken(token);
        if (refreshToken) {
          await storageService.setRefreshToken(refreshToken);
        }
        
        // Ana uygulamaya yönlendir
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }]
        });
      } else if (isVerified === false) {
        // Kullanıcı doğrulanmamış, email verification gerekli
        console.log('📧 User not verified, redirecting to email verification');
        navigation.replace('EmailVerification', {
          email: email.trim(),
          expiresIn: 600,
        });
      } else {
        // Eski sistem için fallback
        const fullMessage = responseData?.message || '';
        if (fullMessage.toLowerCase().includes('doğrulama kodu')) {
          navigation.replace('EmailVerification', {
            email: email.trim(),
            expiresIn: 600,
          });
        } else {
          Alert.alert('Login Error', 'Unexpected response from server');
        }
      }
    } catch (error) {
      console.log('Login error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = provider => {
    Alert.alert('Coming Soon', `${provider}login will be available soon!`)
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Image
                  source={require('../../assets/logo/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your account to continue
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  !validateEmail(email) &&
                    email.length > 0 &&
                    styles.inputWrapperError,
                ]}
              >
                <Icon
                  name="email"
                  size={20}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!loading}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <Icon
                  name="lock"
                  size={20}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                  editable={!loading}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.loadingText}>Signing in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
                activeOpacity={0.7}
              >
                <Text style={styles.googleIcon}>G</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.08,
    paddingBottom: height * 0.04,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 12,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
        fontWeight: '400',
      },
    }),
  },
  formContainer: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: Platform.OS === 'ios' ? 12 : 16,
    borderWidth: Platform.OS === 'ios' ? 1 : 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 52 : 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputWrapperFocused: {
    borderColor: '#6366f1',
    backgroundColor: '#1e293b',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputWrapperError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  passwordInput: {
    paddingRight: 12,
  },
  eyeButton: {
    padding: 8,
    borderRadius: 8,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  loginButton: {
    backgroundColor: '#6366f1',
    borderRadius: Platform.OS === 'ios' ? 12 : 16,
    height: Platform.OS === 'ios' ? 52 : 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#64748b',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
        fontWeight: '400',
      },
    }),
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: Platform.OS === 'ios' ? 52 : 56,
    height: Platform.OS === 'ios' ? 52 : 56,
    borderRadius: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ea4335',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
  },
  footerText: {
    fontSize: 16,
    color: '#94a3b8',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
        fontWeight: '400',
      },
    }),
  },
  signUpText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    ...Platform.select({
      ios: {
        fontFamily: 'San Francisco',
      },
    }),
  },
});

export default LoginScreen;