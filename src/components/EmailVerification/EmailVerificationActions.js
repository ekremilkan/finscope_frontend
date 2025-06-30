import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { EMAIL_VERIFICATION_DATA, VERIFICATION_STATES } from '../../data/emailVerificationData';
import { shouldShowResendButton, formatTime } from '../../utils/emailVerificationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const EmailVerificationActions = ({
  code,
  timeRemaining,
  resendCooldown,
  canResend,
  verificationState,
  attemptCount,
  onVerify,
  onResendCode,
  onChangeEmail,
  disabled = false
}) => {
  const isCodeValid = code && code.length === EMAIL_VERIFICATION_DATA.codeLength;
  const isLoading = verificationState === VERIFICATION_STATES.LOADING;
  const canClickVerify = isCodeValid && !disabled && !isLoading;
  const showResend = shouldShowResendButton(timeRemaining, canResend, resendCooldown);
  const canClickResend = showResend && !isLoading;

  const getVerifyButtonStyle = () => {
    const baseStyle = [styles.verifyButton];
    
    if (!canClickVerify) {
      baseStyle.push(styles.buttonDisabled);
    } else {
      baseStyle.push(styles.buttonActive);
    }
    
    return baseStyle;
  };

  const getResendButtonStyle = () => {
    const baseStyle = [styles.resendButton];
    
    if (!canClickResend) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    return baseStyle;
  };

  const getResendButtonText = () => {
    if (resendCooldown > 0) {
      return `Resend (${formatTime(resendCooldown)})`;
    }
    return EMAIL_VERIFICATION_DATA.buttons.resendCode;
  };

  const getAttemptText = () => {
    const remaining = EMAIL_VERIFICATION_DATA.maxAttempts - attemptCount;
    if (remaining <= 0) return null;
    
    return `You have ${remaining} attemps left `;
  };

  return (
    <View style={styles.container}>
      {/* Verify Button */}
      <TouchableOpacity
        style={getVerifyButtonStyle()}
        onPress={onVerify}
        disabled={!canClickVerify}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator 
            color={EMAIL_VERIFICATION_DATA.colors.text} 
            size="small" 
          />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle"
              size={Math.max(20, width * 0.05)}
              color={EMAIL_VERIFICATION_DATA.colors.text}
              style={styles.buttonIcon}
            />
            <Text style={styles.verifyButtonText}>
              {EMAIL_VERIFICATION_DATA.buttons.verify}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Attempt Counter */}
      {attemptCount > 0 && getAttemptText() && (
        <Text style={styles.attemptText}>
          {getAttemptText()}
        </Text>
      )}

      {/* Action Buttons Row */}
      <View style={styles.actionButtonsRow}>
        {/* Resend Code Button */}
        <TouchableOpacity
          style={getResendButtonStyle()}
          onPress={onResendCode}
          disabled={!canClickResend}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh"
            size={Math.max(16, width * 0.04)}
            color={canClickResend 
              ? EMAIL_VERIFICATION_DATA.colors.primary 
              : EMAIL_VERIFICATION_DATA.colors.textSecondary
            }
            style={styles.buttonIcon}
          />
          <Text style={[
            styles.resendButtonText,
            !canClickResend && styles.buttonTextDisabled
          ]}>
            {getResendButtonText()}
          </Text>
        </TouchableOpacity>

        {/* Change Email Button */}
        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={onChangeEmail}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Ionicons
            name="mail-outline"
            size={Math.max(16, width * 0.04)}
            color={EMAIL_VERIFICATION_DATA.colors.textSecondary}
            style={styles.buttonIcon}
          />
          <Text style={styles.changeEmailButtonText}>
            {EMAIL_VERIFICATION_DATA.buttons.changeEmail}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(20, width * 0.05),
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.primary,
    borderRadius: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    marginBottom: Math.max(12, width * 0.03),
    shadowColor: EMAIL_VERIFICATION_DATA.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonActive: {
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.textSecondary + '40',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    fontWeight: 'bold',
    color: EMAIL_VERIFICATION_DATA.colors.text,
  },
  attemptText: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: EMAIL_VERIFICATION_DATA.colors.warning,
    textAlign: 'center',
    marginBottom: Math.max(16, width * 0.04),
    fontWeight: '500',
  },
  actionButtonsRow: {
    gap: Math.max(12, width * 0.03),
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: EMAIL_VERIFICATION_DATA.colors.primary + '60',
    borderRadius: Math.max(12, width * 0.03),
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(16, width * 0.04),
    marginBottom: Math.max(8, width * 0.02),
  },
  resendButtonText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: EMAIL_VERIFICATION_DATA.colors.primary,
    fontWeight: '600',
  },
  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  changeEmailButtonText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: EMAIL_VERIFICATION_DATA.colors.textSecondary,
    fontWeight: '500',
  },
  buttonTextDisabled: {
    color: EMAIL_VERIFICATION_DATA.colors.textSecondary + '80',
  },
  buttonIcon: {
    marginRight: Math.max(8, width * 0.02),
  },
});

export default EmailVerificationActions;