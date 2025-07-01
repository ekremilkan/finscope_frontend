import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FORGOT_PASSWORD_DATA } from '../../data/forgotPasswordData';
import { 
  handleResendEmail, 
  handleNavigateToLogin, 
  startResendTimer 
} from '../../utils/forgotPasswordUtils';

const { width } = Dimensions.get('window');

const ForgotPasswordSuccess = ({ 
  email, 
  navigation, 
  setError,
  goToVerifyCodeStep, 
}) => {
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    setResendTimer(FORGOT_PASSWORD_DATA.resendTimer);
    const interval = startResendTimer(setResendTimer);
    return () => clearInterval(interval);
  }, []);

  const handleResend = () => {
    handleResendEmail(email, setResendLoading, setResendTimer, setError);
  };

  const canResend = resendTimer === 0 && !resendLoading;

  return (
  <View style={styles.container}>
    <View style={styles.successContent}>
      <View style={styles.checkIconContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#10b981" />
      </View>

      <View style={styles.emailInfo}>
        <Text style={styles.emailLabel}>Email sent to:</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <Ionicons name="mail-outline" size={20} color="#6366f1" />
          <Text style={styles.instructionText}>Check your email inbox</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="link-outline" size={20} color="#6366f1" />
          <Text style={styles.instructionText}>Click the link we sent</Text>
        </View>
        <View style={styles.instructionItem}>
          <Ionicons name="create-outline" size={20} color="#6366f1" />
          <Text style={styles.instructionText}>Create your new password</Text>
        </View>
      </View>
    </View>

    <View style={styles.actionButtons}>
      {/* ✅ Go to Verification Code Screen */}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={goToVerifyCodeStep}
        activeOpacity={0.8}
      >
        <View style={styles.backToLoginContent}>
          <Ionicons name="key-outline" size={20} color="#fff" />
          <Text style={styles.backToLoginText}>I Entered the Code</Text>
        </View>
      </TouchableOpacity>

      {/* 🔁 Resend Email */}
      <TouchableOpacity
        style={[
          styles.resendButton,
          !canResend && styles.resendButtonDisabled
        ]}
        onPress={handleResend}
        disabled={!canResend}
        activeOpacity={0.7}
      >
        <View style={styles.resendButtonContent}>
          {resendLoading ? (
            <ActivityIndicator size="small" color="#6366f1" />
          ) : (
            <Ionicons 
              name="refresh-outline" 
              size={20} 
              color={canResend ? "#6366f1" : "#64748b"} 
            />
          )}
          <Text style={[
            styles.resendButtonText,
            !canResend && styles.resendButtonTextDisabled
          ]}>
            {resendTimer > 0 
              ? `${FORGOT_PASSWORD_DATA.resendText} (${resendTimer}s)`
              : FORGOT_PASSWORD_DATA.resendText
            }
          </Text>
        </View>
      </TouchableOpacity>

      {/* 🔙 Back to Login */}
      <TouchableOpacity
        style={styles.backToLoginButton}
        onPress={() => handleNavigateToLogin(navigation)}
        activeOpacity={0.8}
      >
        <View style={styles.backToLoginContent}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.backToLoginText}>
            {FORGOT_PASSWORD_DATA.backToLoginText}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Math.max(16, width * 0.04),
    justifyContent: 'space-between',
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Math.max(20, width * 0.05),
  },
  checkIconContainer: {
    marginBottom: Math.max(32, width * 0.08),
  },
  emailInfo: {
    alignItems: 'center',
    marginBottom: Math.max(40, width * 0.1),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  emailLabel: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: Math.max(8, width * 0.02),
  },
  emailText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    color: '#ffffff',
    fontWeight: '600',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    textAlign: 'center',
  },
  instructionsContainer: {
    width: '100%',
    maxWidth: Math.max(300, width * 0.8),
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    marginBottom: Math.max(12, width * 0.03),
  },
  instructionText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: Math.max(12, width * 0.03),
    flex: 1,
  },
  actionButtons: {
    paddingBottom: Math.max(20, width * 0.05),
  },
  resendButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    marginBottom: Math.max(16, width * 0.04),
  },
  resendButtonDisabled: {
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  resendButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: Math.max(8, width * 0.02),
  },
  resendButtonTextDisabled: {
    color: '#64748b',
  },
  backToLoginButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
  },
  backToLoginContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: Math.max(8, width * 0.02),
    letterSpacing: 0.5,
  },
  verifyButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    marginBottom: Math.max(16, width * 0.04),
  },
});

export default ForgotPasswordSuccess;
