# 🔄 **Refresh Token Integration Guide**

## 📱 **Yeni Token Yenileme Sistemi - Frontend Entegrasyonu**

### 🆕 **API Endpoint:**
```
POST /api/v1/user/refresh-token
```

### ✅ **Tamamlanan Entegrasyonlar:**

#### **1. 🔧 api.js - Otomatik Token Yenileme**
```javascript
// ✅ 401 durumunda otomatik token yenileme
// ✅ Token rotation (her refresh'te yeni token'lar)
// ✅ AsyncStorage güncellemesi
// ✅ Original request'i yeni token ile tekrar deneme
```

#### **2. 🔧 authService.js - Manual İşlemler**
```javascript
// ✅ Manual token refresh
// ✅ Auth durumu kontrolü
// ✅ Güvenli logout
// ✅ Authenticated API calls
```

### 🚀 **Kullanım Örnekleri:**

#### **🔄 Otomatik Token Yenileme (Varsayılan)**
```javascript
import api from '../services/api';

// Hiçbir şey yapmanız gerekmez!
// 401 durumunda otomatik olarak token yenilenir
const response = await api.get('/wallets');
```

#### **🔄 Manual Token Yenileme**
```javascript
import { authService } from '../services/authService';

const refreshTokens = async () => {
  const result = await authService.refreshToken();
  
  if (result.success) {
    console.log('Token yenilendi:', result.accessToken);
  } else {
    console.log('Token yenileme başarısız:', result.error);
  }
};
```

#### **🔐 Auth Durumu Kontrolü**
```javascript
import { authService } from '../services/authService';

const checkUserAuth = async () => {
  const isAuth = await authService.checkAuth();
  
  if (isAuth) {
    console.log('Kullanıcı authenticated');
  } else {
    console.log('Kullanıcı not authenticated');
  }
};
```

#### **🚪 Güvenli Logout**
```javascript
import { authService } from '../services/authService';

const handleLogout = async () => {
  const success = await authService.secureLogout();
  
  if (success) {
    // Kullanıcıyı login sayfasına yönlendir
    navigation.navigate('Login');
  }
};
```

#### **📞 Güvenli API Çağrıları**
```javascript
import { authService } from '../services/authService';

// Yöntem 1: authService.makeAuthenticatedCall (Önerilen)
const getUserData = async () => {
  try {
    const userData = await authService.makeAuthenticatedCall('/user/profile');
    console.log('User data:', userData);
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Yöntem 2: Doğrudan api kullanımı (Otomatik refresh çalışır)
import api from '../services/api';

const getWallets = async () => {
  try {
    const response = await api.get('/wallets');
    console.log('Wallets:', response.data);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### 🔧 **Nasıl Çalışır:**

#### **🔄 Token Yenileme Akışı:**
```
1. API çağrısı yapılır
2. Server 401 döner (token expired)
3. Interceptor devreye girer
4. Refresh token ile yeni token'lar alınır
5. YENİ token'lar AsyncStorage'a kaydedilir
6. Original request yeni token ile tekrar denenir
7. Başarılı response döner
```

#### **💾 Token Storage:**
```javascript
// AsyncStorage keys
'userToken'    // Access Token (1 saat geçerli)
'refreshToken' // Refresh Token (30 gün geçerli)
```

### 🛡️ **Güvenlik Özellikleri:**

- **✅ Token Rotation**: Her refresh'te yeni token'lar
- **✅ Automatic Renewal**: Kullanıcı hiçbir şey fark etmez
- **✅ Secure Storage**: AsyncStorage'da güvenli saklama
- **✅ Error Handling**: Hata durumlarında güvenli fallback
- **✅ Logout Protection**: Refresh başarısızsa otomatik logout

### 🚨 **Önemli Notlar:**

#### **❌ Yapılmaması Gerekenler:**
```javascript
// ❌ Manuel token header'ı eklemeyin (interceptor yapıyor)
headers: {
  'Authorization': `Bearer ${token}` // YAPMAYIN!
}

// ❌ 401 error'ları manuel handle etmeyin
.catch(error => {
  if (error.status === 401) {
    // YAPMAYIN! Interceptor hallediyor
  }
})
```

#### **✅ Yapılması Gerekenler:**
```javascript
// ✅ Sadece api import edin ve kullanın
import api from '../services/api';
const response = await api.get('/endpoint');

// ✅ Error handling için try-catch kullanın
try {
  const response = await api.get('/endpoint');
} catch (error) {
  console.error('API Error:', error);
}
```

### 🧪 **Test Senaryoları:**

#### **Test 1: Otomatik Token Yenileme**
```javascript
// Token'ın expired olduğu durumu test et
// 401 dönmeli ve otomatik yenilenmeli
const testAutoRefresh = async () => {
  try {
    const response = await api.get('/user/profile');
    console.log('✅ Auto refresh çalışıyor');
  } catch (error) {
    console.error('❌ Auto refresh başarısız');
  }
};
```

#### **Test 2: Refresh Token Expired**
```javascript
// Refresh token'ın da expired olduğu durum
// Kullanıcı login'e yönlendirilmeli
const testRefreshExpired = async () => {
  // Refresh token'ı silin veya geçersiz yapın
  // API çağrısı yapın, logout olmalı
};
```

### 📊 **Debugging:**

```javascript
// Console'da göreceğiniz log'lar:
// 🔄 Attempting token refresh...
// ✅ Token refresh successful
// ❌ Refresh token expired, logging out user

// Token durumunu kontrol etmek için:
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkTokens = async () => {
  const accessToken = await AsyncStorage.getItem('userToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  console.log('Access Token:', accessToken ? 'EXISTS' : 'NULL');
  console.log('Refresh Token:', refreshToken ? 'EXISTS' : 'NULL');
};
```

### 🎯 **Sonuç:**

Artık kullanıcılar **30 gün boyunca** otomatik olarak giriş yapabilecek!
- Access token her saat yenilenir
- Kullanıcı hiçbir şey fark etmez
- Güvenlik maximum seviyede
- Developer experience mükemmel! 🚀

---

**📞 İletişim:** Sorularınız için bu dosyayı güncelleyebilir veya development team'e ulaşabilirsiniz. 