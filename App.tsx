import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigators/RootNavigator';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Async operations (data loading, token check, font loading, etc.)
        await new Promise(resolve => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);


  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#0a0f1c" 
        translucent={false}
      />
      <RootNavigator />
    </SafeAreaProvider>
  );
};


export default App;
