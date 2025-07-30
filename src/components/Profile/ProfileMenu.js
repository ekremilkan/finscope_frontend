import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize, handleNavigation, handleAccountDeletion } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ProfileMenu = ({ menuItems, navigation, user }) => {
  const handleItemPress = (item) => {
    if (item.type === 'navigation') {
      const params = {};
      if (item.route === 'UserStats') {
        params.userId = user?.id;
      } else if (item.route === 'EarnRewards') {
        params.userStatus = user?.status;
        params.userStats = user?.stats;
      }
      
      handleNavigation(navigation, item.route, params);
    } else if (item.type === 'action' && item.id === 8) {
      handleAccountDeletion(navigation, user);
    }
  };

  const getItemAvailability = (item) => {
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
          isDisabled && styles.disabledItem
        ]} 
        onPress={() => !isDisabled && handleItemPress(item)}
        activeOpacity={isDisabled ? 1 : 0.7}
        disabled={isDisabled}
      >
        <View style={styles.menuItemLeft}>
          <View style={[
            styles.iconContainer,
            item.danger && styles.dangerIconContainer,
            isDisabled && styles.disabledIconContainer
          ]}>
            <Text style={[
              styles.menuIcon,
              isDisabled && styles.disabledText
            ]}>
              {item.icon}
            </Text>
          </View>
          
          <View style={styles.menuTextContainer}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.menuTitle,
                item.danger && styles.dangerText,
                isDisabled && styles.disabledText
              ]}>
                {item.title}
              </Text>
              {item.badge && !isDisabled && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              {!availability.available && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>{availability.reason}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.menuSubtitle,
              isDisabled && styles.disabledText
            ]}>
              {item.subtitle}
            </Text>
          </View>
        </View>
        
        <Text style={[
          styles.arrow,
          item.danger && styles.dangerText,
          isDisabled && styles.disabledText
        ]}>
          {isDisabled ? '🔒' : (item.type === 'navigation' ? '→' : '⚠️')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>⚙️ Settings & Services</Text>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <MenuItemComponent key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 16,
    paddingVertical: Math.max(12, width * 0.03),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SECONDARY,
  },
  dangerItem: {
    borderBottomColor: 'rgba(239, 68, 68, 0.2)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: Math.max(44, width * 0.11),
    height: Math.max(44, width * 0.11),
    borderRadius: Math.max(22, width * 0.055),
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(16, width * 0.04),
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  menuIcon: {
    fontSize: getResponsiveSize(width, 0.05, 18, 24),
  },
  menuTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  menuTitle: {
    fontSize: getResponsiveSize(width, 0.04, 16, 20),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  dangerText: {
    color: COLORS.ERROR,
  },
  badge: {
    backgroundColor: COLORS.WARNING,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: getResponsiveSize(width, 0.025, 10, 14),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
  },
  menuSubtitle: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('REGULAR'),
  },
  premiumBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: getResponsiveSize(width, 0.022, 9, 12),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledIconContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  disabledText: {
    color: COLORS.TEXT_SECONDARY,
  },
  arrow: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('SEMIBOLD'),
  },
});

export default ProfileMenu;
