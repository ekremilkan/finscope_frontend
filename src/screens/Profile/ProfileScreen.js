import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  RefreshControl,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/authService';
import { storageService } from '../../services/AsyncStorage';

import {
  PROFILE_DATA,
  PROFILE_MENU_ITEMS,
  COLORS,
} from '../../data/profileData';
import {
  handleNavigation,
  getUserStatus,
  updateUserProfile,
} from '../../utils/profileUtils';

import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileMenu from '../../components/Profile/ProfileMenu';
import ProfileLogout from '../../components/Profile/ProfileLogout';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }) => {
  const [profileData, setProfileData] = useState(PROFILE_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

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
      // Burada senin storageService.getUser() zaten AsyncStorage'dan JSON.parse yaparak user objesini döndürüyor varsayıyorum

      if (!cachedUser || !cachedUser._id) {
        throw new Error('Kullanıcı bilgisi AsyncStorage’da yok veya eksik');
      }

      // 2) Backend'den kullanıcıyı güncel olarak çek
      const freshUser = await authService.getUserById(cachedUser._id);

      if (!freshUser || !freshUser.name || !freshUser.email) {
        throw new Error('Sunucudan eksik kullanıcı bilgisi alındı.');
      }

      // 3) Kullanıcı istatistiklerini backend’den çek (varsa)
      // Eğer istatistik yoksa PROFILE_DATA.stats kullanılabilir
      let userStats;
      try {
        userStats = await authService.makeAuthenticatedCall('/user/stats');
      } catch {
        userStats = PROFILE_DATA.stats;
      }

      // 4) Durum belirle
      const status = getUserStatus(freshUser, userStats);

      // 5) State güncelle
      setProfileData({
        user: {
          ...freshUser,
          status,
          avatar: freshUser.avatar || '👤',
        },
        stats: userStats,
      });

      // 6) AsyncStorage içindeki kullanıcıyı güncelle (opsiyonel)
      await storageService.setUser(freshUser);

      setDebugInfo('Profil başarıyla yüklendi');
    } catch (error) {
      console.error('Profil yükleme hatası:', error);
      setDebugInfo(`Profil yükleme hatası: ${error.message}`);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Debug: {debugInfo}</Text>
      </View>

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
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
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
              menuItems={PROFILE_MENU_ITEMS}
              navigation={navigation}
              user={profileData.user}
            />
            <ProfileLogout navigation={navigation} user={profileData.user} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  debugContainer: {
    backgroundColor: 'rgba(255,255,0,0.2)',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  debugText: { color: COLORS.text, fontSize: 12, fontFamily: 'monospace' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: Math.max(20, width * 0.05) },
});

export default ProfileScreen;
