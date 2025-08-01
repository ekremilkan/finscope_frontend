import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Alert,
  BackHandler,
  Linking,
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import { refreshAuthToken } from '../../services/api';
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

const LAST_ACTIVE_WALLET_KEY = '@last_active_wallet';

const WalletScreen = ({ navigation }) => {
  const [status, setStatus] = useState('preparing');
  const [viewData, setViewData] = useState({ url: '', injectedJS: '' });
  const [webViewError, setWebViewError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef(null);

  // Data loading and token refresh logic
  const loadWebViewData = useCallback(async () => {
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!userToken || !refreshToken) {
        Alert.alert("Login Required", "Please log in to view this page.", [{ text: "OK", onPress: () => navigation.navigate('Login') }]);
        return;
      }

      const decodedToken = jwtDecode(userToken);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("[RN] Access token has expired. Refreshing...");
        const result = await refreshAuthToken();
        if (result.success) {
          userToken = result.accessToken;
          console.log("[RN] Token successfully refreshed.");
        } else {
          console.error("[RN] Token refresh failed:", result.error);
          Alert.alert("Session Expired", "For your security, your session has been terminated. Please log in again.", [{ text: "OK", onPress: () => navigation.navigate('Login') }], { cancelable: false });
          return;
        }
      }

      const userDataStr = await AsyncStorage.getItem('userData');
      const lastAddress = await AsyncStorage.getItem(LAST_ACTIVE_WALLET_KEY);
      let email = userDataStr ? JSON.parse(userDataStr)?.email : null;
      const currentRefreshToken = await AsyncStorage.getItem('refreshToken');

      let jsToInject = `
        localStorage.setItem('userToken', '${userToken}');
        localStorage.setItem('refreshToken', '${currentRefreshToken}');
        true;
      `;

      const baseUrl = 'https://finscope.app/wallet';
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (lastAddress) params.append('lastActiveAddress', lastAddress);
      const finalUrl = `${baseUrl}?${params.toString()}`;

      setViewData({ url: finalUrl, injectedJS: jsToInject });
      setStatus('ready');
    } catch (e) {
      console.error('Error preparing WebView:', e);
      Alert.alert("Unexpected Error", e.message || "Something went wrong. Please log in again.", [{ text: "OK", onPress: () => navigation.navigate('Login') }]);
    }
  }, [navigation]);

  // Initial load
  useEffect(() => {
    loadWebViewData();
  }, [loadWebViewData]);

  // Pull-to-refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setWebViewError(null);
    await loadWebViewData();
    setRefreshing(false);
  }, [loadWebViewData]);

  // Back button handling
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
        Alert.alert("Success", "Your new wallet has been linked to your account.");
      }
    } catch (e) {
      console.error('Error handling WebView message:', e);
    }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://', 'rainbow://', 'uniswap://', 'coinbase://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(() =>
        Alert.alert('App Not Found', 'Please make sure the corresponding wallet app is installed.')
      );
      return false;
    }
    return true;
  };

  const handleWebViewError = (syntheticEvent) => {
    setWebViewError(syntheticEvent.nativeEvent);
  };

  const handleWebViewLoadEnd = () => {
    setWebViewError(null);
  };

  if (status === 'preparing' && !refreshing) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
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
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.PRIMARY} colors={[COLORS.PRIMARY]} />
            }
          >
            {webViewError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Page could not be loaded</Text>
                <Text style={styles.errorSubText}>{webViewError.description}</Text>
                <Text style={styles.errorSubText}>Pull down to refresh</Text>
              </View>
            ) : (
              <WebView
                ref={webViewRef}
                source={{ uri: viewData.url }}
                style={styles.webview}
                injectedJavaScriptBeforeContentLoaded={viewData.injectedJS}
                onMessage={handleWebViewMessage}
                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                onError={handleWebViewError}
                onLoadEnd={handleWebViewLoadEnd}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => <ActivityIndicator size="large" color={COLORS.PRIMARY} style={StyleSheet.absoluteFill} />}
                originWhitelist={['*']}
              />
            )}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  gradientContainer: { flex: 1, justifyContent: 'center' },
  scrollContent: { flex: 1 },
  topRightGradient: { position: 'absolute', top: 0, right: 0, width: 250, height: 250, borderBottomLeftRadius: 125 },
  bottomLeftGradient: { position: 'absolute', bottom: 0, left: 0, width: 250, height: 250, borderTopRightRadius: 125 },
  webview: { flex: 1, backgroundColor: 'transparent' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 18, color: COLORS.ERROR, textAlign: 'center' },
  errorSubText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, textAlign: 'center', marginTop: 10 },
});

export default WalletScreen;
