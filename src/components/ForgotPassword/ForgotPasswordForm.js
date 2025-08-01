import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { FORGOT_PASSWORD_DATA } from '../../data/forgotPasswordData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ForgotPasswordForm = ({ 
  email, 
  setEmail, 
  error, 
  setError, 
  loading, 
  setLoading, 
  onSendResetCode
}) => {

  const handleSendResetCode = () => {
    onSendResetCode();
  };

  const handleEmailChange = (text) => {
    setEmail(text.trim().toLowerCase());
    if (error) setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.inputGradient}
          >
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={error ? COLORS.ERROR : COLORS.TEXT_SECONDARY} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={[styles.textInput, error && styles.textInputError]}
              placeholder={FORGOT_PASSWORD_DATA.emailPlaceholder}
              placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!loading}
              returnKeyType="send"
              onSubmitEditing={handleSendResetCode}  // Enter tuşunda gönder
            />
          </LinearGradient>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <LinearGradient
              colors={[`${COLORS.ERROR}20`, `${COLORS.ERROR}10`]}
              style={styles.errorGradient}
            >
              <Ionicons name="alert-circle" size={16} color={COLORS.ERROR} />
              <Text style={styles.errorText}>{error}</Text>
            </LinearGradient>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.sendButton, (!email.trim() || loading) && styles.sendButtonDisabled]}
        onPress={handleSendResetCode}
        disabled={!email.trim() || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={(!email.trim() || loading) 
            ? [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']
            : [COLORS.PRIMARY, COLORS.PRIMARY]
          }
          style={styles.sendButtonGradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.TEXT_PRIMARY} />
          ) : (
            <Ionicons name="paper-plane-outline" size={20} color={COLORS.TEXT_PRIMARY} />
          )}
          <Text style={styles.sendButtonText}>
            {loading ? 'Sending...' : FORGOT_PASSWORD_DATA.sendButtonText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
  },
  inputContainer: {
    marginBottom: Math.max(24, width * 0.06),
  },
  inputWrapper: {
    borderRadius: Math.max(16, width * 0.04),
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
    borderRadius: Math.max(16, width * 0.04),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    minHeight: Math.max(56, width * 0.14),
  },
  inputIcon: {
    marginRight: Math.max(12, width * 0.03),
  },
  textInput: {
    flex: 1,
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.2,
  },
  textInputError: {
    color: COLORS.ERROR,
  },
  errorContainer: {
    marginTop: Math.max(8, width * 0.02),
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
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('MEDIUM'),
    color: COLORS.ERROR,
    marginLeft: Math.max(6, width * 0.015),
    flex: 1,
  },
  sendButton: {
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    shadowOpacity: 0.1,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
  },
  sendButtonText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginLeft: Math.max(8, width * 0.02),
    letterSpacing: 0.5,
  },
});

export default ForgotPasswordForm;
