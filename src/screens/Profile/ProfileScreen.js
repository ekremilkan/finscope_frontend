//totall earnings kısmı soldan sağa doğru hizalanacak
//icon ?
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { authService } from '../../services/authService';
import { storageService } from '../../services/AsyncStorage';

import {
  PROFILE_DATA,
  PROFILE_MENU_ITEMS,
  COLORS as PROFILE_COLORS,
} from '../../data/profileData';
import {
  handleNavigation,
  getUserStatus,
  updateUserProfile,
  loadUserData,
} from '../../utils/profileUtils';
// DEĞİŞİKLİK: 'confirmLogout' yerine 'handleLogout' import ediliyor
import { handleLogout } from '../../utils/homeUtils';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileMenu from '../../components/Profile/ProfileMenu';
import ProfileLogout from '../../components/Profile/ProfileLogout';
import CustomAlertModal from '../../components/common/CustomAlertModal';

// Constants
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState(PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', confirmText: 'Tamam', showCancelButton: false, onConfirm: () => {}, onCancel: () => {} });

  useEffect(() => {
    loadUserProfile();

    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.shouldRefresh) {
        loadUserProfile();
        navigation.setParams({ shouldRefresh: false });
      }
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const cachedUser = await storageService.getUser();
      const isVerified = await storageService.getIsVerified();

      if (!cachedUser || !cachedUser._id) {
        throw new Error('Kullanıcı bilgisi AsyncStorage\'da yok veya eksik');
      }

      const freshUser = await authService.getUserById(cachedUser._id);

      if (!freshUser || !freshUser.name || !freshUser.email) {
        throw new Error('Sunucudan eksik kullanıcı bilgisi alındı.');
      }

      let userStats;
      try {
        userStats = await authService.makeAuthenticatedCall('/user/stats');
      } catch {
        userStats = PROFILE_DATA.stats;
      }

      const status = getUserStatus(freshUser, userStats);

      setProfileData({
        user: {
          ...freshUser,
          status,
          avatar: freshUser.avatar || '👤',
          isVerified: isVerified,
        },
        stats: userStats,
      });

      await storageService.setUser(freshUser);

    } catch (error) {
      console.error('Profil yükleme hatası:', error);

      setProfileData({
        user: {
          name: 'Demo User',
          email: 'demo@example.com',
          status: 'Basic Member',
          avatar: '👤',
          joinDate: new Date().toISOString(),
        },
        stats: PROFILE_DATA.stats,
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const showAlert = (config) => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const handleLogoutPress = () => {
    showAlert({
      title: 'Log Out',
      message: 'Are you sure you want to log out of your account?',
      showCancelButton: true,
      confirmText: 'Log Out',
      cancelText: 'Cancel',
      // DEĞİŞİKLİK: 'confirmLogout' yerine 'handleLogout' çağrılıyor
      // Önce modal'ı kapatıp sonra çıkış işlemini başlatmak daha iyi bir UX sağlar.
      onConfirm: () => {
        hideAlert();
        handleLogout(navigation);
      },
      onCancel: hideAlert,
    });
  };

  const handleNameUpdate = async (newName) => {
    const userId = profileData.user?._id;
    if (!userId) {
      showAlert({ 
        title: 'Error', 
        message: 'User ID not found.', 
        confirmText: 'OK', 
        showCancelButton: false, 
        onConfirm: hideAlert 
      });
      throw new Error('User ID not found');
    }

    try {
      const updatedUser = await authService.updateUserName(userId, newName);

      const updatedState = {
        ...profileData,
        user: {
          ...profileData.user,
          name: updatedUser.name || newName,
        },
      };
      setProfileData(updatedState);
      await storageService.setUser(updatedState.user);

      showAlert({ 
        title: 'Success', 
        message: 'Your display name has been updated successfully.', 
        confirmText: 'Great!', 
        showCancelButton: false, 
        onConfirm: hideAlert 
      });

    } catch (error) {
      console.error('Error updating profile name:', error);
      showAlert({ 
        title: 'Error', 
        message: 'There was a problem updating your name. Please try again.', 
        confirmText: 'OK', 
        showCancelButton: false, 
        onConfirm: hideAlert 
      });
      throw error; 
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          <LinearGradient
            colors={getCornerGradientColors()}
            style={styles.topRightGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <LinearGradient
            colors={getCornerGradientColors().reverse()}
            style={styles.bottomLeftGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          />

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadUserProfile();
                }}
                colors={[COLORS.PRIMARY]}
                tintColor={COLORS.PRIMARY}
              />
            }
          >
            <ProfileHeader
              user={profileData.user}
              onNameUpdate={handleNameUpdate} 
              isLoading={isLoading}
            />

            {!isLoading && (
              <>
                <ProfileStats stats={profileData.stats} isLoading={isLoading} />
                <ProfileMenu
                  menuItems={PROFILE_MENU_ITEMS.filter(
                    item => item.id !== 8 && item.route !== 'EarnRewards' && item.route !== 'UserStats'
                  )}
                  navigation={navigation}
                  user={profileData.user}
                  showAlert={showAlert}
                  hideAlert={hideAlert}
                />
                <ProfileLogout
                  user={profileData.user} // 'user' prop'unu geçiyoruz
                  onLogoutPress={handleLogoutPress}
                />
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
      <CustomAlertModal
        isVisible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancelButton={alertConfig.showCancelButton}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND
  },
  safeArea: {
    flex: 1
  },
  gradientContainer: {
    flex: 1,
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.6,
    height: width * 0.6,
    borderBottomLeftRadius: width * 0.6,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.6,
    height: width * 0.6,
    borderTopRightRadius: width * 0.6,
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: Math.max(20, width * 0.05)
  },
});

export default ProfileScreen;