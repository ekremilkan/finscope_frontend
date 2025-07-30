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
  // --- YENİ VE DAHA SAĞLAM STATE YAPISI ---
  // 'preparing': AsyncStorage'dan veriler okunuyor.
  // 'ready': Veriler okundu, WebView gösterilmeye hazır.
  // 'error': Veriler okunurken hata oluştu.
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

        // Token yoksa, devam etmenin bir anlamı yok. Bu kritik bir kontroldür.
        if (!userToken) {
          throw new Error("Oturum token'ı (userToken) bulunamadı. Lütfen tekrar giriş yapın.");
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
        
        const baseUrl = 'http://192.168.1.106:5173/wallet'; // Kendi IP adresiniz
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (lastAddress) params.append('lastActiveAddress', lastAddress);
        
        const finalUrl = `${baseUrl}?${params.toString()}`;
        
        console.log("[RN] WebView Hazır. URL:", finalUrl);
        console.log("[RN] Enjekte edilecek JS:", jsToInject);

        // Tüm veriler hazır olduğunda, state'i tek seferde güncelle.
        setViewData({
          url: finalUrl,
          injectedJS: jsToInject,
        });
        setStatus('ready');

      } catch (e) {
        console.error('WebView hazırlanırken hata oluştu:', e);
        Alert.alert("Oturum Hatası", e.message);
        setStatus('error');
      }
    };

    prepareWebView();
  }, []);

  // Geri tuşu ve WebView mesaj yönetimi (önceki gibi)
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
      // ...diğer mesaj tipleri...
    } catch (e) {
      console.error('WebView mesajı işlenirken hata:', e);
    }
  };
  
  const handleShouldStartLoadWithRequest = (request) => {
    const { url } = request;
    const walletSchemes = ['metamask://', 'trust://', 'wc:', 'walletconnect://'];
    if (walletSchemes.some(scheme => url.startsWith(scheme))) {
      Linking.openURL(url).catch(err => {
        Alert.alert('Uygulama Bulunamadı', 'İlgili cüzdan uygulamasının telefonunuzda kurulu olduğundan emin olun.');
      });
      return false;
    }
    return true;
  };

  // --- YENİ RENDER MANTIĞI ---
  if (status === 'preparing') {
    return <View style={styles.container}><ActivityIndicator size="large" color="#fff" /></View>;
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Cüzdan sayfası yüklenemedi.</Text>
        <Text style={styles.errorSubText}>Lütfen uygulamayı yeniden başlatın veya tekrar giriş yapın.</Text>
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