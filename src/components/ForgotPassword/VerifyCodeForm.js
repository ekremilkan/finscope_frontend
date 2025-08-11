import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  AppState,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const VERIFY_CODE_TIME = 15 * 60; // 15 dakika saniye cinsinden

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const VerifyCodeForm = ({ code, setCode, onSubmit, loading, success, expirationDate }) => {
  const inputRefs = useRef([]);
  const [remainingSeconds, setRemainingSeconds] = useState(VERIFY_CODE_TIME);
  const appState = React.useRef(AppState.currentState);
  const timerId = React.useRef(null);

  // Timer kontrolü
  useEffect(() => {
    const updateRemaining = () => {
      const now = new Date();
      const diff = Math.floor((new Date(expirationDate) - now) / 1000);
      setRemainingSeconds(diff > 0 ? diff : 0);
      if (diff <= 0 && timerId.current) {
        clearInterval(timerId.current);
      }
    };

    updateRemaining();
    timerId.current = setInterval(updateRemaining, 1000);

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateRemaining();
      }
      appState.current = nextAppState;
    });

    return () => {
      if (timerId.current) clearInterval(timerId.current);
      subscription.remove();
    };
  }, [expirationDate]);

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (value, index) => {
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.contentGradient}
      >
        <Text style={styles.label}>Enter Verification Code</Text>

        {success && (
          <View style={styles.successContainer}>
            <LinearGradient
              colors={[COLORS.SUCCESS + '20', COLORS.SUCCESS + '10']}
              style={styles.successGradient}
            >
              <Icon name="check-circle" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.successMessage}>Code verified successfully</Text>
            </LinearGradient>
          </View>
        )}

        <View style={styles.codeInputContainer}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.inputWrapper}>
              <LinearGradient
                colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
                style={styles.inputGradient}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[i] = ref)}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code[i]}
                  onChangeText={(val) => handleChange(val, i)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(code[i], i);
                    }
                  }}
                  autoFocus={i === 0}
                  editable={remainingSeconds > 0 && !loading}
                  placeholder="0"
                  placeholderTextColor={COLORS.TEXT_SECONDARY + '60'}
                />
              </LinearGradient>
            </View>
          ))}
        </View>

        <View style={styles.timerContainer}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.timerGradient}
          >
            <Icon name="timer" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.timerText}>
              {remainingSeconds > 0
                ? `Time left: ${formatTime(remainingSeconds)}`
                : 'Verification code expired. Please request a new one.'}
            </Text>
          </LinearGradient>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (loading || remainingSeconds === 0) && styles.disabledButton]}
          onPress={onSubmit}
          disabled={loading || code.join('').length < 6 || remainingSeconds === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={(loading || remainingSeconds === 0) 
              ? [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']
              : [COLORS.PRIMARY, COLORS.PRIMARY]
            }
            style={styles.submitButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.TEXT_PRIMARY} />
            ) : (
              <>
                <Icon name="verified" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.submitButtonText}>Verify Code</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.05),
    paddingTop: 40,
    flexGrow: 1,
  },
  contentGradient: {
    width: '100%',
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 24,
    textAlign: 'center',
  },
  successContainer: {
    marginBottom: 16,
  },
  successGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.SUCCESS,
  },
  successMessage: {
    color: COLORS.SUCCESS,
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('SEMIBOLD'),
    marginLeft: Math.max(8, width * 0.02),
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  inputWrapper: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGradient: {
    width: Math.max(44, width * 0.12),
    height: Math.max(52, width * 0.14),
    borderRadius: Math.max(12, width * 0.03),
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeInput: {
    width: '100%',
    height: '100%',
    color: COLORS.TEXT_PRIMARY,
    fontSize: Math.max(20, width * 0.05),
    ...getFontFamily('BOLD'),
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  timerContainer: {
    marginBottom: 24,
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('MEDIUM'),
    marginLeft: Math.max(8, width * 0.02),
  },
  submitButton: {
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(48, width * 0.12),
    borderRadius: Math.max(16, width * 0.04),
  },
  submitButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('SEMIBOLD'),
    letterSpacing: 0.5,
    textAlign: 'center',
    marginLeft: Math.max(8, width * 0.02),
  },
  disabledButton: {
    // Gradient already applied
  },
});

export default VerifyCodeForm;
