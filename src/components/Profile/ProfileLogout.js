import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize } from '../../utils/profileUtils'; 
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ProfileLogout = ({ user, onLogoutPress }) => {
  const getAppVersion = () => {
    return 'finScope v2.1.0';
  };

  const getLastLoginInfo = () => {
    if (user?.lastLogin) {
      const date = new Date(user.lastLogin);
      return `Last login: ${date.toLocaleDateString('en-US')}`;
    }
    return 'Last login: Unknown';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={onLogoutPress}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutText}>Secure Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
       
        <Text style={styles.versionText}>{getAppVersion()}</Text>
        {user?.deviceInfo && (
          <Text style={styles.deviceText}>
            {user.deviceInfo.platform} • {user.deviceInfo.version}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05), 
    marginBottom: Math.max(28, width * 0.07), 
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(14, width * 0.035), 
    paddingHorizontal: Math.max(32, width * 0.08),
    width: '100%',
    marginBottom: Math.max(16, width * 0.04), 
    
  },
  logoutIcon: {
    fontSize: getResponsiveSize(width, 0.05, 20, 28),
    marginRight: Math.max(12, width * 0.03),
  },
  logoutText: {
    fontSize: getResponsiveSize(width, 0.04, 16, 22),
    ...getFontFamily('BOLD'),
    color: COLORS.ERROR,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: Math.max(10, width * 0.025), 
  },
  lastLoginText: {
    fontSize: getResponsiveSize(width, 0.028, 11, 15),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
    opacity: 0.8,
    marginBottom: 4,
  },
  deviceText: {
    fontSize: getResponsiveSize(width, 0.025, 10, 14),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('REGULAR'),
    opacity: 0.6,
    marginTop: 4,
  },
  versionText: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
    opacity: 0.7,
  },
});

export default ProfileLogout;