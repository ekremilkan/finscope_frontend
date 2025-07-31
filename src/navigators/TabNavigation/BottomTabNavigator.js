import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { BOTTOM_NAV_ITEMS } from '../../data/homeData';
import { COLORS } from '../../constants/colorConstants';

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

const BottomTabNavigator = () => {
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
              color={focused ? COLORS.PRIMARY : color} 
            />
          ),
          tabBarActiveTintColor: COLORS.PRIMARY,
          tabBarInactiveTintColor: COLORS.TEXT_SECONDARY,
          tabBarStyle: {
            backgroundColor: COLORS.CARD_BACKGROUND,
            borderTopWidth: 1,
            borderTopColor: COLORS.BORDER_SECONDARY,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: COLORS.SHADOW_SECONDARY,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
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
            return <ScreenComponent {...props} />;
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;