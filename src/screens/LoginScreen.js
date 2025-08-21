import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authService } from '../services/authService';
import { storageService } from '../services/AsyncStorage';
import { FONTS, FONT_WEIGHTS, getFontFamily } from '../constants/fontConstants';
import { COLORS, getCornerGradientColors } from '../constants/colorConstants';
import CustomAlertModal from '../components/common/CustomAlertModal';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', confirmText: 'Tamam' });

  const showAlert = (config) => {
    setAlertConfig({ ...alertConfig, ...config });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert({ title: 'Validation Error', message: 'Please fill in all fields' });
      return;
    }

    if (!validateEmail(email)) {
      showAlert({ title: 'Validation Error', message: 'Please enter a valid email address' });
      return;
    }

    // DEĞİŞTİRİLDİ: PIN formatı kontrolü (tam olarak 6 rakam olmalı)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(password)) {
      showAlert({ title: 'Validation Error', message: 'PIN must be exactly 6 digits.' });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email.trim(), password);
      const responseData = response?.data || response;
      const isVerified = responseData?.isVerified;
      const userData = responseData?.user;
      const token = responseData?.token;
      const refreshToken = responseData?.refreshToken;

      if (isVerified === true && userData && token) {
        await storageService.setUser(userData);
        await storageService.setToken(token);
        if (refreshToken) {
          await storageService.setRefreshToken(refreshToken);
        }
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }]
        });
      } else if (isVerified === false) {
        navigation.replace('EmailVerification', {
          email: email.trim(),
          expiresIn: 600,
        });
      } else {
        const fullMessage = responseData?.message || '';
        if (fullMessage.toLowerCase().includes('doğrulama kodu')) {
          navigation.replace('EmailVerification', {
            email: email.trim(),
            expiresIn: 600,
          });
        } else {
          showAlert({ title: 'Login Error', message: 'Unexpected response from server' });
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials.';
      showAlert({ title: 'Login Failed', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = provider => {
    showAlert({ title: 'Coming Soon', message: `${provider} login will be available soon!` });
  };

  return (
    <LinearGradient
      colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
      style={styles.container}
    >
      <LinearGradient
        colors={getCornerGradientColors()}
        style={styles.topRightGradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <LinearGradient
        colors={getCornerGradientColors().reverse()}
        style={styles.bottomLeftGradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logo}>
                  <Image
                    source={require('../assets/images/finscope-logo.png')}
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

            <View style={styles.formContainer}>
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

              <View style={styles.inputContainer}>
                {/* DEĞİŞTİRİLDİ: Etiket "Password" yerine "PIN" oldu */}
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
                  {/* DEĞİŞTİRİLDİ: PIN giriş alanı için numeric klavye ve maxLength eklendi */}
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    keyboardType="number-pad" // EKLENDİ
                    maxLength={6} // EKLENDİ
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

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

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

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

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
      <CustomAlertModal
        isVisible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText || 'OK'}
        showCancelButton={false}
        onConfirm={hideAlert}
      />
    </LinearGradient>
  );
};

// ... stiller aynı kaldığı için buraya eklenmedi ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardContainer: {
    flex: 1,
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.6,
    height: height * 0.4,
    borderBottomLeftRadius: 150,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.6,
    height: height * 0.4,
    borderTopRightRadius: 150,
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
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY,
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
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: width * 0.08,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
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
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: Platform.OS === 'ios' ? 12 : 16,
    borderWidth: Platform.OS === 'ios' ? 1 : 1,
    borderColor: COLORS.BORDER_SECONDARY,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 52 : 56,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.SHADOW_SECONDARY,
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
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY,
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
    borderColor: COLORS.ERROR,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
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
    ...getFontFamily('MEDIUM'),
    color: COLORS.PRIMARY,
  },
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: Platform.OS === 'ios' ? 12 : 16,
    height: Platform.OS === 'ios' ? 52 : 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY,
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
    color: COLORS.SECONDARY,
    fontSize: 16,
    ...getFontFamily('SEMIBOLD'),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    ...getFontFamily('SEMIBOLD'),
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.SURFACE,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_DISABLED,
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
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.SHADOW_SECONDARY,
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
    ...getFontFamily('BOLD'),
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
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
  },
  signUpText: {
    fontSize: 16,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
  },
});

export default LoginScreen;