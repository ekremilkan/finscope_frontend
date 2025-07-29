# React Native Mobil Uygulama Güncelleme Rehberi
## MetaMask WebView Entegrasyonu

### 📋 **Genel Bakış**
Bu doküman, React Native uygulamanızda MetaMask WebView entegrasyonu için yapılması gereken değişiklikleri içerir. WebView içinde MetaMask pop-up'larının düzgün çalışması ve uygulamaya geri dönüldüğünde bağlantı durumunun korunması için gerekli güncellemeler.

---

## 🎯 **Hedef**
- MetaMask pop-up'larının WebView içinde çalışması
- Uygulamaya geri dönüldüğünde bağlantı durumunun korunması
- App state değişikliklerinde WebView'in düzgün çalışması
- Debug ve test özelliklerinin eklenmesi

---

## 📦 **Gerekli Paketler**

### Mevcut paketlerinizi kontrol edin:
```bash
npm install react-native-webview
npm install @react-native-async-storage/async-storage
```

### package.json'da olması gerekenler:
```json
{
  "dependencies": {
    "react-native-webview": "^13.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0"
  }
}
```

---

## 🔧 **Yapılacak Değişiklikler**

### **1. Import'ları Güncelleyin**

```javascript
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, AppState, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### **2. State Management Ekleyin**

```javascript
const [webViewMessages, setWebViewMessages] = useState([]);
const [isConnected, setIsConnected] = useState(false);
const [walletAddress, setWalletAddress] = useState('');
const [appState, setAppState] = useState(AppState.currentState);
const webViewRef = useRef(null);
```

### **3. App State Management Ekleyin**

```javascript
// App state değişikliklerini dinle
useEffect(() => {
  const handleAppStateChange = (nextAppState) => {
    console.log('App state changed:', appState, '->', nextAppState);
    
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // Uygulama aktif olduğunda WebView'i kontrol et
      console.log('App has come to the foreground!');
      
      // WebView'e app state değişikliği mesajı gönder
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'APP_STATE_CHANGED',
          state: 'active',
          timestamp: Date.now(),
        }));
      }
    }
    setAppState(nextAppState);
  };

  const subscription = AppState.addEventListener('change', handleAppStateChange);
  return () => subscription?.remove();
}, [appState]);
```

### **4. WebView Mesaj Handler'ını Güncelleyin**

```javascript
const handleWebViewMessage = (event) => {
  try {
    const message = JSON.parse(event.nativeEvent.data);
    console.log('WebView Message:', message);
    
    setWebViewMessages(prev => [...prev, message]);

    // Mesaj tipine göre işlem yap
    switch (message.type) {
      case 'WEBVIEW_DETECTED':
        console.log('WebView detected, User Agent:', message.userAgent);
        break;
        
      case 'WEBVIEW_VISIBLE':
        console.log('WebView became visible');
        break;
        
      case 'CONNECTION_STARTED':
        console.log('Wallet connection started');
        break;
        
      case 'MODAL_OPENED':
        console.log('Web3Modal opened');
        break;
        
      case 'METAMASK_WEBVIEW_TEST_START':
        console.log('MetaMask WebView test started');
        break;
        
      case 'METAMASK_WEBVIEW_SUCCESS':
        console.log('MetaMask WebView success:', message.accounts);
        setIsConnected(true);
        if (message.accounts && message.accounts.length > 0) {
          setWalletAddress(message.accounts[0]);
        }
        
        // Başarılı bağlantı sonrası WebView'i yenile
        setTimeout(() => {
          if (webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({
              type: 'REFRESH_AFTER_CONNECTION',
              timestamp: Date.now(),
            }));
          }
        }, 2000);
        break;
        
      case 'METAMASK_WEBVIEW_ERROR':
        console.log('MetaMask WebView error:', message.error);
        Alert.alert('MetaMask Error', message.error);
        break;
        
      case 'WALLET_CONNECTED':
        console.log('Wallet connected:', message.address);
        setIsConnected(true);
        setWalletAddress(message.address);
        break;
        
      case 'WALLET_DISCONNECTED':
        console.log('Wallet disconnected');
        setIsConnected(false);
        setWalletAddress('');
        break;
        
      case 'CONNECTION_ERROR':
        console.log('Connection error:', message.error);
        Alert.alert('Connection Error', message.error);
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error parsing WebView message:', error);
  }
};
```

### **5. WebView Konfigürasyonunu Güncelleyin**

```javascript
<WebView
  ref={webViewRef}
  source={{ uri: 'http://192.168.1.21:5173/wallet' }}
  onMessage={handleWebViewMessage}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  scalesPageToFit={true}
  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}
  // Pop-up'lar için gerekli
  allowsLinkPreview={true}
  allowsBackForwardNavigationGestures={true}
  // WebView lifecycle için
  onLoadStart={() => console.log('WebView loading started')}
  onLoadEnd={() => console.log('WebView loading ended')}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
  }}
  // MetaMask pop-up'ları için
  allowsInlineMediaPlayback={true}
  mediaPlaybackRequiresUserAction={false}
  // Pop-up'ları etkinleştir
  allowsLinkPreview={true}
  allowsBackForwardNavigationGestures={true}
  // JavaScript injection
  injectedJavaScript={`
    // WebView'e özel JavaScript
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'WEBVIEW_READY',
      timestamp: Date.now(),
    }));
    true;
  `}
  style={{ flex: 1 }}
