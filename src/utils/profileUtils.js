import { Alert } from 'react-native';
import { storageService } from '../services/AsyncStorage';
import { PROFILE_DATA } from '../data/profileData';
import axios from 'axios';

// User data loading functions
export const loadUserData = async () => {
  try {
    console.log('Loading user data from storage...');
    
    const userData = await storageService.getUser();
    console.log('User data loaded:', userData);
    
    if (userData) {
      return userData; // Zaten parse edilmiş
    }
    
    console.log('No user data found in storage');
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const loadUserStats = async (userId) => {
  try {
    console.log('Loading user stats for userId:', userId);
    
    if (!userId) {
      console.log('No userId provided, returning default stats');
      return PROFILE_DATA.stats;
    }

    const token = await storageService.getToken();
    if (!token) {
      console.log('No token found, returning default stats');
      return PROFILE_DATA.stats;
    }

    // Axios ile API çağrısı
    const response = await axiosInstance.get(`/api/users/${userId}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      console.log('User stats loaded from API:', response.data);
      return response.data;
    }

    console.log('API call failed, returning default stats');
    return PROFILE_DATA.stats;
  } catch (error) {
    console.error('Error loading user stats:', error);
    console.log('Returning default stats due to error');
    return PROFILE_DATA.stats;
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const token = await storageService.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axiosInstance.put(`/api/users/${userId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      const updatedUser = response.data;
      await storageService.setUser(updatedUser);
      return updatedUser;
    }

    throw new Error('Profile update failed');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getUserAvatar = (name) => {
  if (!name) return '👤';

  // Generate avatar based on name first letter
  const firstLetter = name.charAt(0).toUpperCase();
  const avatars = {
    'A': '👨', 'B': '👩', 'C': '🧑', 'D': '👨‍💼', 'E': '👩‍💼',
    'F': '👨‍🎓', 'G': '👩‍🎓', 'H': '🧑‍💻', 'I': '👨‍🔬', 'J': '👩‍🔬',
    'K': '👨‍🎨', 'L': '👩‍🎨', 'M': '🧑‍🍳', 'N': '👨‍⚕️', 'O': '👩‍⚕️',
    'P': '👨‍🏫', 'Q': '👩‍🏫', 'R': '🧑‍🚀', 'S': '👨‍🚒', 'T': '👩‍🚒',
    'U': '👨‍✈️', 'V': '👩‍✈️', 'W': '🧑‍🎤', 'X': '👨‍🌾', 'Y': '👩‍🌾', 'Z': '🧑‍🔧'
  };

  return avatars[firstLetter] || '👤';
};

export const formatJoinDate = (dateString) => {
  if (!dateString) return 'Unknown';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} years ago`;
    }
  } catch (error) {
    console.error('Error formatting join date:', error);
    return 'Unknown';
  }
};

export const getUserStatus = (userData, userStats) => {
  if (!userData || !userStats) return 'Basic Member';

  try {
    const totalSavings = parseFloat(userStats.totalSavings?.replace(/[₺,]/g, '') || '0');
    const transactionCount = userStats.totalTransactions || 0;

    if (totalSavings >= 100000 || transactionCount >= 1000) {
      return 'Premium Member';
    } else if (totalSavings >= 25000 || transactionCount >= 250) {
      return 'Gold Member';
    } else if (totalSavings >= 5000 || transactionCount >= 50) {
      return 'Silver Member';
    }

    return 'Basic Member';
  } catch (error) {
    console.error('Error determining user status:', error);
    return 'Basic Member';
  }
};

// Navigation handlers
export const handleNavigation = (navigation, route, params = {}) => {
  try {
    if (route && navigation) {
      console.log(`Navigating to ${route} with params:`, params);
      navigation.navigate(route, params);
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};


export const handleLogout = (navigation) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to log out of your account?',
    [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('Logging out user...');
            
            // Clear all storage data
            await storageService.removeToken();
            await storageService.removeItem('userData');
            await storageService.removeItem('refreshToken');
            
            // Reset navigation to Auth stack
            navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', state: { routes: [{ name: 'Login' }] } }],
    });
            
            console.log('Logout successful');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'An error occurred while logging out.');
          }
        }
      }
    ]
  );
};

export const confirmLogout = (navigation) => {
  Alert.alert('Logout', 'Are you sure you want to logout?', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: () => handleLogout(navigation),
    },
  ]);
};

// Account deletion
export const handleAccountDeletion = (navigation) => {
  Alert.alert(
    'Delete Account',
    'This action cannot be undone! All your data will be permanently deleted.',
    [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => showFinalDeleteConfirmation(navigation)
      }
    ]
  );
};

const showFinalDeleteConfirmation = (navigation) => {
  Alert.alert(
    'Final Confirmation',
    'Type "DELETE" to confirm account deletion:',
    [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: async () => {
          try {
            // API call for account deletion
            // await deleteUserAccount();

            // Clear all storage
            await storageService.multiRemove(['userToken', 'userData', 'refreshToken', 'userId']);
            
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            });

            Alert.alert('Success', 'Your account has been successfully deleted.');
          } catch (error) {
            console.error('Account deletion error:', error);
            Alert.alert('Error', 'An error occurred while deleting the account.');
          }
        }
      }
    ]
  );
};

// Profile data processing
export const processUserStats = (stats) => {
  if (!stats) return {
    transactions: '0',
    savings: '₺0',
    returns: '0%',
    creditScore: '0'
  };

  try {
    return {
      transactions: formatNumber(stats.totalTransactions || 0),
      savings: stats.totalSavings || '₺0',
      returns: stats.investmentReturn || '0%',
      creditScore: stats.creditScore || '0'
    };
  } catch (error) {
    console.error('Error processing user stats:', error);
    return {
      transactions: '0',
      savings: '₺0',
      returns: '0%',
      creditScore: '0'
    };
  }
};

export const formatNumber = (num) => {
  if (!num || isNaN(num)) return '0';
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Theme utilities
export const getGlassMorphismStyle = (opacity = 0.8) => ({
  backgroundColor: `rgba(30, 41, 59, ${opacity})`,
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(148, 163, 184, 0.2)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 8
});

// Responsive utilities
export const getResponsiveSize = (width, baseSize, minSize = 14, maxSize = 28) => {
  const calculatedSize = width * baseSize;
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
};