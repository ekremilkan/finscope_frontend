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

// API servisimizden gerekli fonksiyonu import ediyoruz
import { refreshAuthToken } from '../../services/api'; 
// Sabitlerinizi import edin
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

const LAST_ACTIVE_WALLET_KEY = '@last_active_wallet';

const WalletScreen = ({ navigation }) => {
  const [status, setStatus] = useState('preparing');
  const [viewData, setViewData] = useState({ url: '', injectedJS: '' });
  const [webViewError, setWebViewError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const webViewRef = useRef(null);

  // Veri yükleme ve token yenileme mantığı
  const loadWebViewData = useCallback(async () => {
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!userToken || !refreshToken) {
        Alert.alert("Oturum Gerekli", "Bu sayfayı görüntülemek için lütfen giriş yapın.", [{ text: "Tamam", onPress: () => navigation.navigate('Login') }]);
        return;
      }

      const decodedToken = jwtDecode(userToken);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        console.log("[RN] Access token süresi dolmuş. Yenileniyor...");
        const result = await refreshAuthToken();
        if (result.success) {
          userToken = result.accessToken;
          console.log("[RN] Token başarıyla yenilendi.");
        } else {
          console.error("[RN] Token yenileme başarısız oldu:", result.error);
          Alert.alert("Oturum Süresi Doldu", "Güvenliğiniz için oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.", [{ text: "Tamam", onPress: () => navigation.navigate('Login') }], { cancelable: false });
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
      console.error('WebView hazırlama hatası:', e);
      Alert.alert("Beklenmedik Hata", e.message || "Bir sorun oluştu. Lütfen tekrar giriş yapın.", [{ text: "Tamam", onPress: () => navigation.navigate('Login') }]);
    }
  }, [navigation]);

  // İlk yükleme
  useEffect(() => {
    loadWebViewData();
  }, [loadWebViewData]);

  // Sayfayı aşağı çekerek yenileme fonksiyonu
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setWebViewError(null);
    await loadWebViewData();
    setRefreshing(false);
  }, [loadWebViewData]);

  // Geri tuşu yönetimi
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
        Alert.alert("Başarılı", "Yeni cüzdanınız hesabınıza eklendi.");
      }
    } catch (e) { console.error('WebView mesajı işlenirken hata:', e); }
  };

  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://','rainbow://', 'uniswap://','coinbase://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(() => Alert.alert('Uygulama Bulunamadı', 'İlgili cüzdan uygulamasının kurulu olduğundan emin olun.'));
      return false;
    }
    return true;
  };

  const handleWebViewError = (syntheticEvent) => { setWebViewError(syntheticEvent.nativeEvent); };
  const handleWebViewLoadEnd = () => { setWebViewError(null); };

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
                <Text style={styles.errorText}>Sayfa yüklenemedi</Text>
                <Text style={styles.errorSubText}>{webViewError.description}</Text>
                <Text style={styles.errorSubText}>Yenilemek için aşağı çekin</Text>
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