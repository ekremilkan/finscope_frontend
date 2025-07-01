import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FORGOT_PASSWORD_DATA } from '../../data/forgotPasswordData';
import { handleBackToLogin } from '../../utils/forgotPasswordUtils';

const { width } = Dimensions.get('window');

const ForgotPasswordHeader = ({ navigation, step }) => {
  const isEmailSent = step === 'email_sent';

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => handleBackToLogin(navigation)}
        activeOpacity={0.7}
      >
        <View style={styles.backButtonContent}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </View>
      </TouchableOpacity>

      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons 
            name={isEmailSent ? "mail-outline" : "lock-closed-outline"} 
            size={48} 
            color="#6366f1" 
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {isEmailSent ? FORGOT_PASSWORD_DATA.emailSentTitle : FORGOT_PASSWORD_DATA.title}
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          {isEmailSent ? FORGOT_PASSWORD_DATA.emailSentSubtitle : FORGOT_PASSWORD_DATA.subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Math.max(20, width * 0.05),
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingBottom: Math.max(30, width * 0.08),
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: Math.max(20, width * 0.05),
  },
  backButtonContent: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: Math.max(22, width * 0.055),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: Math.max(40, width * 0.1),
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.max(24, width * 0.06),
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: Math.max(24, Math.min(32, width * 0.08)),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: Math.max(12, width * 0.03),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Math.max(14, Math.min(18, width * 0.045)),
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: Math.max(20, width * 0.055),
    maxWidth: width * 0.8,
    letterSpacing: 0.2,
  },
});

export default ForgotPasswordHeader;
