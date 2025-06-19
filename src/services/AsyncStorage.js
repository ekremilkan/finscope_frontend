import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  // Token kaydet
  saveToken: async token => {
  try {
    if (token === undefined || token === null) {
      await AsyncStorage.removeItem('userToken');
      global.userToken = null;
      return;
    }
    await AsyncStorage.setItem('userToken', token);
    global.userToken = token;
  } catch (error) {
    console.error('Token kaydetme hatası:', error);
  }
},


  // Token al
  getToken: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      global.userToken = token;
      return token;
    } catch (error) {
      console.error('Token alma hatası:', error);
      return null;
    }
  },

  // Token sil
  removeToken: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      global.userToken = null;
    } catch (error) {
      console.error('Token silme hatası:', error);
    }
  },

  // Kullanıcı bilgileri kaydet
  saveUser: async user => {
    try {
      if (!user || typeof user !== 'object') {
        console.warn('Kayıt edilecek kullanıcı geçersiz:', user);
        return;
      }

      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Kullanıcı bilgisi kaydetme hatası:', error);
    }
  },

  // Kullanıcı bilgileri al
  getUser: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Kullanıcı bilgisi alma hatası:', error);
      return null;
    }
  },
};
