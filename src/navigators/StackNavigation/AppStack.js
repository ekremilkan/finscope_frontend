import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from '../TabNavigation/BottomTabNavigator';

import QuizScreen from '../../screens/QuizScreen';
import CampaignDetailScreen from '../../screens/Campaign/CampaignDetailScreen';

// Wallet Screens
import AddWalletScreen from '../../screens/Wallet/AddWalletScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs"
        options={{
          gestureEnabled: false, // Disable gesture for main tabs
        }}
      >
        {() => <BottomTabNavigator />}
      </Stack.Screen>

      {/* Campaign Stack screens */}
      <Stack.Screen 
        name="QuizScreen" 
        component={QuizScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen 
        name="CampaignDetail" 
        component={CampaignDetailScreen}
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
      
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
