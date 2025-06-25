import { Alert } from 'react-native';
import { storageService } from '../services/AsyncStorage';
import { authService } from '../services/authService';

export const handleCustomerLogout = async (navigation, setShowSettingsModal) => {
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

export const confirmCustomerLogout = (navigation, setShowSettingsModal) => {
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
        onPress: () => handleCustomerLogout(navigation, setShowSettingsModal),
      },
    ]
  );
};

export const handleTabNavigation = (itemId, setActiveTab, navigation) => {
  setActiveTab(itemId);
  
  // Tab navigation operations
  switch (itemId) {
    case 'campaigns':
      navigation.navigate('CustomerCampaignsScreen');
      break;
    case 'segments':
      // Segments screen can be added in the future
      console.log('Segments screen not yet developed');
      break;
    case 'reports':
      // Reports screen can be added in the future
      console.log('Reports screen not yet developed');
      break;
    case 'dashboard':
    default:
      // Stay on dashboard
      break;
  }
}; 