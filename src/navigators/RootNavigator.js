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

        console.log('🔍 Auth Debug - Onboarding:', onboardingSeen);
        console.log('🔍 Auth Debug - Token:', token ? 'EXISTS' : 'NULL');
        console.log('🔍 Auth Debug - RefreshToken:', refreshToken ? 'EXISTS' : 'NULL');

        const isAuthenticated = !!(token || refreshToken);
        console.log('🔍 Auth Debug - isAuthenticated:', isAuthenticated);

        if (!onboardingSeen) {
          console.log('🔍 Auth Debug - Redirecting to: Onboarding');
          setInitialScreen('Onboarding');
        } else if (isAuthenticated) {
          console.log('🔍 Auth Debug - Redirecting to: App');
          setInitialScreen('App');  
        } else {
          console.log('🔍 Auth Debug - Redirecting to: Auth');
          setInitialScreen('Auth');
        }
      } catch (e) {
        console.log('🔍 Auth Debug - Error:', e);
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
