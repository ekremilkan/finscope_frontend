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

// Constants
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

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
  const [webViewError, setWebViewError] = useState(null);
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
        
        const baseUrl = 'https://finscope.app/wallet'; // Your IP address
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
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://','rainbow://', 
  'uniswap://','coinbase://'];
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
    const { nativeEvent } = syntheticEvent;
    console.log('WebView loaded:', nativeEvent.url);
    setWebViewError(null);
  };

  // --- NEW RENDER LOGIC ---
  if (status === 'preparing') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
          >
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
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
          >
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
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          {/* Corner Gradients - Daha yumuşak */}
          <LinearGradient
            colors={getCornerGradientColors()}
            style={styles.topRightGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <LinearGradient
            colors={getCornerGradientColors().reverse()}
            style={styles.bottomLeftGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          />
          
          {webViewError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load wallet page</Text>
              <Text style={styles.errorSubText}>Error: {webViewError.description}</Text>
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              source={{ uri: viewData.url }}
              style={styles.webview}
              injectedJavaScript={viewData.injectedJS}
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
              incognito={false}
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
    backgroundColor: COLORS.BACKGROUND, // Main background for the whole screen
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND // SafeArea background
  },
  gradientContainer: { // New style
    flex: 1,
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
    backgroundColor: COLORS.BACKGROUND
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