import React, { useState } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from '../TabNavigation/BottomTabNavigator';
import CustomerBottomTabNavigator from '../TabNavigation/CustomerBottomTabNavigator';

import QuizScreen from '../../screens/QuizScreen';
import CustomerCampaignsScreen from '../../screens/CustomerCampaignsScreen';

// Wallet Screens
import AddWalletScreen from '../../screens/Wallet/AddWalletScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  const [isCustomer, setIsCustomer] = useState(false);

  const handleSwitchRole = () => {
    setIsCustomer((prev) => !prev);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {() =>
          isCustomer ? (
            <CustomerBottomTabNavigator onSwitchPress={handleSwitchRole} />
          ) : (
            <BottomTabNavigator onSwitchPress={handleSwitchRole} />
          )
        }
      </Stack.Screen>

      {/* Existing Stack screens */}
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="CustomerCampaignsScreen" component={CustomerCampaignsScreen} />
      
      {/* Wallet Stack screens */}
      <Stack.Screen 
        name="AddWalletScreen" 
        component={AddWalletScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
