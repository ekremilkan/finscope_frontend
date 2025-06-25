import { Alert } from 'react-native';
import { storageService } from '../services/AsyncStorage';
import { authService } from '../services/authService';

export const handleCustomerLogout = async (navigation, setShowSettingsModal) => {
  console.log("Logout fonksiyonu tetiklendi");
  try {
    // Token ve userId'yi al
    const token = await storageService.getToken();
    const userId = await storageService.getItem('userId');

    console.log('Token:', token);
    console.log('UserId:', userId);

    if (token && userId) {
      try {
        // Backend'e logout isteği at
        await authService.logoutUser(userId, token);
        console.log('Backend logout başarılı');
      } catch (backendError) {
        console.log('Backend logout hatası:', backendError);
        // Backend hatası olsa bile devam et
      }
    }

    // AsyncStorage temizliği
    await storageService.multiRemove(['userToken', 'refreshToken', 'userId', 'userData']);
    
    // Global token'ı da temizle
    global.userToken = null;

    console.log('Storage temizlendi');

    // Modal'ı kapat
    setShowSettingsModal(false);

    // Login ekranına yönlendir
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    console.log('Login ekranına yönlendirildi');

  } catch (error) {
    console.log('Logout error:', error);
    
    // Hata olsa bile kullanıcıyı çıkart
    Alert.alert(
      'Uyarı',
      'Çıkış yapılırken bir hata oluştu, yine de çıkış yapılacak.',
      [
        {
          text: 'Tamam',
          onPress: async () => {
            try {
              await storageService.multiRemove(['userToken', 'refreshToken', 'userId', 'userData']);
              global.userToken = null;
              setShowSettingsModal(false);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (cleanupError) {
              console.error('Cleanup error:', cleanupError);
            }
          },
        },
      ]
    );
  }
};

export const confirmCustomerLogout = (navigation, setShowSettingsModal) => {
  Alert.alert(
    'Çıkış Yap',
    'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
    [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => handleCustomerLogout(navigation, setShowSettingsModal),
      },
    ]
  );
};

export const handleTabNavigation = (itemId, setActiveTab, navigation) => {
  setActiveTab(itemId);
  
  // Tab navigasyon işlemleri
  switch (itemId) {
    case 'campaigns':
      navigation.navigate('CustomerCampaignsScreen');
      break;
    case 'segments':
      // Gelecekte segmentler ekranı eklenebilir
      console.log('Segmentler ekranı henüz geliştirilmedi');
      break;
    case 'reports':
      // Gelecekte raporlar ekranı eklenebilir
      console.log('Raporlar ekranı henüz geliştirilmedi');
      break;
    case 'dashboard':
    default:
      // Dashboard'da kalmaya devam et
      break;
  }
}; 