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

  // AsyncStorage'dan cüzdanları ve kullanıcı emailini yükle
  useEffect(() => {
    (async () => {
      try {
        // Walletları yükle
        const savedWallets = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
        if (savedWallets) setConnectedWallets(JSON.parse(savedWallets));

        // UserData'dan email çek
        const userDataStr = await AsyncStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          if (userData?.email) {
            setUserEmail(userData.email);
          }
        }
      } catch (e) {
        console.error('Failed to load wallets or user email:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Android geri tuşunu WebView history ile yönet
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, []);

  // WebView'ten mesajları işle
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message:', data.type);

      switch (data.type) {
        case 'WALLET_CONNECTED':
          handleWalletConnected(data.wallet);
          break;

        case 'WALLET_DISCONNECTED':
        case 'WALLET_REMOVED':
          handleWalletUpdate(data.allWallets || []);
          break;

        case 'WALLET_SWITCHED':
          handleWalletUpdate(data.allWallets || []);
          if (data.activeWallet) {
            Alert.alert(
              'Wallet Switched',
              `Active wallet: ${data.activeWallet.walletType}\nAddress: ${shortAddress(data.activeWallet.address)}`,
              [{ text: 'OK' }]
            );
          }
          break;

        case 'ADD_NEW_WALLET_REQUEST':
          handleAddNewWalletRequest(data.currentWallets, data.maxWallets);
          break;

        case 'MAX_WALLETS_REACHED':
          Alert.alert(
            'Max Wallets Reached',
            `You can only connect up to ${data.maxLimit} wallets.`,
            [{ text: 'OK' }]
          );
          break;

        case 'GET_CONNECTED_WALLETS':
          sendMessageToWebView({
            type: 'CONNECTED_WALLETS_DATA',
            wallets: connectedWallets,
            maxWallets: MAX_WALLETS,
          });
          break;

        case 'WALLET_CONNECTION_FAILED':
          Alert.alert('Connection Failed', data.message || 'An error occurred.');
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (e) {
      console.error('Invalid message from WebView:', e);
    }
  };

  // Cüzdanlar state ve AsyncStorage güncelle
  const handleWalletUpdate = async (wallets) => {
    setConnectedWallets(wallets);
    try {
      await AsyncStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallets));
    } catch (e) {
      console.error('Failed to save wallets:', e);
    }
  };

  // Yeni cüzdan eklenecek mi sorusu
  const handleAddNewWalletRequest = (currentWallets, maxWallets) => {
    if (currentWallets >= maxWallets) {
      Alert.alert(
        'Max Wallets Reached',
        `You can only connect up to ${maxWallets} wallets.`,
        [{ text: 'OK' }]
      );
      sendMessageToWebView({ type: 'ADD_WALLET_CANCELLED' });
      return;
    }

    Alert.alert(
      'Add New Wallet',
      `Add a new wallet? (${currentWallets}/${maxWallets})\nYou will need to sign a security message.`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => sendMessageToWebView({ type: 'ADD_WALLET_CANCELLED' }) },
        { text: 'Add Wallet', onPress: () => sendMessageToWebView({ type: 'PROCEED_ADD_WALLET', confirmed: true }) },
      ]
    );
  };

  // Yeni wallet connected mesajını işle
  const handleWalletConnected = async (wallet) => {
    if (!wallet || !wallet.address) return;

    // Aynı wallet bağlı mı kontrol
    if (connectedWallets.some(w => w.address.toLowerCase() === wallet.address.toLowerCase())) {
      Alert.alert('Wallet Already Connected', 'This wallet is already connected.');
      return;
    }

    if (connectedWallets.length >= MAX_WALLETS) {
      Alert.alert('Max Wallets Reached', `Max ${MAX_WALLETS} wallets allowed.`);
      return;
    }

    // Yeni wallet ekle ve diğerlerini pasif yap
    const updatedWallets = connectedWallets.map(w => ({ ...w, isActive: false }));
    const newWallet = { ...wallet, isActive: true };
    const newList = [...updatedWallets, newWallet];
    await handleWalletUpdate(newList);

    Alert.alert(
      'Wallet Connected',
      `${newWallet.walletType} connected to ${newWallet.chainName}\nAddress: ${shortAddress(newWallet.address)}\nTotal wallets: ${newList.length}/${MAX_WALLETS}`,
      [{ text: 'OK' }]
    );
  };

  // WebView'e mesaj gönder
  const sendMessageToWebView = (message) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(message));
    }
  };

  // Adresi kısa göster
  const shortAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // WebView'da wallet deep linklerini handle et
  const handleShouldStartLoadWithRequest = (request) => {
    const url = request.url;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://', 'coinbase://'];

    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(() => {
        Alert.alert(
          'Wallet Not Found',
          'The wallet app could not be opened. Please make sure it is installed.',
          [{ text: 'OK' }]
        );
      });
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  // userEmail varsa query param olarak ekle
  const baseUrl = 'http://192.168.1.106:5173/wallet';
  const webViewUrl = userEmail ? `${baseUrl}?email=${encodeURIComponent(userEmail)}` : baseUrl;
console.log("Loading WebView with:", webViewUrl);
  return (
    <SafeAreaView style={styles.safeArea}>
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        onMessage={handleWebViewMessage}
        onError={(error) => {
          Alert.alert('WebView Error', 'Failed to load wallet interface. Please try again.');
          console.error('WebView error:', error.nativeEvent);
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        startInLoadingState={isLoading}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

export default WalletScreen;
