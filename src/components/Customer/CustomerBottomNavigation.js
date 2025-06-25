import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CustomerBottomNavigation = ({ bottomNavItems, activeTab, onTabPress }) => {
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
            color={activeTab === item.id ? '#6366f1' : '#64748b'}
          />
          <Text style={[
            styles.bottomNavText,
            { color: activeTab === item.id ? '#6366f1' : '#64748b' }
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
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 12,
  },
  bottomNavText: {
    fontSize: Math.max(10, width * 0.028),
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default CustomerBottomNavigation; 