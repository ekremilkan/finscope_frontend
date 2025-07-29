import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, BackHandler, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_STORAGE_KEY = '@connected_wallets';
const MAX_WALLETS = 3;

const WalletScreen = ({ navigation }) => {
  const [connectedWallets, setConnectedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const savedWallets = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
        if (savedWallets) setConnectedWallets(JSON.parse(savedWallets));
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData?.email) setUserEmail(userData.email);
        }
      } catch (e) {
        console.error('Failed to load data from AsyncStorage:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current?.canGoBack) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, []);

  const handleNewWalletVerified = async (data) => {
    const newWalletInfo = {
      address: data.address,
      chainId: data.chainId,
      chainName: data.chainName || 'Unknown Network',
      isActive: true,
    };

    if (!newWalletInfo.address) return;

    if (connectedWallets.some(w => w.address.toLowerCase() === newWalletInfo.address.toLowerCase())) {
      Alert.alert('Wallet Already Connected', 'This wallet is already in your list.');
      return;
    }
    if (connectedWallets.length >= MAX_WALLETS) {
      Alert.alert('Max Wallets Reached', `You can connect up to ${MAX_WALLETS} wallets.`);
      return;
    }

    const updatedWallets = connectedWallets.map(w => ({ ...w, isActive: false }));
    const newList = [...updatedWallets, newWalletInfo];
    await handleWalletUpdate(newList);

    Alert.alert('Wallet Connected & Verified', `Address: ${shortAddress(newWalletInfo.address)}`);
    // İsteğe bağlı olarak ana ekrana geri dönebilir veya başka bir işlem yapabilirsiniz.
    // navigation.goBack(); 
  };
  
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Received message from WebView:', data.type);

      switch (data.type) {
        case 'WALLET_VERIFIED_AND_CONNECTED':
          handleNewWalletVerified(data);
          break;
        case 'WALLET_CONNECTION_FAILED':
          Alert.alert('Connection Failed', data.message || 'An unexpected error occurred.');
          break;
        default:
          console.log('Unknown message type received:', data.type);
      }
    } catch (e) {
      console.error('Error processing message from WebView:', e);
    }
  };

  const handleWalletUpdate = async (wallets) => {
    setConnectedWallets(wallets);
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    } catch (e) {
      console.error('Failed to save wallets to AsyncStorage:', e);
    }
  };

  const shortAddress = (address) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    console.log("WebView is trying to load URL:", url);
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
       console.log("Deep link detected! Opening with Linking.openURL...");
      Linking.openURL(url).catch(() => Alert.alert('Wallet App Not Found', 'Please ensure the selected wallet app is installed.'));
      return false;
    }
    return true;
  };

  if (isLoading) return <ActivityIndicator size="large" color="#fff" style={styles.safeArea} />;
  
  const baseUrl = 'http://192.168.1.106:5173/wallet'; // Bu IP'yi kendi IP'nizle değiştirin
  const webViewUrl = userEmail ? `${baseUrl}?email=${encodeURIComponent(userEmail)}` : baseUrl;

  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        onMessage={handleWebViewMessage}
        onError={(e) => Alert.alert('WebView Error', e.nativeEvent.description)}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator size="large" color="#fff" style={styles.safeArea} />}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  webview: { flex: 1, backgroundColor: '#0f172a' },
});

export default WalletScreen;