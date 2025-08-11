import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import { EMAIL_VERIFICATION_DATA } from '../../data/emailVerificationData';
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
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
      {/* Corner Gradients */}
      <LinearGradient
        colors={getCornerGradientColors()}
        style={styles.topRightGradient}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <LinearGradient
        colors={getCornerGradientColors().reverse()}
        style={styles.bottomLeftGradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
          style={styles.backButtonGradient}
        >
          <Ionicons 
            name="arrow-back" 
            size={Math.max(24, width * 0.06)} 
            color={COLORS.TEXT_PRIMARY} 
          />
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.title}>
          {EMAIL_VERIFICATION_DATA.title}
        </Text>
        
        <Text style={styles.subtitle}>
          {EMAIL_VERIFICATION_DATA.subtitle}
        </Text>
        
        {email && (
          <View style={styles.emailContainer}>
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.emailGradient}
            >
              <Text style={styles.emailText}>
                {formatEmail(email)}
              </Text>
            </LinearGradient>
          </View>
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
    position: 'relative',
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: 200,
    borderBottomLeftRadius: 100,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 200,
    height: 200,
    borderTopRightRadius: 100,
  },
  backButton: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
    borderRadius: Math.max(22, width * 0.055),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.GLASS_BORDER,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
  },
  title: {
    fontSize: Math.max(18, Math.min(24, width * 0.06)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: Math.max(4, width * 0.01),
  },
  subtitle: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: Math.max(20, width * 0.05),
    marginBottom: Math.max(8, width * 0.02),
  },
  emailContainer: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emailGradient: {
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, width * 0.015),
  },
  emailText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
    textAlign: 'center',
  },
  placeholder: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
  },
});

export default EmailVerificationHeader;