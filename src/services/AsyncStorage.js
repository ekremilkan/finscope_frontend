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
      
      // User ID'yi ayrı olarak kaydet
      if (user._id || user.id) {
        await AsyncStorage.setItem('userId', user._id || user.id);
      }
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

  // Generic item kaydet
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`${key} kaydetme hatası:`, error);
    }
  },

  // Generic item al
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`${key} alma hatası:`, error);
      return null;
    }
  },

  // Generic item sil
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`${key} silme hatası:`, error);
    }
  },

  // Birden fazla item sil
  multiRemove: async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Çoklu silme hatası:', error);
    }
  },

  // Refresh token kaydet
  saveRefreshToken: async (refreshToken) => {
    try {
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
    } catch (error) {
      console.error('Refresh token kaydetme hatası:', error);
    }
  },

  // Refresh token al
  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Refresh token alma hatası:', error);
      return null;
    }
  },
};