import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { storageService } from '../../services/AsyncStorage';
import { authService } from '../../services/authService';

const { width } = Dimensions.get('window');

const CustomerDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [dashboardData] = useState({
    activeCampaigns: 2,
    totalSpend: 1450,
    reachedUsers: 147,
    roi: 340,
    performanceChange: 23
  });

  const [recentCampaigns] = useState([
    {
      id: 1,
      title: 'DeFiSwap Launch Campaign',
      participants: 47,
      successRate: 78,
      status: 'active',
      icon: '🎯'
    },
    {
      id: 2,
      title: 'Liquidity Mining Education',
      participants: 32,
      successRate: 100,
      status: 'completed',
      icon: '📚'
    }
  ]);

  const kpiCards = [
    {
      id: 1,
      title: 'Aktif Kampanyalar',
      value: dashboardData.activeCampaigns,
      unit: '',
      color: '#6366f1',
      icon: 'campaign'
    },
    {
      id: 2,
      title: 'Harcama',
      value: dashboardData.totalSpend.toLocaleString(),
      unit: 'USDT',
      color: '#f59e0b',
      icon: 'payments'
    },
    {
      id: 3,
      title: 'Ulaşılan Kullanıcı',
      value: dashboardData.reachedUsers,
      unit: '',
      color: '#10b981',
      icon: 'people'
    },
    {
      id: 4,
      title: 'ROI',
      value: dashboardData.roi,
      unit: '%',
      color: '#8b5cf6',
      icon: 'trending-up'
    }
  ];

  const bottomNavItems = [
    { id: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
    { id: 'campaign', title: 'Kampanya', icon: 'add-circle' },
    { id: 'segments', title: 'Segmentler', icon: 'group' },
    { id: 'reports', title: 'Raporlar', icon: 'analytics' }
  ];

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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Icon name="business" size={Math.max(20, Math.min(28, width * 0.06))} color="#6366f1" />
        <Text 
          style={styles.companyName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          DeFiSwap Protocol
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Icon name="person" size={Math.max(16, Math.min(20, width * 0.045))} color="#10b981" />
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

  const renderKPICards = () => (
    <View style={styles.kpiSection}>
      <View style={styles.kpiGrid}>
        {kpiCards.map((kpi) => (
          <View key={kpi.id} style={[styles.kpiCard, { borderLeftColor: kpi.color }]}>
            <View style={styles.kpiHeader}>
              <Icon name={kpi.icon} size={20} color={kpi.color} />
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
            </View>
            <View style={styles.kpiValue}>
              <Text style={styles.kpiNumber}>{kpi.value}</Text>
              {kpi.unit && <Text style={styles.kpiUnit}>{kpi.unit}</Text>}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPerformanceChart = () => (
    <View style={styles.performanceSection}>
      <View style={styles.performanceHeader}>
        <Icon name="bar-chart" size={20} color="#6366f1" />
        <Text style={styles.sectionTitle}>Son 7 günlük performans</Text>
      </View>
      
      {/* Chart Placeholder */}
      <View style={styles.chartPlaceholder}>
        <View style={styles.chartBars}>
          {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
            <View
              key={index}
              style={[
                styles.chartBar,
                { height: height, backgroundColor: index === 6 ? '#6366f1' : '#334155' }
              ]}
            />
          ))}
        </View>
        <View style={styles.chartLabels}>
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
            <Text key={index} style={styles.chartLabel}>{day}</Text>
          ))}
        </View>
      </View>

      <View style={styles.performanceMetric}>
        <Icon name="trending-up" size={16} color="#10b981" />
        <Text style={styles.performanceText}>%{dashboardData.performanceChange} artış</Text>
      </View>
    </View>
  );

  const renderRecentCampaigns = () => (
    <View style={styles.campaignsSection}>
      <Text style={styles.sectionTitle}>Son Kampanyalar</Text>
      
      {recentCampaigns.map((campaign) => (
        <View key={campaign.id} style={styles.campaignCard}>
          <View style={styles.campaignHeader}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignIcon}>{campaign.icon}</Text>
              <View style={styles.campaignDetails}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <View style={styles.campaignStats}>
                  <View style={styles.statGroup}>
                    <Icon name="people" size={14} color="#94a3b8" />
                    <Text style={styles.statText}>{campaign.participants} katılımcı</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statGroup}>
                    <Icon name="check-circle" size={14} color="#10b981" />
                    <Text style={styles.statText}>%{campaign.successRate} başarı</Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.detailsButton} activeOpacity={0.8}>
              <Text style={styles.detailsButtonText}>Detaylar</Text>
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
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderKPICards()}
        {renderPerformanceChart()}
        {renderRecentCampaigns()}
        
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
  companyName: {
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

  // KPI Cards
  kpiSection: {
    padding: 20,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 50) / 2,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 6,
    fontWeight: '500',
  },
  kpiValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  kpiNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  kpiUnit: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Performance Section
  performanceSection: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  chartPlaceholder: {
    height: 120,
    marginBottom: 16,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    width: 20,
  },
  performanceMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 4,
  },

  // Campaigns Section
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
    fontSize: 20,
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
  campaignStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  statText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 4,
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Bottom Navigation
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

  // Switch Button
  switchButton: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    borderRadius: Math.max(16, width * 0.04),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981',
    marginRight: Math.max(8, width * 0.025),
  },
  switchText: {
    color: '#10b981',
    fontSize: Math.max(10, width * 0.03),
    fontWeight: '600',
    marginLeft: Math.max(3, width * 0.01),
  },

  // Settings Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    maxHeight: '80%',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 12,
  },
});

export default CustomerDashboard; 