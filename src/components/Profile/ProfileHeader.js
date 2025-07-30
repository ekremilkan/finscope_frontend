import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import {
  getGlassMorphismStyle,
  getResponsiveSize,
  getUserAvatar,
  formatJoinDate
} from '../../utils/profileUtils';
import { COLORS } from '../../data/profileData';
import { getFontFamily } from '../../constants/fontConstants';
import { COLORS as GLOBAL_COLORS } from '../../constants/colorConstants';

const { width } = Dimensions.get('window');

const ProfileHeader = ({ user, onEditPress, isLoading = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Premium Member': return COLORS.warning;
      case 'Gold Member': return '#FFD700';
      case 'Silver Member': return '#C0C0C0';
      default: return COLORS.primary;
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Premium Member': return '👑';
      case 'Gold Member': return '🥇';
      case 'Silver Member': return '🥈';
      default: return '⭐';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{getUserAvatar(user.name)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
          <Text style={styles.statusEmoji}>{getStatusEmoji(user.status)}</Text>
        </View>
      </View>

      <Text style={styles.name}>{user.name || 'User'}</Text>
      <Text style={styles.email}>{user.email || 'Email not provided'}</Text>
      <Text style={styles.status}>{user.status}</Text>
      
      {/* Email Verification Status */}
      {user.isVerified !== undefined && (
        <View style={styles.verificationContainer}>
          <Text style={[
            styles.verificationText,
            { color: user.isVerified ? COLORS.success : COLORS.warning }
          ]}>
            {user.isVerified ? '✅ Email Verified' : '⚠️ Email Not Verified'}
          </Text>
        </View>
      )}
      
      <Text style={styles.joinDate}>
        Joined: {formatJoinDate(user.joinDate) || user.joinDate}
      </Text>

      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...getGlassMorphismStyle(0.9),
    alignItems: 'center',
    paddingVertical: Math.max(24, width * 0.06),
    paddingHorizontal: Math.max(20, width * 0.05),
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
  },
  logoContainer: {
    width: Math.max(60, width * 0.15),
    height: Math.max(60, width * 0.15),
    marginBottom: Math.max(16, width * 0.04),
    borderRadius: Math.max(12, width * 0.03),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  logo: {
    width: Math.max(48, width * 0.12),
    height: Math.max(48, width * 0.12),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Math.max(16, width * 0.04),
  },
  avatar: {
    fontSize: getResponsiveSize(width, 0.15, 48, 80),
    textAlign: 'center',
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    textAlignVertical: 'center',
    lineHeight: Math.max(80, width * 0.2),
  },
  statusBadge: {
    position: 'absolute',
    bottom: -Math.max(4, width * 0.01),
    right: -Math.max(4, width * 0.01),
    width: Math.max(24, width * 0.06),
    height: Math.max(24, width * 0.06),
    borderRadius: Math.max(12, width * 0.03),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GLOBAL_COLORS.TEXT_PRIMARY,
  },
  statusEmoji: {
    fontSize: Math.max(12, width * 0.03),
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(40, width * 0.1),
  },
  loadingText: {
    fontSize: getResponsiveSize(width, 0.04, 16, 20),
    ...getFontFamily('REGULAR'),
    color: GLOBAL_COLORS.TEXT_SECONDARY,
  },
  status: {
    fontSize: getResponsiveSize(width, 0.04, 16, 20),
    ...getFontFamily('SEMIBOLD'),
    color: GLOBAL_COLORS.PRIMARY,
    marginBottom: Math.max(12, width * 0.03),
    textAlign: 'center',
  },
  name: {
    fontSize: getResponsiveSize(width, 0.06, 24, 32),
    ...getFontFamily('BOLD'),
    color: GLOBAL_COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(4, width * 0.01),
    textAlign: 'center',
  },
  email: {
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    ...getFontFamily('REGULAR'),
    color: GLOBAL_COLORS.TEXT_SECONDARY,
    marginBottom: Math.max(8, width * 0.02),
    textAlign: 'center',
  },
  joinDate: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    ...getFontFamily('REGULAR'),
    color: GLOBAL_COLORS.TEXT_SECONDARY,
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: GLOBAL_COLORS.PRIMARY,
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(10, width * 0.025),
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: GLOBAL_COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonText: {
    color: GLOBAL_COLORS.SECONDARY,
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    ...getFontFamily('SEMIBOLD'),
  },
  verificationContainer: {
    marginBottom: Math.max(8, width * 0.02),
  },
  verificationText: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    ...getFontFamily('MEDIUM'),
    textAlign: 'center',
  },
});

export default ProfileHeader;
