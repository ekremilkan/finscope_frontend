import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { storageService } from '../../services/AsyncStorage';
import { authService } from '../../services/authService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Ali',
    totalEarnings: 45,
    userClass: 'B',
    completedCampaigns: 3,
    totalCampaigns: 5,
    successRate: 78
  });

  const [activeCampaigns] = useState([
    {
      id: 1,
      title: 'UniDEX DeFi Eğitimi',
      reward: 15,
      daysLeft: 2,
      icon: '📊'
    },
    {
      id: 2,
      title: 'Layer 2 Rehberi',
      reward: 25,
      daysLeft: 5,
      icon: '🌐'
    }
  ]);

  const [activeTab, setActiveTab] = useState('home');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await storageService.getUser();
      if (user) {
        setUserData(prev => ({
          ...prev,
          name: user.name || 'Ali'
        }));
      }
    } catch (error) {
      console.log('User data yükleme hatası:', error);
    }
  };

  const handleLogout = async () => {
    console.log("Logout fonksiyonu tetiklendi");
    try {
      // Token ve userId'yi al
      const token = await storageService.getToken();
      const userId = await storageService.getItem('userId');

      console.log('Token:', token);
      console.log('UserId:', userId);

      if (token && userId) {
        try {
          // Backend'e logout isteği at
          await authService.logoutUser(userId, token);
          console.log('Backend logout başarılı');
        } catch (backendError) {
          console.log('Backend logout hatası:', backendError);
          // Backend hatası olsa bile devam et
        }
      }

      // AsyncStorage temizliği
      await storageService.multiRemove(['userToken', 'refreshToken', 'userId', 'userData']);
      
      // Global token'ı da temizle
      global.userToken = null;

      console.log('Storage temizlendi');

      // Modal'ı kapat
      setShowSettingsModal(false);

      // Login ekranına yönlendir
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      console.log('Login ekranına yönlendirildi');

    } catch (error) {
      console.log('Logout error:', error);
      
      // Hata olsa bile kullanıcıyı çıkart
      Alert.alert(
        'Uyarı',
        'Çıkış yapılırken bir hata oluştu, yine de çıkış yapılacak.',
        [
          {
            text: 'Tamam',
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

  const confirmLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const quickActions = [
    { id: 1, title: 'Kampanyalar', icon: 'campaign', color: '#6366f1' },
    { id: 2, title: 'Eğitim', icon: 'school', color: '#8b5cf6' },
    { id: 3, title: 'Ödüllerim', icon: 'card-giftcard', color: '#f59e0b' },
    { id: 4, title: 'Topluluk', icon: 'group', color: '#10b981' }
  ];

  const bottomNavItems = [
    { id: 'home', title: 'Ana Sayfa', icon: 'home' },
    { id: 'campaigns', title: 'Kampanyalar', icon: 'campaign' },
    { id: 'wallet', title: 'Cüzdan', icon: 'account-balance-wallet' },
    { id: 'profile', title: 'Profil', icon: 'person' }
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Icon name="person" size={Math.max(20, Math.min(28, width * 0.06))} color="#6366f1" />
        <Text 
          style={styles.welcomeText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Hoş geldin, {userData.name}!
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => navigation.navigate('CustomerDashboard')}
          activeOpacity={0.7}
        >
          <Icon name="business" size={Math.max(16, Math.min(20, width * 0.045))} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Icon name="notifications" size={Math.max(20, Math.min(28, width * 0.06))} color="#94a3b8" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerIcon}
          onPress={() => setShowSettingsModal(true)}
        >
          <Icon name="settings" size={Math.max(20, Math.min(28, width * 0.06))} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSettingsModal(false)}
      >
        <View style={styles.settingsModal}>
          <TouchableOpacity
            style={styles.settingsItem}
            onPress={confirmLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={20} color="#ef4444" />
            <Text style={styles.settingsText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Kullanıcı İstatistikleri</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Toplam Kazanç</Text>
          <Text style={styles.statValue}>{userData.totalEarnings} USDT</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statLabel}>Sınıf</Text>
          <Text style={styles.statValue}>{userData.userClass} Sınıfı</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
          <Text style={styles.statValue}>{userData.completedCampaigns}/{userData.totalCampaigns} kampanya</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📈</Text>
          <Text style={styles.statLabel}>Başarı Oranı</Text>
          <Text style={styles.statValue}>%{userData.successRate}</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Hızlı Erişim</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.quickActionItem, { borderColor: action.color }]}
            activeOpacity={0.7}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={24} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderActiveCampaigns = () => (
    <View style={styles.campaignsSection}>
      <Text style={styles.sectionTitle}>Aktif Kampanyalar</Text>
      {activeCampaigns.map((campaign) => (
        <View key={campaign.id} style={styles.campaignCard}>
          <View style={styles.campaignHeader}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignIcon}>{campaign.icon}</Text>
              <View style={styles.campaignDetails}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <View style={styles.campaignMeta}>
                  <Text style={styles.campaignReward}>💰 {campaign.reward} USDT</Text>
                  <Text style={styles.campaignTime}>⏱️ {campaign.daysLeft} gün kaldı</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <Text style={styles.startButtonText}>Başla</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderBottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      {bottomNavItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.bottomNavItem}
          onPress={() => setActiveTab(item.id)}
          activeOpacity={0.7}
        >
          <Icon
            name={item.icon}
            size={24}
            color={activeTab === item.id ? '#6366f1' : '#64748b'}
          />
          <Text style={[
            styles.bottomNavText,
            { color: activeTab === item.id ? '#6366f1' : '#64748b' }
          ]}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    {renderHeader()}
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      {renderStatsCard()}
      {renderQuickActions()}
      {renderActiveCampaigns()}
      <View style={styles.bottomSpacing} />
    </ScrollView>

    {renderBottomNavigation()}
    {renderSettingsModal()}
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.035),
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    minHeight: Math.max(60, width * 0.16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: Math.max(8, width * 0.02),
  },
  welcomeText: {
    fontSize: Math.max(14, Math.min(20, width * 0.045)),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: Math.max(6, width * 0.02),
    flexShrink: 1,
    maxWidth: width * 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  headerIcon: {
    marginLeft: Math.max(12, width * 0.035),
    position: 'relative',
    padding: Math.max(4, width * 0.01),
  },
  notificationDot: {
    position: 'absolute',
    top: Math.max(2, width * 0.005),
    right: Math.max(2, width * 0.005),
    width: Math.max(6, width * 0.02),
    height: Math.max(6, width * 0.02),
    borderRadius: Math.max(3, width * 0.01),
    backgroundColor: '#ef4444',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },

  // Stats Card Styles
  statsCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statsHeader: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },

  // Quick Actions Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 60) / 2,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },

  // Campaigns Styles
  campaignsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  campaignCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  campaignIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  campaignDetails: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  campaignMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  campaignReward: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  campaignTime: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  bottomNavItem: {
    alignItems: 'center',
    flex: 1,
  },
  bottomNavText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  // Utility
  bottomSpacing: {
    height: 20,
  },

  // Switch Button Styles
  switchButton: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    borderRadius: Math.max(16, width * 0.04),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6366f1',
    marginRight: Math.max(8, width * 0.025),
  },
  switchText: {
    fontSize: Math.max(10, width * 0.03),
    fontWeight: '500',
    color: '#6366f1',
    marginLeft: Math.max(3, width * 0.01),
  },

  // Settings Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
  },
  settingsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 12,
  },
});

export default HomeScreen;