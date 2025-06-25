import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const HomeHeader = ({ userName, onSettingsPress, onNotificationPress, onSwitchPress }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Icon name="person" size={Math.max(20, Math.min(28, width * 0.06))} color="#6366f1" />
        <Text 
          style={styles.welcomeText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Hoş geldin, {userName}!
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={onSwitchPress}
          activeOpacity={0.7}
        >
          <Icon name="business" size={Math.max(16, Math.min(20, width * 0.045))} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon} onPress={onNotificationPress}>
          <Icon name="notifications" size={Math.max(20, Math.min(28, width * 0.06))} color="#94a3b8" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={onSettingsPress}
        >
          <Icon name="settings" size={Math.max(20, Math.min(28, width * 0.06))} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
    minHeight: Math.max(70, width * 0.18),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: Math.max(12, width * 0.03),
  },
  welcomeText: {
    fontSize: Math.max(16, Math.min(22, width * 0.055)),
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: Math.max(8, width * 0.02),
    flexShrink: 1,
    maxWidth: width * 0.5,
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  headerIcon: {
    marginLeft: Math.max(16, width * 0.04),
    position: 'relative',
    padding: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationDot: {
    position: 'absolute',
    top: Math.max(4, width * 0.01),
    right: Math.max(4, width * 0.01),
    width: Math.max(8, width * 0.025),
    height: Math.max(8, width * 0.025),
    borderRadius: Math.max(4, width * 0.0125),
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  switchButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    marginRight: Math.max(12, width * 0.03),
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HomeHeader; 