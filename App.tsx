import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigators/RootNavigator';
import { COLORS } from './src/constants/colorConstants';

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Gerekli async işlemler burada yapılabilir
        // Örneğin: font yükleme, config yükleme, vs.
        // Şimdilik hiç bekleme yok - hemen hazır
        setIsAppReady(true);
      } catch (e) {
        console.warn('App preparation error:', e);
        setIsAppReady(true); // Hata durumunda da hazır ol
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.BACKGROUND} 
        translucent={false}
      />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default App;