/>
```

### **6. Debug Panel Ekleyin**

```javascript
// WebView'i yeniden yükle
const reloadWebView = () => {
  if (webViewRef.current) {
    webViewRef.current.reload();
  }
};

// Debug panel component'i
const DebugPanel = () => (
  <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>WebView Debug Panel</Text>
    <Text>Connected: {isConnected ? '✅ Yes' : '❌ No'}</Text>
    <Text>App State: {appState}</Text>
    <Text>Wallet: {walletAddress ? walletAddress.substring(0, 10) + '...' : 'Not connected'}</Text>
    <Text>Messages: {webViewMessages.length}</Text>
    
    {/* Reload butonu */}
    <Text 
      style={{ 
        color: '#007AFF', 
        marginTop: 5, 
        textDecorationLine: 'underline' 
      }}
      onPress={reloadWebView}
    >
      🔄 Reload WebView
    </Text>
    
    {/* Son 3 mesajı göster */}
    {webViewMessages.slice(-3).map((msg, index) => (
      <Text key={index} style={{ fontSize: 10, marginTop: 2 }}>
        {msg.type}: {JSON.stringify(msg).substring(0, 50)}...
      </Text>
    ))}
  </View>
);
```

### **7. Ana Component'i Güncelleyin**

```javascript
const WebViewTest = () => {
  // ... state ve useEffect'ler yukarıda

  return (
    <View style={{ flex: 1 }}>
      {/* Debug Panel */}
      <DebugPanel />

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: 'http://192.168.1.21:5173/wallet' }}
        onMessage={handleWebViewMessage}
        // ... diğer props yukarıda
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default WebViewTest;
```

---

## 🧪 **Test Adımları**

### **1. Temel Test**
1. Uygulamayı başlatın
2. Debug panelini kontrol edin
3. WebView'in yüklendiğini doğrulayın
4. "Test MetaMask Direct Connection" butonuna tıklayın

### **2. MetaMask Test**
1. MetaMask uygulamasına gidin
2. Bağlantı isteğini onaylayın
3. React Native uygulamasına geri dönün
4. Bağlantı durumunun korunup korunmadığını kontrol edin

### **3. App State Test**
1. Uygulamayı arka plana alın (home tuşu)
2. Tekrar uygulamaya dönün
3. WebView'in düzgün çalıştığını kontrol edin

### **4. Debug Test**
1. Console'da mesajları takip edin
2. Debug panelindeki bilgileri kontrol edin
3. Reload butonunu test edin

---

## 📊 **Beklenen Sonuçlar**

### **✅ Başarılı Senaryo:**
```
WebView Message: { type: "WEBVIEW_DETECTED", userAgent: "...", timestamp: ... }
WebView Message: { type: "METAMASK_WEBVIEW_TEST_START", timestamp: ... }
WebView Message: { type: "METAMASK_WEBVIEW_SUCCESS", accounts: [...], timestamp: ... }
WebView Message: { type: "WEBVIEW_VISIBLE", timestamp: ... }
```

### **🔄 App State Değişikliği:**
```
App state changed: background -> active
WebView Message: { type: "WEBVIEW_VISIBLE", timestamp: ... }
```

---

## 🚨 **Olası Sorunlar ve Çözümler**

### **1. WebView Yüklenmiyor**
- **Sorun**: WebView boş görünüyor
- **Çözüm**: `javaScriptEnabled={true}` ve `domStorageEnabled={true}` kontrol edin

### **2. MetaMask Pop-up Açılmıyor**
- **Sorun**: MetaMask pop-up'ı görünmüyor
- **Çözüm**: `allowsLinkPreview={true}` ve `allowsBackForwardNavigationGestures={true}` ekleyin

### **3. Mesajlar Gelmiyor**
- **Sorun**: WebView'den mesaj gelmiyor
- **Çözüm**: `onMessage` handler'ını kontrol edin ve console'da hata var mı bakın

### **4. Bağlantı Korunmuyor**
- **Sorun**: Uygulamaya geri dönüldüğünde bağlantı kesiliyor
- **Çözüm**: App state management'ı kontrol edin

---

## 📝 **Kontrol Listesi**

- [ ] Import'ları güncellediniz mi?
- [ ] State management eklediniz mi?
- [ ] App state management eklediniz mi?
- [ ] WebView mesaj handler'ını güncellediniz mi?
- [ ] WebView konfigürasyonunu güncellediniz mi?
- [ ] Debug paneli eklediniz mi?
- [ ] Test ettiniz mi?
- [ ] Console'da hata var mı kontrol ettiniz mi?

---

## 📞 **Destek**

Eğer sorun yaşarsanız:
1. Console çıktılarını paylaşın
2. Debug panelindeki bilgileri paylaşın
3. Hangi adımda takıldığınızı belirtin
4. App state değişikliklerini test edin

---

## 🎯 **Sonuç**

Bu güncellemeler sayesinde:
- ✅ MetaMask pop-up'ları WebView içinde çalışacak
- ✅ Uygulamaya geri dönüldüğünde bağlantı korunacak
- ✅ App state değişikliklerinde WebView düzgün çalışacak
- ✅ Debug ve test özellikleri eklenmiş olacak

**Not**: Bu değişiklikleri yaptıktan sonra uygulamayı yeniden başlatmanız gerekebilir. 