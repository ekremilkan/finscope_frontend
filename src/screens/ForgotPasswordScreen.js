import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

// Data
import { FORGOT_PASSWORD_STEPS } from '../data/forgotPasswordData';

// Utils
import {
  clearFormData,
  verifyForgotPasswordCodeAPI,
  resetPasswordAPI,
  handleForgotPassword,
} from '../utils/forgotPasswordUtils';

// Components
import ForgotPasswordHeader from '../components/ForgotPassword/ForgotPasswordHeader';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm';
import VerifyCodeForm from '../components/ForgotPassword/VerifyCodeForm';
import ResetPasswordForm from '../components/ForgotPassword/ResetPasswordForm';

// Constants
import { COLORS, getCornerGradientColors } from '../constants/colorConstants';

const { width } = Dimensions.get('window');

const ForgotPassword = ({ navigation }) => {
  const [step, setStep] = useState(FORGOT_PASSWORD_STEPS.EMAIL_INPUT);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [expirationDate, setExpirationDate] = useState(null);

  useEffect(() => {
    const formData = clearFormData();
    setEmail(formData.email);
    setError(formData.error);
    setLoading(formData.loading);
    setStep(formData.step);
    setVerifySuccess(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (
        step === FORGOT_PASSWORD_STEPS.VERIFY_CODE ||
        step === FORGOT_PASSWORD_STEPS.RESET_PASSWORD
      ) {
        const formData = clearFormData();
        setEmail(formData.email);
        setError(formData.error);
        setLoading(formData.loading);
        setStep(formData.step);
        setVerifySuccess(false);
      }
    });

    return unsubscribe;
  }, [navigation, step]);

  // Yeni: Email gönderme - doğrudan ve otomatik
  const handleSendResetCode = async () => {
    if (!email || !email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await handleForgotPassword(
        email.trim().toLowerCase(),
        setLoading,
        setStep,
        setError,
        setExpirationDate,
      );
    } catch (err) {
      console.error('Error sending reset code:', err);
    } finally {
      setLoading(false);
    }
  };

  // Kod doğrulama işlemi
  const handleCodeSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;

    setLoading(true);
    setError('');
    setVerifySuccess(false);

    try {
      const result = await verifyForgotPasswordCodeAPI(email, fullCode);

      if (result.success) {
        setVerifySuccess(true);

        setTimeout(() => {
          setStep(FORGOT_PASSWORD_STEPS.RESET_PASSWORD);
        }, 1500);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Şifre sıfırlama işlemi
  const handleResetPassword = async (password, code) => {
  const passwordRegex = /^[0-9]{6}$/;

  if (!passwordRegex.test(password.trim())) {
    setError('The password must consist of 6 digits.');
    return;
  }

  setLoading(true);
  setError('');

    try {
      const result = await resetPasswordAPI(email, code, password);

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
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (step) {
      case FORGOT_PASSWORD_STEPS.EMAIL_INPUT:
        return (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            onSendResetCode={handleSendResetCode}
          />
        );
      case FORGOT_PASSWORD_STEPS.VERIFY_CODE:
        return (
          <VerifyCodeForm
            code={code}
            setCode={setCode}
            onSubmit={handleCodeSubmit}
            loading={loading}
            success={verifySuccess}
            expirationDate={expirationDate}
          />
        );
      case FORGOT_PASSWORD_STEPS.RESET_PASSWORD:
        return (
          <ResetPasswordForm
            onSubmit={password => handleResetPassword(password, code.join(''))}
            loading={loading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          {/* Corner Gradients */}
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ForgotPasswordHeader navigation={navigation} step={step} />

            <View style={styles.contentContainer}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {renderContent()}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 250,
    borderBottomLeftRadius: 125,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 250,
    height: 250,
    borderTopRightRadius: 125,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Math.max(30, width * 0.08),
  },
});

export default ForgotPassword;
