import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const HomeBottomNavigation = ({ bottomNavItems, activeTab, onTabPress }) => {
  return (
    <View style={styles.bottomNavigation}>
      {bottomNavItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.bottomNavItem}
          onPress={() => onTabPress(item.id)}
          activeOpacity={0.7}
        >
          <Icon
            name={item.icon}
            size={24}
            color={activeTab === item.id ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
          />
          <Text style={[
            styles.bottomNavText,
            { color: activeTab === item.id ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY }
          ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(20, width * 0.05),
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 12,
  },
  bottomNavText: {
    fontSize: Math.max(11, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
    marginTop: 4,
  },
});

export default HomeBottomNavigation; 