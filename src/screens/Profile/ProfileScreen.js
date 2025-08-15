import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
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
  // GÜNCELLEME: confirmLogout buradan kaldırıldı, homeUtils'tan alınacak
  loadUserData,
} from '../../utils/profileUtils';
// GÜNCELLEME: Çıkış fonksiyonu, ana sayfada kullanılanla aynı olması için homeUtils'tan import edildi
import { confirmLogout } from '../../utils/homeUtils'; 

import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileMenu from '../../components/Profile/ProfileMenu';
import ProfileLogout from '../../components/Profile/ProfileLogout';

// Constants
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState(PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      // 1) AsyncStorage'dan user bilgisini al
      const cachedUser = await storageService.getUser();
      const isVerified = await storageService.getIsVerified();
      
      // Burada senin storageService.getUser() zaten AsyncStorage'dan JSON.parse yaparak user objesini döndürüyor varsayıyorum

      if (!cachedUser || !cachedUser._id) {
        throw new Error('Kullanıcı bilgisi AsyncStorage\'da yok veya eksik');
      }

      // 2) Backend'den kullanıcıyı güncel olarak çek
      const freshUser = await authService.getUserById(cachedUser._id);

      if (!freshUser || !freshUser.name || !freshUser.email) {
        throw new Error('Sunucudan eksik kullanıcı bilgisi alındı.');
      }

      // 3) Kullanıcı istatistiklerini backend'den çek (varsa)
      // Eğer istatistik yoksa PROFILE_DATA.stats kullanılabilir
      let userStats;
      try {
        userStats = await authService.makeAuthenticatedCall('/user/stats');
      } catch {
        userStats = PROFILE_DATA.stats;
      }

      // 4) Durum belirle
      const status = getUserStatus(freshUser, userStats);

      // 5) State güncelle - isVerified durumunu da ekle
      setProfileData({
        user: {
          ...freshUser,
          status,
          avatar: freshUser.avatar || '👤',
          isVerified: isVerified, // AsyncStorage'dan gelen isVerified durumu
        },
        stats: userStats,
      });

      // 6) AsyncStorage içindeki kullanıcıyı güncelle (opsiyonel)
      await storageService.setUser(freshUser);

    } catch (error) {
      console.error('Profil yükleme hatası:', error);

      // Hata durumunda demo verisi
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

  // GÜNCELLEME: Bu blok hatalı 'setUserData' fonksiyonunu çağırıyordu ve gereksizdi.
  // Bu nedenle tamamen kaldırıldı.
  /*
   useFocusEffect(
      useCallback(() => {
        loadUserData(setUserData);
      },  []),
    );
  */

  const handleLogoutPress = () => {
      // Artık homeUtils'tan gelen, backend'e de istek atan ve
      // AsyncStorage'ı temizleyen fonksiyonu kullanıyor.
      confirmLogout(navigation);
    };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          {/* Corner Gradients - Daha yumuşak */}
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
          onEditPress={() => {
            handleNavigation(navigation, 'EditProfile', {
              userData: profileData.user,
              onUpdate: updatedData => {
                updateUserProfile(profileData.user._id, updatedData)
                  .then(updatedUser => {
                    setProfileData(prev => ({
                      ...prev,
                      user: { ...prev.user, ...updatedUser },
                    }));
                    Alert.alert('Başarılı', 'Profil güncellendi.');
                  })
                  .catch(() => {
                    Alert.alert('Hata', 'Profil güncellenirken hata oluştu.');
                  });
              },
            });
          }}
          isLoading={isLoading}
        />

        {!isLoading && (
          <>
            <ProfileStats stats={profileData.stats} isLoading={isLoading} />
            <ProfileMenu
              // GÜNCELLEME: Menü listesi, 'Delete Account' (id: 8) seçeneğini içermeyecek şekilde filtrelendi.
              menuItems={PROFILE_MENU_ITEMS.filter(item => item.id !== 8)}
              navigation={navigation}
              user={profileData.user}
            />
            <ProfileLogout 
              // GÜNCELLEME: Hatalı 'userData.name' kullanımı 'profileData.user.name' olarak düzeltildi.
              userName={profileData.user.name} 
              onLogoutPress={handleLogoutPress}
              onNotificationPress={() => {}} 
            />
          </>
        )}
      </ScrollView>
        </LinearGradient>
    </SafeAreaView>
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