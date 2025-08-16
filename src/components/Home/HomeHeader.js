import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFontFamily } from '../../constants/fontConstants';
import { COLORS } from '../../constants/colorConstants';
import CustomAlertModal from '../common/CustomAlertModal'; 
const { width, height } = Dimensions.get('window');

const HomeHeader = ({ userName, onLogoutPress, onNotificationPress }) => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  const handleLogoutPress = () => {
    console.log('🔧 Logout icon pressed!');
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    console.log('🔓 Modal onaylandı, logout yapılıyor...');
    setLogoutModalVisible(false);
    
    if (onLogoutPress) {
      onLogoutPress();
    }
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const handleNotificationPress = () => {
    console.log('🔔 Notification icon pressed!');
    setNotificationModalVisible(true);
  };

  const confirmNotification = () => {
    setNotificationModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/finscope-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeLabel}>Welcome back</Text>
          <Text 
            style={styles.welcomeText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName}!
          </Text>
        </View>
      </View>
      
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIcon} onPress={handleNotificationPress}>
          <View style={styles.iconContainer}>
            <Icon name="notifications" size={Math.max(20, Math.min(28, width * 0.06))} color={COLORS.TEXT_SECONDARY} />
            <View style={styles.notificationDot} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={handleLogoutPress}
        >
          <View style={styles.iconContainer}>
            <Icon name="logout" size={Math.max(20, Math.min(28, width * 0.06))} color={COLORS.ERROR} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <CustomAlertModal
        isVisible={logoutModalVisible}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
        showCancelButton={true}
      />

      {/* Notification Coming Soon Modal */}
      <CustomAlertModal
        isVisible={notificationModalVisible}
        title="Coming Soon"
        message="This feature is currently under development. Thank you for your understanding!"
        onConfirm={confirmNotification}
        confirmText="OK"
        showCancelButton={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, height * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SECONDARY,
    minHeight: Math.max(70, height * 0.09),
    backgroundColor: COLORS.CARD_BACKGROUND,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: Math.max(12, width * 0.03),
  },
  logoContainer: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(8, width * 0.02),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  logo: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
  },
  welcomeContainer: {
    flex: 1,
    minWidth: 0,
  },
  welcomeLabel: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: Math.max(18, Math.min(24, width * 0.06)),
    ...getFontFamily('EXTRABOLD'),
    color: COLORS.TEXT_PRIMARY,
    flexShrink: 1,
    maxWidth: width * 0.5,
    textShadowColor: 'rgba(247, 214, 72, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'flex-end',
    gap: Math.max(8, width * 0.02),
  },
  headerIcon: {
    position: 'relative',
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
  },
  iconContainer: {
    padding: Math.max(8, width * 0.02),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  notificationDot: {
    position: 'absolute',
    top: Math.max(4, width * 0.01),
    right: Math.max(4, width * 0.01),
    width: Math.max(8, width * 0.02),
    height: Math.max(8, width * 0.02),
    borderRadius: Math.max(4, width * 0.01),
    backgroundColor: COLORS.ERROR,
    borderWidth: 1,
    borderColor: COLORS.TEXT_PRIMARY,
  },
});

export default HomeHeader;