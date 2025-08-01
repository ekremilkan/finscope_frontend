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
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Sabitleriniz ---
const COLORS = {
  BACKGROUND: '#000000',
  PRIMARY: '#FFFFFF',
  ERROR: '#FF3B30',
  TEXT_SECONDARY: '#8E8E93',
};
const getCornerGradientColors = () => ['#1E1E1E', 'transparent'];
const LAST_ACTIVE_WALLET_KEY = '@last_active_wallet';
// --------------------

const WalletScreen = ({ navigation }) => {
  const [status, setStatus] = useState('preparing');
  const [viewUrl, setViewUrl] = useState('');
  const [webViewError, setWebViewError] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    const prepareWebView = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('userData');
        const lastAddress = await AsyncStorage.getItem(LAST_ACTIVE_WALLET_KEY);
        const email = userDataStr ? JSON.parse(userDataStr)?.email : null;

        const baseUrl = 'https://finscope.app/wallet';
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (lastAddress) params.append('lastActiveAddress', lastAddress);

        const finalUrl = `${baseUrl}?${params.toString()}`;
        console.log("[RN] WebView URL'i Hazır:", finalUrl);

        setViewUrl(finalUrl);
        setStatus('ready');
      } catch (e) {
        console.error('Error preparing WebView:', e);
        Alert.alert("Session Error", e.message || "An unknown error occurred.");
        setStatus('error');
      }
    };

    prepareWebView();
  }, []);

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
      console.log('[RN] WebView Mesajı Alındı:', data.type);

      if (data.type === 'REQUEST_AUTH_INFO') {
        const userToken = await AsyncStorage.getItem('userToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (userToken) {
          const payload = { userToken, refreshToken };
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'AUTH_INFO_RESPONSE',
            payload,
          }));
        }
      }

      if (data.type === 'WALLET_VERIFIED_AND_CONNECTED' && data.address) {
        await AsyncStorage.setItem(LAST_ACTIVE_WALLET_KEY, data.address);
        Alert.alert("Success", "Your new wallet has been added to your account.");
      }
      
    } catch (e) {
      console.error('Error processing WebView message:', e);
    }
  };
  
  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://','rainbow://', 'uniswap://','coinbase://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(err => {
        Alert.alert('App Not Found', 'Please make sure the relevant wallet app is installed on your phone.');
      });
      return false;
    }
    return true;
  };

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setWebViewError(nativeEvent);
  };
  
  const handleWebViewLoadEnd = (syntheticEvent) => {
    console.log('WebView loaded:', syntheticEvent.nativeEvent.url);
    if (!syntheticEvent.nativeEvent.loading) {
      setWebViewError(null);
    }
  };

  if (status === 'preparing') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
            <Text style={styles.errorText}>Wallet page could not be loaded.</Text>
            <Text style={styles.errorSubText}>Please restart the app or log in again.</Text>
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
          <LinearGradient colors={getCornerGradientColors()} style={styles.topRightGradient} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={getCornerGradientColors().reverse()} style={styles.bottomLeftGradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} />
          
          {webViewError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load wallet page</Text>
              <Text style={styles.errorSubText}>Error: {webViewError.description}</Text>
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              source={{ uri: viewUrl }}
              style={styles.webview}
              onMessage={handleWebViewMessage}
              onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
              onError={handleWebViewError}
              onLoadEnd={handleWebViewLoadEnd}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              renderLoading={() => <ActivityIndicator size="large" color={COLORS.PRIMARY} style={StyleSheet.absoluteFill} />}
              originWhitelist={['*']}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              mixedContentMode="compatibility"
              allowsBackForwardNavigationGestures={true}
            />
          )}
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 250,
    borderBottomLeftRadius: 125,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 250,
    height: 250,
    borderTopRightRadius: 125,
  },
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent'
  },
  errorText: {
    fontSize: 18,
    color: COLORS.ERROR,
    textAlign: 'center'
  },
  errorSubText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 10
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default WalletScreen;