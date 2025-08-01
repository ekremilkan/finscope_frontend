import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ResetPasswordForm = ({ onSubmit, loading, error }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    onSubmit(password, confirmPassword);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.contentGradient}
      >
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.inputGradient}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter new password"
              placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.inputGradient}
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Icon
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <LinearGradient
              colors={[`${COLORS.ERROR}20`, `${COLORS.ERROR}10`]}
              style={styles.errorGradient}
            >
              <Icon name="error" size={16} color={COLORS.ERROR} />
              <Text style={styles.errorText}>{error}</Text>
            </LinearGradient>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading || !password || !confirmPassword}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={loading || !password || !confirmPassword
              ? [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']
              : [COLORS.PRIMARY, COLORS.PRIMARY]
            }
            style={styles.submitButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.TEXT_PRIMARY} />
            ) : (
              <>
                <Icon name="lock-reset" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.submitButtonText}>Reset Password</Text>
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
    paddingHorizontal: Math.max(16, width * 0.05),
    marginTop: 40,
  },
  contentGradient: {
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
    color: COLORS.TEXT_PRIMARY,
    fontSize: Math.max(16, width * 0.04),
    marginBottom: Math.max(8, width * 0.02),
    ...getFontFamily('SEMIBOLD'),
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
    marginBottom: 20,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Math.max(12, width * 0.03),
    paddingVertical: Math.max(14, width * 0.035),
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  input: {
    flex: 1,
    color: COLORS.TEXT_PRIMARY,
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('MEDIUM'),
  },
  iconButton: {
    paddingHorizontal: Math.max(12, width * 0.03),
  },
  errorContainer: {
    marginBottom: Math.max(12, width * 0.03),
    borderRadius: Math.max(8, width * 0.02),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  errorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(8, width * 0.02),
  },
  errorText: {
    color: COLORS.ERROR,
    marginBottom: Math.max(12, width * 0.03),
    ...getFontFamily('MEDIUM'),
    marginLeft: Math.max(6, width * 0.015),
    flex: 1,
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
    borderRadius: Math.max(16, width * 0.04),
  },
  disabledButton: {
    // Gradient already applied
  },
  submitButtonText: {
    color: COLORS.TEXT_PRIMARY,
    ...getFontFamily('BOLD'),
    fontSize: Math.max(16, width * 0.04),
    letterSpacing: 0.5,
    marginLeft: Math.max(8, width * 0.02),
  },
});

export default ResetPasswordForm;
