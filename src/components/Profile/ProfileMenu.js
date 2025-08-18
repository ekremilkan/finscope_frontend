import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getResponsiveSize, handleNavigation } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
import CustomAlertModal from '../common/CustomAlertModal';

const { width } = Dimensions.get('window');

const ProfileMenu = ({ menuItems, navigation, user, showAlert: externalShowAlert, hideAlert: externalHideAlert }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  const showAlert = (config) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
    setAlertConfig({});
  };

  const handleItemPress = item => {
    showAlert({
      title: 'Coming Soon',
      message: 'This feature is currently under development. Thank you for your understanding!',
      showCancelButton: false,
      confirmText: 'OK',
    });
  };

  const getItemAvailability = item => {
    if (item.route === 'EarnRewards' && user?.status === 'Basic Member') {
      return { available: false, reason: 'Premium feature' };
    }
    return { available: true };
  };

  const MenuItemComponent = ({ item }) => {
    const availability = getItemAvailability(item);
    const isDisabled = !availability.available;

    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          item.danger && styles.dangerItem,
          isDisabled && styles.disabledItem,
        ]}
        onPress={() => !isDisabled && handleItemPress(item)}
        activeOpacity={isDisabled ? 1 : 0.8}
        disabled={isDisabled}
      >
        <View style={styles.menuItemContent}>
          <View
            style={[
              styles.iconContainer,
              item.danger && styles.dangerIconContainer,
              isDisabled && styles.disabledIconContainer,
            ]}
          >
            <Text style={[styles.menuIcon, isDisabled && styles.disabledText]}>
              {item.icon}
            </Text>
          </View>

          <View style={styles.menuTextContainer}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.menuTitle,
                  item.danger && styles.dangerText,
                  isDisabled && styles.disabledText,
                ]}
              >
                {item.title}
              </Text>
              {item.badge && !isDisabled && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badgeText}</Text>
                </View>
              )}
              {!availability.available && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>
                    {availability.reason}
                  </Text>
                </View>
              )}
            </View>
            {item.subtitle && (
              <Text
                style={[styles.menuSubtitle, isDisabled && styles.disabledText]}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}> Settings & Services</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={item.id}>
            <MenuItemComponent item={item} />
            {index < menuItems.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>

      {/* Custom Alert Modal */}
      <CustomAlertModal
        isVisible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={hideAlert}
        onCancel={hideAlert}
        confirmText={alertConfig.confirmText}
        showCancelButton={alertConfig.showCancelButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  headerContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dangerItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
  },
  disabledItem: {
    opacity: 0.6,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(247, 214, 72, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  disabledIconContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  menuIcon: {
    fontSize: 18,
    lineHeight: 20,
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuTitle: {
    fontSize: 16,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
  },
  dangerText: {
    color: COLORS.ERROR,
  },
  disabledText: {
    color: COLORS.TEXT_SECONDARY,
  },
  badge: {
    backgroundColor: COLORS.WARNING,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
    lineHeight: 12,
  },
  premiumBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  premiumBadgeText: {
    fontSize: 9,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
    lineHeight: 11,
  },
  menuSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('REGULAR'),
    lineHeight: 16,
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER_SECONDARY,
    marginHorizontal: 16,
    opacity: 0.3,
  },
});

export default ProfileMenu;