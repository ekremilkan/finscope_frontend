import AsyncStorage from '@react-native-async-storage/async-storage';

const storageService = {
  // Save token
  async setToken(token) {
    try {
      if (token === undefined || token === null) {
        await AsyncStorage.removeItem('userToken');
        global.userToken = null;
        return;
      }
      await AsyncStorage.setItem('userToken', token);
      global.userToken = token;
    } catch (error) {
      console.error('Token save error:', error);
    }
  },

  // Get token
  async getToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      global.userToken = token;
      return token;
    } catch (error) {
      console.error('Token get error:', error);
      return null;
    }
  },

  // Remove token
  async removeToken() {
    try {
      await AsyncStorage.removeItem('userToken');
      global.userToken = null;
    } catch (error) {
      console.error('Token delete error:', error);
    }
  },

  // Save user info
  async setUser(user) {
    try {
      if (!user || typeof user !== 'object') {
        console.warn('Invalid user to save:', user);
        return;
      }

      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      // Save user ID separately
      if (user._id || user.id) {
        await AsyncStorage.setItem('userId', user._id || user.id);
      }
    } catch (error) {
      console.error('User data save error:', error);
    }
  },

  // Get user info
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('User data get error:', error);
      return null;
    }
  },

  // Save generic item
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`${key} save error:`, error);
    }
  },

  // Get generic item
  async getItem(key) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`${key} get error:`, error);
      return null;
    }
  },

  // Remove generic item
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`${key} delete error:`, error);
    }
  },

  // Remove multiple items
  async multiRemove(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Multi delete error:', error);
    }
  },

  // Save refresh token
  async setRefreshToken(token) {
    try {
      if (token) {
        await AsyncStorage.setItem('refreshToken', token);
      }
    } catch (error) {
      console.error('Refresh token save error:', error);
    }
  },

  // Get refresh token
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Refresh token get error:', error);
      return null;
    }
  },
};

export { storageService };