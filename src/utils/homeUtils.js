import { Alert } from 'react-native';
import { storageService } from '../services/AsyncStorage';
import { authService } from '../services/authService';

export const loadUserData = async (setUserData) => {
  try {
    const user = await storageService.getUser();
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || 'Ali'
      }));
    }
  } catch (error) {
    console.log('User data loading error:', error);
  }
};

export const handleLogout = async (navigation, setShowSettingsModal) => {
  console.log("Logout function triggered");
  try {
    // Get token and userId
    const token = await storageService.getToken();
    const userId = await storageService.getItem('userId');

    console.log('Token:', token);
    console.log('UserId:', userId);

    if (token && userId) {
      try {
        // Send logout request to backend
        await authService.logoutUser(userId, token);
        console.log('Backend logout successful');
      } catch (backendError) {
        console.log('Backend logout error:', backendError);
        // Continue even if backend error
      }
    }

    // AsyncStorage cleanup
    await storageService.multiRemove(['userToken', 'refreshToken', 'userId', 'userData']);
    
    // Clear global token
    global.userToken = null;

    console.log('Storage cleared');

    // Close modal
    setShowSettingsModal(false);

    // Navigate to login screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });

    console.log('Redirected to login screen');

  } catch (error) {
    console.log('Logout error:', error);
    
    // Log out user even if error occurs
    Alert.alert(
      'Warning',
      'An error occurred during logout, but you will be logged out anyway.',
      [
        {
          text: 'OK',
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

export const confirmLogout = (navigation, setShowSettingsModal) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout from your account?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => handleLogout(navigation, setShowSettingsModal),
      },
    ]
  );
};

export const handleTabNavigation = (itemId, activeTab, setActiveTab, navigation) => {
  setActiveTab(itemId);
  if (itemId === 'campaigns') {
    navigation.navigate('CampaignsScreen');
  }
};

export const handleCampaignStart = (campaign, navigation) => {
  navigation.navigate('QuizScreen', { 
    campaign: campaign,
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    reward: campaign.reward
  });
}; 