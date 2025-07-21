import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const WalletScreen = () => {
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'WALLET_CONNECTED') {
        const { address, chainId } = data;

        console.log('Wallet connected ✅');
        console.log('Address:', address);
        console.log('Chain ID:', chainId);

        Alert.alert('Wallet Connected', `Address: ${address}\nChain ID: ${chainId}`);
      }
    } catch (error) {
      console.error('Failed to parse message from WebView:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        source={{ uri: 'http://10.0.2.2:5173' }}
        // ios için: source={{ uri: 'http://localhost:5173' }}
        originWhitelist={['*']}
        onMessage={handleWebViewMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
  },
});
