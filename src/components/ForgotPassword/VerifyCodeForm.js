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
      <Text style={styles.label}>Enter Verification Code</Text>

      {success && (
        <Text style={styles.successMessage}>✔ Code verified successfully</Text>
      )}

      <View style={styles.codeInputContainer}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
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
          />
        ))}
      </View>

      <Text style={styles.timerText}>
        {remainingSeconds > 0
          ? `Time left: ${formatTime(remainingSeconds)}`
          : 'Verification code expired. Please request a new one.'}
      </Text>

      <TouchableOpacity
        style={[styles.submitButton, (loading || remainingSeconds === 0) && styles.disabledButton]}
        onPress={onSubmit}
        disabled={loading || code.join('').length < 6 || remainingSeconds === 0}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Verify Code</Text>
        )}
      </TouchableOpacity>
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
  label: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  successMessage: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  codeInput: {
    width: Math.max(44, width * 0.12),
    height: Math.max(52, width * 0.14),
    backgroundColor: 'rgba(30,41,59,0.8)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  timerText: {
    color: '#94a3b8',
    fontSize: Math.max(14, width * 0.04),
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
  },
});

export default VerifyCodeForm;
