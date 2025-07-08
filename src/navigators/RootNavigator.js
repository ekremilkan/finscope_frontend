import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import EmailVerificationScreen from '../screens/EmailVerification/EmailVerificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthStack from './StackNavigation/AuthStack';
import AppStack from './StackNavigation/AppStack';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [initialScreen, setInitialScreen] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
        const token = await AsyncStorage.getItem('userToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        const isAuthenticated = !!(token || refreshToken);

        if (!onboardingSeen) {
          setInitialScreen('Onboarding');
        } else if (isAuthenticated) {
          setInitialScreen('App');  
        } else {
          setInitialScreen('Auth');
        }
      } catch (e) {
        setInitialScreen('Auth');
      }
    };

    checkSession();
  }, []);

  if (!initialScreen) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f172a',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialScreen}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="App" component={AppStack} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
