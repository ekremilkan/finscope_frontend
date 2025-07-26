import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {
  getGlassMorphismStyle,
  getResponsiveSize,
  getUserAvatar,
  formatJoinDate
} from '../../utils/profileUtils';
import { COLORS } from '../../data/profileData';

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
  avatarContainer: {
    position: 'relative',
    marginBottom: Math.max(16, width * 0.04),
  },
  avatar: {
    fontSize: getResponsiveSize(width, 0.15, 48, 80),
    textAlign: 'center',
    backgroundColor: COLORS.primary,
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    textAlignVertical: 'center',
    lineHeight: Math.max(80, width * 0.2),
  },
  statusBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.background,
    minWidth: 32,
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(40, width * 0.1),
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
  },
  status: {
    fontSize: getResponsiveSize(width, 0.032, 13, 17),
    color: COLORS.warning,
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: getResponsiveSize(width, 0.055, 20, 28),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  email: {
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.textSecondary,
    marginBottom: Math.max(20, width * 0.05),
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.text,
    fontSize: getResponsiveSize(width, 0.035, 14, 18),
    fontWeight: '600',
  },
});

export default ProfileHeader;
