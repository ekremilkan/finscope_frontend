import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import api, { isAuthenticated } from '../services/api';
import { COLORS } from '../constants/colorConstants';

import EmailVerificationScreen from '../screens/EmailVerification/EmailVerificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthStack from './StackNavigation/AuthStack';
import AppStack from './StackNavigation/AppStack';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [initialScreen, setInitialScreen] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);

  const checkBackendHealth = async () => {
    try {
      await api.get('/health'); // Authorization header eklenmiyor, timeout ayarlı
      setBackendOnline(true);
    } catch (e) {
      console.log('❌ Backend offline:', e.message);
      setBackendOnline(false);
    }
  };

  const checkSession = async () => {
    try {
      const onboardingSeen = await AsyncStorage.getItem('onboardingSeen');
      const authenticated = await isAuthenticated();

      if (!onboardingSeen) {
        setInitialScreen('Onboarding');
      } else if (authenticated) {
        setInitialScreen('App');
      } else {
        setInitialScreen('Auth');
      }
    } catch (e) {
      console.log('Auth check error:', e.message);
      setInitialScreen('Auth');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  useEffect(() => {
    if (backendOnline === true) {
      checkSession();
      SplashScreen.hide(); // Backend canlıysa splash kapat
    }
  }, [backendOnline]);

  if (backendOnline === null) {
    // Splash açık kalır
    return null;
  }

  if (backendOnline === false) {
  // Backend is offline, show error to user
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Server is offline 🚫</Text>
      <Text style={styles.subText}>Please check your internet connection.</Text>
      <TouchableOpacity onPress={checkBackendHealth} style={styles.retryButton}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

  if (!initialScreen) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    marginBottom: 10,
  },
  subText: {
    color: COLORS.TEXT_SECONDARY,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigator;
