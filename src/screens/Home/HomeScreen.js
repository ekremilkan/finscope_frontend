import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { authService } from '../../services/authService';
import { storageService } from '../../services/AsyncStorage';

const HomeScreen = ({ navigation }) => {

  const handleLogout = async () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Home!</Text>
        <Text style={styles.subtitle}>You have successfully logged in</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',  // Splash ile uyumlu siyah arka plan
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',  // Beyaz yazı
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#bbbbbb',  // Açık gri, koyu arka plana uyumlu
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#4a90e2',  // Mavi vurgu buton rengi
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  logoutButtonText: {
    color: '#ffffff',  // Beyaz yazı
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default HomeScreen;