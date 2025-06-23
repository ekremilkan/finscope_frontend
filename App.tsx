import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import RootNavigator from './src/navigators/RootNavigator';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Async işlemler (veri yükleme, token kontrol, font yükleme vb.)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#6854dd" />
      </View>
    );
  }

  return <RootNavigator />;
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;