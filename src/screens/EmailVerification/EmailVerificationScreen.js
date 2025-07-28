import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Data imports
import {
  EMAIL_VERIFICATION_DATA,
  VERIFICATION_STATES,
  TIMER_STATES,
} from '../../data/emailVerificationData';

// Utils imports
import {
  validateCode,
  verifyEmailCode,
  resendVerificationCode,
  getVerificationData,
  saveVerificationData,
  clearVerificationData,
  getAttemptCount,
  incrementAttemptCount,
  resetAttemptCount,
  calculateRemainingTime,
  getInitialState,
  showAlert,
  showConfirmAlert,
  handleNavigation,
} from '../../utils/emailVerificationUtils';

// Component imports
import EmailVerificationHeader from '../../components/EmailVerification/EmailVerificationHeader';
import EmailVerificationTimer from '../../components/EmailVerification/EmailVerificationTimer';
import EmailVerificationInput from '../../components/EmailVerification/EmailVerificationInput';
import EmailVerificationActions from '../../components/EmailVerification/EmailVerificationActions';

const { width } = Dimensions.get('window');

const EmailVerification = ({ navigation, route }) => {
  const email = route?.params?.email || '';
  const expiresIn =
    route?.params?.expiresIn || EMAIL_VERIFICATION_DATA.timerDuration;

  const [state, setState] = useState(() => getInitialState(email, expiresIn));
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    initializeVerificationData();
  }, []);

  useEffect(() => {
    if (state.timerActive && state.expiresAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(
          0,
          Math.floor((state.expiresAt - now) / 1000),
        );

        setState(prevState => {
          if (remaining !== prevState.timeRemaining) {
            return {
              ...prevState,
              timeRemaining: remaining,
              timerActive: remaining > 0,
            };
          }
          return prevState;
        });
      }, 1000);

      setTimerInterval(interval);

      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [state.timerActive, state.expiresAt]);

  useEffect(() => {
    if (state.timeRemaining === 0 && state.timerActive) {
      handleTimerExpired();
    }
  }, [state.timeRemaining]);

  useEffect(() => {
    if (state.resendCooldown > 0) {
      const interval = setInterval(() => {
        setState(prevState => ({
          ...prevState,
          resendCooldown: Math.max(0, prevState.resendCooldown - 1),
          canResend: prevState.resendCooldown <= 1,
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [state.resendCooldown]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const initializeVerificationData = async () => {
    try {
      const savedData = await getVerificationData();
      const attemptCount = await getAttemptCount();

      if (
        !savedData ||
        savedData.email !== email ||
        calculateRemainingTime(savedData.expiresAt) <= 0
      ) {
        const expiresAtTimestamp = Date.now() + expiresIn * 1000;
        const verificationData = {
          email,
          expiresAt: expiresAtTimestamp,
          sentAt: Date.now(),
        };
        await saveVerificationData(verificationData);
        await resetAttemptCount();

        setState(prevState => ({
          ...prevState,
          expiresAt: expiresAtTimestamp,
          timeRemaining: expiresIn,
          attemptCount: 0,
          timerActive: true,
          canResend: false,
        }));
      } else {
        const remainingTime = calculateRemainingTime(savedData.expiresAt);

        setState(prevState => ({
          ...prevState,
          expiresAt: savedData.expiresAt,
          timeRemaining: remainingTime,
          attemptCount: attemptCount,
          timerActive: remainingTime > 0,
          canResend: remainingTime <= 0,
        }));
      }
    } catch (error) {
      console.error('Initialize verification data error:', error);
    }
  };

  const handleCodeChange = newCode => {
    setState(prevState => ({
      ...prevState,
      code: newCode,
      error: null,
    }));
  };

  const handleVerify = async () => {
  try {
    const validation = validateCode(state.code);
    if (!validation.isValid) {
      setState(prevState => ({
        ...prevState,
        error: validation.error,
        verificationState: VERIFICATION_STATES.ERROR,
      }));
      return;
    }

    if (state.timeRemaining <= 0) {
      showAlert(
        'Error',
        'Verification code has expired. Please request a new code.',
      );
      return;
    }

    setState(prevState => ({
      ...prevState,
      verificationState: VERIFICATION_STATES.LOADING,
      error: null,
    }));

    const result = await verifyEmailCode(email, state.code);

    if (result.success) {
      // Tokenlar
      const token = result.data?.data?.token;
      const refreshToken = result.data?.data?.refreshToken;
      // Kullanıcı bilgisi (profil)
      const user = result.data?.data?.user;
      const isVerified = result.data?.data?.isVerified;

      if (!token || !refreshToken || !user) {
        throw new Error('Token veya kullanıcı bilgisi bulunamadı.');
      }

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));  // Profil bilgisi
      
      // isVerified durumunu da kaydet
      if (isVerified !== undefined) {
        await AsyncStorage.setItem('isVerified', JSON.stringify(isVerified));
      }

      setState(prevState => ({
        ...prevState,
        verificationState: VERIFICATION_STATES.SUCCESS,
      }));

      await clearVerificationData();

      showAlert(
        'Success',
        result.message || 'Email verification successful!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'App',
                    state: {
                      routes: [
                        {
                          name: 'Home',
                          params: { verificationSuccess: true, email },
                        },
                      ],
                    },
                  },
                ],
              });
            },
          },
        ],
      );
    } else {
      const newAttemptCount = await incrementAttemptCount();

      setState(prevState => ({
        ...prevState,
        verificationState: VERIFICATION_STATES.ERROR,
        error: result.error,
        attemptCount: newAttemptCount,
        code: '',
      }));

      if (newAttemptCount >= EMAIL_VERIFICATION_DATA.maxAttempts) {
        showAlert(
          'Error',
          'Maximum verification attempts exceeded. Please try again later.',
        );
      }
    }
  } catch (error) {
    console.error('Verification error:', error);
    setState(prevState => ({
      ...prevState,
      verificationState: VERIFICATION_STATES.ERROR,
      error:
        error.message ||
        'Network error. Please check your connection and try again.',
    }));
  }
};


  const handleResendCode = async () => {
    try {
      setState(prevState => ({
        ...prevState,
        verificationState: VERIFICATION_STATES.LOADING,
        error: null,
      }));

      const result = await resendVerificationCode(email);

      if (result.success) {
        setState(prevState => ({
          ...prevState,
          verificationState: VERIFICATION_STATES.IDLE,
          timeRemaining: result.expiresIn,
          timerActive: true,
          canResend: false,
          resendCooldown: EMAIL_VERIFICATION_DATA.resendCooldown,
          code: '',
          attemptCount: 0,
        }));

        showAlert(
          'Success',
          result.message || 'Verification code sent successfully!',
        );
      } else {
        setState(prevState => ({
          ...prevState,
          verificationState: VERIFICATION_STATES.ERROR,
          error: result.error,
        }));
      }
    } catch (error) {
      console.error('Resend code error:', error);
      setState(prevState => ({
        ...prevState,
        verificationState: VERIFICATION_STATES.ERROR,
        error: 'Network error. Please check your connection and try again.',
      }));
    }
  };

  const handleChangeEmail = () => {
    showConfirmAlert(
      'Change Email',
      'Are you sure you want to change your email address?',
      async () => {
        await clearVerificationData();
        handleNavigation(navigation, 'Login');
      },
    );
  };

  const handleBackPress = () => {
    showConfirmAlert(
      'Cancel Verification',
      'Are you sure you want to cancel the verification process?',
      () => {
        handleNavigation(navigation, 'Login');
      },
    );
  };

  const handleTimerExpired = () => {
    setState(prevState => ({
      ...prevState,
      verificationState: VERIFICATION_STATES.EXPIRED,
      timerActive: false,
      canResend: true,
    }));
  };

  const isInputDisabled =
    state.verificationState === VERIFICATION_STATES.LOADING ||
    state.timeRemaining <= 0 ||
    state.attemptCount >= EMAIL_VERIFICATION_DATA.maxAttempts;

  const hasError = state.verificationState === VERIFICATION_STATES.ERROR;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <EmailVerificationHeader
          navigation={navigation}
          email={email}
          onBackPress={handleBackPress}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <EmailVerificationTimer
            timeRemaining={state.timeRemaining}
            timerState={
              state.timerActive ? TIMER_STATES.ACTIVE : TIMER_STATES.EXPIRED
            }
            onTimerExpired={handleTimerExpired}
          />

          <EmailVerificationInput
            code={state.code}
            onCodeChange={handleCodeChange}
            disabled={isInputDisabled}
            hasError={hasError}
            autoFocus={true}
          />

          <EmailVerificationActions
            code={state.code}
            timeRemaining={state.timeRemaining}
            resendCooldown={state.resendCooldown}
            canResend={state.canResend}
            verificationState={state.verificationState}
            attemptCount={state.attemptCount}
            onVerify={handleVerify}
            onResendCode={handleResendCode}
            onChangeEmail={handleChangeEmail}
            disabled={isInputDisabled}
          />

          {state.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{state.error}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Math.max(30, width * 0.08),
  },
  errorContainer: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(12, width * 0.03),
    padding: Math.max(12, width * 0.03),
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.error}15`,
    borderRadius: Math.max(8, width * 0.02),
    borderLeftWidth: 4,
    borderLeftColor: EMAIL_VERIFICATION_DATA.colors.error,
  },
  errorText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: EMAIL_VERIFICATION_DATA.colors.error,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default EmailVerification;
