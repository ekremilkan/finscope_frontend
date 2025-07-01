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
import { FORGOT_PASSWORD_DATA } from '../../data/forgotPasswordData';

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
          <Ionicons 
            name="mail-outline" 
            size={20} 
            color={error ? "#ef4444" : "#94a3b8"} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={[styles.textInput, error && styles.textInputError]}
            placeholder={FORGOT_PASSWORD_DATA.emailPlaceholder}
            placeholderTextColor="#64748b"
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
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.sendButton, (!email.trim() || loading) && styles.sendButtonDisabled]}
        onPress={handleSendResetCode}
        disabled={!email.trim() || loading}
        activeOpacity={0.8}
      >
        <View style={styles.sendButtonContent}>
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="paper-plane-outline" size={20} color="#ffffff" />
          )}
          <Text style={styles.sendButtonText}>
            {loading ? 'Sending...' : FORGOT_PASSWORD_DATA.sendButtonText}
          </Text>
        </View>
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
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  textInputError: {
    color: '#ef4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Math.max(8, width * 0.02),
    paddingHorizontal: Math.max(4, width * 0.01),
  },
  errorText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: Math.max(6, width * 0.015),
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(24, width * 0.06),
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
    shadowOpacity: 0.1,
  },
  sendButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: Math.max(8, width * 0.02),
    letterSpacing: 0.5,
  },
});

export default ForgotPasswordForm;
