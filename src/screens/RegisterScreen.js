import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { authService } from '../services/authService';
import { FONTS, FONT_WEIGHTS, getFontFamily } from '../constants/fontConstants';
import { COLORS, getCornerGradientColors } from '../constants/colorConstants';
// YENİ: CustomAlertModal import edildi
import CustomAlertModal from '../components/common/CustomAlertModal';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // YENİ: Modal state'leri ve fonksiyonları
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', confirmText: 'Tamam' });

  const showAlert = (config) => {
    setAlertConfig({ ...alertConfig, ...config });
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      showAlert({ title: 'Validation Error', message: 'Please fill in all fields' });
      return;
    }

    if (name.trim().length < 2) {
      showAlert({ title: 'Validation Error', message: 'Name must be at least 2 characters' });
      return;
    }

    if (!validateEmail(email)) {
      showAlert({ title: 'Validation Error', message: 'Please enter a valid email address' });
      return;
    }

    if (!validatePassword(password)) {
      showAlert({
        title: 'Validation Error',
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({ title: 'Validation Error', message: 'Passwords do not match' });
      return;
    }

    if (!acceptTerms) {
      showAlert({ title: 'Validation Error', message: 'Please accept the terms and conditions' });
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      const response = await authService.register(userData);

      showAlert({
        title: 'Success',
        message: 'Account created successfully! Please sign in.',
        confirmText: 'OK',
        onConfirm: () => {
          hideAlert();
          navigation.navigate('Login');
        }
      });

    } catch (error) {
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          'Registration failed. Please try again.';
      showAlert({ title: 'Registration Failed', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    showAlert({ title: 'Coming Soon', message: 'Google registration will be available soon!' });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
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

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <View style={styles.logo}>
                    <Image
                      source={require('../assets/images/finscope-logo.png')}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.appName}>FinScope</Text>
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join us and start your journey</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={[
                  styles.inputWrapper,
                  nameFocused && styles.inputWrapperFocused,
                  name.length > 0 && name.length < 2 && styles.inputWrapperError
                ]}>
                  <Icon name="person" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9ca3af"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>

                <View style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                  !validateEmail(email) && email.length > 0 && styles.inputWrapperError
                ]}>
                  <Icon name="email" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>

                <View style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                  !validatePassword(password) && password.length > 0 && styles.inputWrapperError
                ]}>
                  <Icon name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password (8+ chars, A-z, 0-9)"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
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

                <View style={[
                  styles.inputWrapper,
                  confirmPasswordFocused && styles.inputWrapperFocused,
                  confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError
                ]}>
                  <Icon name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#9ca3af"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                    onFocus={() => setConfirmPasswordFocused(true)}
                    onBlur={() => setConfirmPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.termsContainer}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                    {acceptTerms && <Icon name="check" size={14} color="#ffffff" />}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    loading && styles.registerButtonDisabled
                  ]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#ffffff" size="small" />
                      <Text style={styles.loadingText}>Creating...</Text>
                    </View>
                  ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {/* YENİ: Modal bileşeni render ediliyor */}
      <CustomAlertModal
        isVisible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText || 'OK'}
        showCancelButton={false}
        onConfirm={alertConfig.onConfirm || hideAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardContainer: {
    flex: 1,
  },
  gradientContainer: {
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
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: width * 0.05,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  logoImage: {
    width: '80%',
    height: '80%',
  },
  appName: {
    fontSize: 16,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
  title: {
    fontSize: width * 0.07,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginTop: 48,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.038,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
  },
  inputWrapperFocused: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  inputWrapperError: {
    borderColor: COLORS.ERROR,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 10,
  },
  eyeButton: {
    padding: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 2,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: COLORS.SURFACE,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.PRIMARY,
    ...getFontFamily('MEDIUM'),
  },
  registerButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 14,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.SECONDARY,
    fontSize: 15,
    ...getFontFamily('SEMIBOLD'),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.SECONDARY,
    fontSize: 15,
    ...getFontFamily('SEMIBOLD'),
    marginLeft: 6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.SURFACE,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_DISABLED,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    height: 50,
    marginBottom: 20,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  googleIcon: {
    fontSize: 16,
    ...getFontFamily('BOLD'),
    color: '#ea4335',
  },
  googleButtonText: {
    fontSize: 15,
    ...getFontFamily('SEMIBOLD'),
    color: '#1f2937',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 15,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
  },
  signInText: {
    fontSize: 15,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
  },
});

export default RegisterScreen;