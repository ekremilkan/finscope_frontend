import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Alert,
  BackHandler,
  Linking,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ACTIVE_WALLET_KEY = '@last_active_wallet';

const WalletScreen = ({ navigation }) => {
  // --- NEW AND MORE ROBUST STATE STRUCTURE ---
  // 'preparing': Reading data from AsyncStorage.
  // 'ready': Data read, WebView ready to display.
  // 'error': Error occurred while reading data.
  const [status, setStatus] = useState('preparing');
  const [viewData, setViewData] = useState({
    url: '',
    injectedJS: '',
  });
  const webViewRef = useRef(null);

  useEffect(() => {
    const prepareWebView = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        const userToken = await AsyncStorage.getItem('userToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const lastAddress = await AsyncStorage.getItem(LAST_ACTIVE_WALLET_KEY);

        // If no token, there's no point in continuing. This is a critical check.
        if (!userToken) {
          throw new Error("Session token (userToken) not found. Please log in again.");
        }
        
        let email = null;
        if (userDataStr) {
          email = JSON.parse(userDataStr)?.email;
        }

        let jsToInject = '';
        jsToInject += `localStorage.setItem('userToken', '${userToken}');`;
        if (refreshToken) {
          jsToInject += `localStorage.setItem('refreshToken', '${refreshToken}');`;
        }
        jsToInject += 'true;';
        
        const baseUrl = 'http://192.168.1.21:5173/wallet'; // Your IP address
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (lastAddress) params.append('lastActiveAddress', lastAddress);
        
        const finalUrl = `${baseUrl}?${params.toString()}`;
        
        console.log("[RN] WebView Ready. URL:", finalUrl);
        console.log("[RN] JS to inject:", jsToInject);

        // When all data is ready, update state in one go.
        setViewData({
          url: finalUrl,
          injectedJS: jsToInject,
        });
        setStatus('ready');

      } catch (e) {
        console.error('Error preparing WebView:', e);
        Alert.alert("Session Error", e.message);
        setStatus('error');
      }
    };

    prepareWebView();
  }, []);

  // Back button and WebView message management (same as before)
  useEffect(() => {
    const backAction = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleWebViewMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'WALLET_VERIFIED_AND_CONNECTED' && data.address) {
        await AsyncStorage.setItem(LAST_ACTIVE_WALLET_KEY, data.address);
        Alert.alert("Success", "Your new wallet has been added to your account.");
      }
      // ...other message types...
    } catch (e) {
      console.error('Error processing WebView message:', e);
    }
  };
  
  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(err => {
        Alert.alert('App Not Found', 'Please make sure the relevant wallet app is installed on your phone.');
      });
      return false;
    }
    return true;
  };

  // --- NEW RENDER LOGIC ---
  if (status === 'preparing') {
    return <View style={styles.container}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Wallet page could not be loaded.</Text>
        <Text style={styles.errorSubText}>Please restart the app or log in again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
        <WebView
          ref={webViewRef}
          source={{ uri: viewData.url }}
          style={styles.webview}
          injectedJavaScript={viewData.injectedJS}
          onMessage={handleWebViewMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#fff" style={StyleSheet.absoluteFill} />}
          originWhitelist={['*']}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  webview: { flex: 1, backgroundColor: '#0f172a' },
  errorText: { fontSize: 18, color: '#f87171', textAlign: 'center' },
  errorSubText: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginTop: 10 },
});

export default WalletScreen;