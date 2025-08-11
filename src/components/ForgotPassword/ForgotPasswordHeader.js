import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { FORGOT_PASSWORD_DATA } from '../../data/forgotPasswordData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
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
        <LinearGradient
          colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
          style={styles.backButtonGradient}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[COLORS.PRIMARY + '20', COLORS.PRIMARY + '10']}
            style={styles.iconGradient}
          >
            <Ionicons 
              name={isEmailSent ? "mail-outline" : "lock-closed-outline"} 
              size={48} 
              color={COLORS.PRIMARY} 
            />
          </LinearGradient>
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
    borderRadius: Math.max(22, width * 0.055),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonGradient: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
    borderRadius: Math.max(22, width * 0.055),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: Math.max(40, width * 0.1),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Math.max(24, width * 0.06),
  },
  iconGradient: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Math.max(24, Math.min(32, width * 0.08)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: Math.max(12, width * 0.03),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Math.max(14, Math.min(18, width * 0.045)),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: Math.max(20, width * 0.055),
    maxWidth: width * 0.8,
    letterSpacing: 0.2,
  },
});

export default ForgotPasswordHeader;
