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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={item?.icon || 'ellipse-outline'} size={size} color={color} />
          ),
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopWidth: 0,
          },
          headerShown: false,
        };
      }}
    >
      {BOTTOM_NAV_ITEMS.map(item => (
        <Tab.Screen
          key={item.id}
          name={item.title}
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