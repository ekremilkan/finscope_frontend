import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize, handleNavigation, handleAccountDeletion } from '../../utils/profileUtils';
import { COLORS } from '../../data/profileData';

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
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  menuContainer: {
    ...getGlassMorphismStyle(0.8),
    paddingVertical: Math.max(12, width * 0.03),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
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
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(16, width * 0.04),
  },
  dangerIconContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
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
    fontWeight: '600',
    color: COLORS.text,
  },
  dangerText: {
    color: COLORS.error,
  },
  badge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: getResponsiveSize(width, 0.025, 10, 14),
    fontWeight: '600',
    color: COLORS.background,
  },
  menuSubtitle: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  premiumBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  premiumBadgeText: {
    fontSize: getResponsiveSize(width, 0.022, 9, 12),
    fontWeight: '600',
    color: COLORS.text,
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledIconContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  arrow: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default ProfileMenu;
