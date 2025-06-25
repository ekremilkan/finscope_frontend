import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import AuthStack from './StackNavigation/AuthStack';
import OnboardingScreen from '../screens/OnboardingScreen'; 

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [initialScreen, setInitialScreen] = useState(null);

  useEffect(() => {
  const checkSession = async () => {
    await AsyncStorage.removeItem('onboardingSeen');//test için bu kod var silmeyi unutmayın !!!!!!!!!!!!!!
    try {
      const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
      const token = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!onboardingSeen) {
        setInitialScreen('Onboarding');
      } else if (token || refreshToken) {
        setInitialScreen('Home');
      } else {
        setInitialScreen('Login');
      }
    } catch (error) {
      setInitialScreen('Login');
    }
  };

  checkSession();
}, []);

  if (!initialScreen) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={initialScreen === 'Onboarding' ? 'Onboarding' : 'Auth'}
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
        cardStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Auth">
        {() => <AuthStack initialRoute={initialScreen === 'Home' ? 'Home' : 'Login'} />}
      </Stack.Screen>
    </Stack.Navigator>
  </NavigationContainer>
);
};

export default RootNavigator;
