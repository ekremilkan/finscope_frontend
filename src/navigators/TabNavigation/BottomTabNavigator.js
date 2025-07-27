import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { BOTTOM_NAV_ITEMS } from '../../data/homeData';

import HomeScreen from '../../screens/Home/HomeScreen';
import CampaignsScreen from '../../screens/CampaignsScreen';
import WalletScreen from '../../screens/Wallet/WalletScreen';
import ProfileScreen from '../../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const SCREEN_COMPONENTS = {
  home: HomeScreen,
  campaigns: CampaignsScreen,
  wallet: WalletScreen,
  profile: ProfileScreen,
};

const BottomTabNavigator = ({ onSwitchPress }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const item = BOTTOM_NAV_ITEMS.find(i => i.title === route.name);
        return {
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={item?.icon || 'ellipse-outline'} 
              size={size} 
              color={focused ? '#6366f1' : color} 
            />
          ),
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
          tabBarHideOnKeyboard: true,
          lazy: true, // Lazy load screens for better performance
        };
      }}
    >
      {BOTTOM_NAV_ITEMS.map(item => (
        <Tab.Screen
          key={item.id}
          name={item.title}
          options={{
            unmountOnBlur: item.id === 'campaigns', // Unmount campaigns screen when not focused
          }}
          children={(props) => {
            const ScreenComponent = SCREEN_COMPONENTS[item.id];
            return <ScreenComponent {...props} onSwitchPress={onSwitchPress} />;
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;