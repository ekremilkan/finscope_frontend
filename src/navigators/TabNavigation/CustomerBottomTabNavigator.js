import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CUSTOMER_BOTTOM_NAV_ITEMS } from '../../data/customerDashboardData';

import CustomerDashboard from '../../screens/Home/CustomerDashboard';
import SegmentsScreen from '../../screens/Segments/SegmentsScreen';
import ReportsScreen from '../../screens/Reports/ReportsScreen';
import CustomerCampaignsScreen from '../../screens/CustomerCampaignsScreen';

const Tab = createBottomTabNavigator();

const SCREEN_COMPONENTS = {
  dashboard: CustomerDashboard,
  campaigns: CustomerCampaignsScreen,
  segments: SegmentsScreen,
  reports: ReportsScreen,
};

const CustomerBottomTabNavigator = ({ onSwitchPress }) => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const item = CUSTOMER_BOTTOM_NAV_ITEMS.find(i => i.title === route.name);
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
      {CUSTOMER_BOTTOM_NAV_ITEMS.map(item => (
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

export default CustomerBottomTabNavigator;