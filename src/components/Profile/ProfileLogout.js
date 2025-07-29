import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize, handleLogout } from '../../utils/profileUtils';
import { COLORS } from '../../data/profileData';

const { width } = Dimensions.get('window');

const ProfileLogout = ({ navigation, user }) => {
  const getAppVersion = () => {
    // This would typically come from package.json or environment
    return 'Finscope v2.1.0';
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
        onPress={() => handleLogout(navigation, user)}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Secure Logout</Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.lastLoginText}>{getLastLoginInfo()}</Text>
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
    marginTop: Math.max(24, width * 0.06),
    marginBottom: Math.max(32, width * 0.08),
    alignItems: 'center',
  },
  logoutButton: {
    ...getGlassMorphismStyle(0.9),
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(32, width * 0.08),
    width: '100%',
    marginBottom: Math.max(20, width * 0.05),
  },
  logoutIcon: {
    fontSize: getResponsiveSize(width, 0.05, 20, 28),
    marginRight: Math.max(12, width * 0.03),
  },
  logoutText: {
    fontSize: getResponsiveSize(width, 0.04, 16, 22),
    fontWeight: '700',
    color: COLORS.error,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: Math.max(12, width * 0.03),
  },
  lastLoginText: {
    fontSize: getResponsiveSize(width, 0.028, 11, 15),
    color: COLORS.textSecondary,
    fontWeight: '500',
    opacity: 0.8,
    marginBottom: 4,
  },
  deviceText: {
    fontSize: getResponsiveSize(width, 0.025, 10, 14),
    color: COLORS.textSecondary,
    fontWeight: '400',
    opacity: 0.6,
    marginTop: 4,
  },
  versionText: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.textSecondary,
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default ProfileLogout;
