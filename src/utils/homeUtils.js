// homeUtils.js

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService } from '../services/AsyncStorage';
import { authService } from '../services/authService';

export const loadUserData = async setUserData => {
  try {
    const user = await storageService.getUser();
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name,
      }));
    }
  } catch (error) {
    console.log('User data loading error:', error);
  }
};

export const handleLogout = async (navigation) => {
  console.log('Logout function triggered');
  try {
    const token = await storageService.getItem('userToken');
    const userId = await storageService.getItem('userId');

    console.log('Token:', token);
    console.log('UserId:', userId);

    if (token && userId) {
      try {
        await authService.logoutUser(userId, token);
        console.log('Backend logout successful');
      } catch (backendError) {
        console.log('Backend logout error:', backendError);
      }
    }

    await storageService.multiRemove([
      'userToken',
      'refreshToken',
      'userId',
      'userData',
    ]);

    global.userToken = null;
    console.log('Storage cleared');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', state: { routes: [{ name: 'Login' }] } }],
    });

    console.log('Redirected to login screen');
  } catch (error) {
    console.log('Logout error:', error);
    Alert.alert(
      'Warning',
      'An error occurred during logout, but you will be logged out anyway.',
      [
        {
          text: 'OK',
          onPress: async () => {
            try {
              await storageService.multiRemove([
                'userToken',
                'refreshToken',
                'userId',
                'userData',
              ]);
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
      ],
    );
  }
};

// confirmLogout fonksiyonu kaldırıldı

export const handleTabNavigation = (
  itemId,
  activeTab,
  setActiveTab,
  navigation,
) => {
  setActiveTab(itemId);
  if (itemId === 'campaigns') {
    navigation.navigate('CampaignsScreen');
  }
};

export const handleCampaignStart = (campaign, navigation) => {
  navigation.navigate('CampaignDetail', {
    campaignId: campaign._id || campaign.id,
    campaign: campaign,
  });
};