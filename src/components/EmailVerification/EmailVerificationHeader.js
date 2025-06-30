import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { EMAIL_VERIFICATION_DATA } from '../../data/emailVerificationData';
import { handleBackPress, formatEmail } from '../../utils/emailVerificationUtils';

const { width } = Dimensions.get('window');

const EmailVerificationHeader = ({ 
  navigation, 
  email, 
  onBackPress 
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      handleBackPress(navigation);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="arrow-back" 
          size={Math.max(24, width * 0.06)} 
          color={EMAIL_VERIFICATION_DATA.colors.text} 
        />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.title}>
          {EMAIL_VERIFICATION_DATA.title}
        </Text>
        
        <Text style={styles.subtitle}>
          {EMAIL_VERIFICATION_DATA.subtitle}
        </Text>
        
        {email && (
          <Text style={styles.emailText}>
            {formatEmail(email)}
          </Text>
        )}
      </View>
      
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: 'transparent',
    minHeight: Math.max(80, width * 0.2),
  },
  backButton: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
    borderRadius: Math.max(22, width * 0.055),
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: EMAIL_VERIFICATION_DATA.colors.borderColor,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  title: {
    fontSize: Math.max(18, Math.min(24, width * 0.06)),
    fontWeight: 'bold',
    color: EMAIL_VERIFICATION_DATA.colors.text,
    textAlign: 'center',
    marginBottom: Math.max(4, width * 0.01),
  },
  subtitle: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: EMAIL_VERIFICATION_DATA.colors.textSecondary,
    textAlign: 'center',
    lineHeight: Math.max(20, width * 0.05),
    marginBottom: Math.max(8, width * 0.02),
  },
  emailText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: EMAIL_VERIFICATION_DATA.colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  placeholder: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
  },
});

export default EmailVerificationHeader;