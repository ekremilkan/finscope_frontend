import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './StackNavigation/AuthStack';


const Stack = createStackNavigator();

const RootNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    // Check if it's the first launch
    // For demo purposes, we'll set it to false after 3s
    const timer = setTimeout(() => {
      setIsFirstLaunch(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

 return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          // <Stack.Screen name="OnBoard" component={OnBoardScreen} />
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthStack} />
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;