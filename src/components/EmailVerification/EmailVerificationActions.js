import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { EMAIL_VERIFICATION_DATA, VERIFICATION_STATES } from '../../data/emailVerificationData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
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
        <LinearGradient
          colors={canClickVerify 
            ? [COLORS.PRIMARY, COLORS.PRIMARY] 
            : [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']
          }
          style={styles.verifyButtonGradient}
        >
          {isLoading ? (
            <ActivityIndicator 
              color={COLORS.TEXT_PRIMARY} 
              size="small" 
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle"
                size={Math.max(20, width * 0.05)}
                color={COLORS.TEXT_PRIMARY}
                style={styles.buttonIcon}
              />
              <Text style={styles.verifyButtonText}>
                {EMAIL_VERIFICATION_DATA.buttons.verify}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Attempt Counter */}
      {attemptCount > 0 && getAttemptText() && (
        <View style={styles.attemptContainer}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.attemptGradient}
          >
            <Text style={styles.attemptText}>
              {getAttemptText()}
            </Text>
          </LinearGradient>
        </View>
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
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.resendButtonGradient}
          >
            <Ionicons
              name="refresh"
              size={Math.max(16, width * 0.04)}
              color={canClickResend 
                ? COLORS.PRIMARY 
                : COLORS.TEXT_SECONDARY
              }
              style={styles.buttonIcon}
            />
            <Text style={[
              styles.resendButtonText,
              !canClickResend && styles.buttonTextDisabled
            ]}>
              {getResendButtonText()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Change Email Button */}
        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={onChangeEmail}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.changeEmailButtonGradient}
          >
            <Ionicons
              name="mail-outline"
              size={Math.max(16, width * 0.04)}
              color={COLORS.TEXT_SECONDARY}
              style={styles.buttonIcon}
            />
            <Text style={styles.changeEmailButtonText}>
              {EMAIL_VERIFICATION_DATA.buttons.changeEmail}
            </Text>
          </LinearGradient>
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
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: Math.max(12, width * 0.03),
  },
  verifyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
  },
  buttonActive: {
    // Gradient already applied
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  attemptContainer: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: Math.max(16, width * 0.04),
  },
  attemptGradient: {
    paddingVertical: Math.max(8, width * 0.02),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  attemptText: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    ...getFontFamily('MEDIUM'),
    color: COLORS.WARNING,
    textAlign: 'center',
  },
  actionButtonsRow: {
    gap: Math.max(12, width * 0.03),
  },
  resendButton: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: Math.max(8, width * 0.02),
  },
  resendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Math.max(12, width * 0.03),
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  resendButtonText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
  },
  changeEmailButton: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  changeEmailButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Math.max(12, width * 0.03),
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  changeEmailButtonText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
  },
  buttonTextDisabled: {
    color: COLORS.TEXT_SECONDARY + '80',
  },
  buttonIcon: {
    marginRight: Math.max(8, width * 0.02),
  },
});

export default EmailVerificationActions;