import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, RefreshControl } from 'react-native'; // RefreshControl import edildi
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

// Data imports
import { HOME_USER_DATA, QUICK_ACTIONS } from '../../data/homeData';

// Service imports
import campaignService from '../../services/campaignService';

// Utils imports
import { loadUserData, confirmLogout, handleTabNavigation } from '../../utils/homeUtils';

// Component imports
import HomeHeader from '../../components/Home/HomeHeader';
import HomeStatsCard from '../../components/Home/HomeStatsCard';
import HomeQuickActions from '../../components/Home/HomeQuickActions';
import HomeActiveCampaigns from '../../components/Home/HomeActiveCampaigns';

// Constants imports
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(HOME_USER_DATA);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ YENİ: Yenileme durumu için state
  const [activeTab, setActiveTab] = useState('home');

  const loadActiveCampaigns = useCallback(async () => {
    // Sadece ilk yüklemede loading indicator göster, refresh sırasında değil.
    if (!refreshing) {
      setLoadingCampaigns(true);
    }
    try {
      const allCampaigns = await campaignService.getAllCampaigns();
      if (!Array.isArray(allCampaigns)) {
        setActiveCampaigns([]);
        return;
      }

      // ✅ DEĞİŞİKLİK: Veri birleştirme mantığı güncellendi
      const progressPromises = allCampaigns.map(campaign =>
        campaignService.getUserProgress(campaign._id).catch(() => null)
      );
      const userProgressResults = await Promise.all(progressPromises);

      const mergedCampaigns = allCampaigns.map((campaign, index) => {
        const progress = userProgressResults[index];
        let userStatus = null;
        if (progress) {
          if (progress.completed) {
            // Tamamlanmışsa
            userStatus = 'completed';
          } else if (progress.progress && progress.progress.currentQuestion > 0) {
            // Katılmış VE en az 1 soru cevaplamışsa (yarım bırakmışsa)
            userStatus = 'in-progress';
          }
          // Not: Eğer progress var ama currentQuestion = 0 ise, userStatus 'null' kalır
          // ve kart bunu "henüz başlanmamış" olarak yorumlar.
        }
        return { ...campaign, userStatus };
      });
      
      const campaignsToShow = mergedCampaigns
        .filter(c => ['active', 'upcoming', 'completed', 'in-progress'].includes(c?.userStatus) || ['active', 'upcoming', 'expired'].includes(c?.status))
        .slice(0, 4);
        
      setActiveCampaigns(campaignsToShow);
    } catch (error) {
      console.error('⌐ Load campaigns error on Home:', error);
      setActiveCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
      setRefreshing(false); // Yenileme işlemini bitir
    }
  }, [refreshing]); // refreshing state'ine bağlandı

  useFocusEffect(
    useCallback(() => {
      loadUserData(setUserData);
      loadActiveCampaigns();
    }, [loadActiveCampaigns])
  );

  // Real-time güncelleme için useEffect (kampanya sürelerini güncellemek için)
  useEffect(() => {
    const interval = setInterval(() => {
      // Kampanya sürelerini güncellemek için component'ları yeniden render et
      setActiveCampaigns(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ YENİ: Yenileme işlemini başlatan fonksiyon
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Yenileme başladığında loadActiveCampaigns tekrar çağrılır.
  }, []);

  const handleTabPress = (itemId) => {
    handleTabNavigation(itemId, activeTab, setActiveTab, navigation);
  };

  const handleCampaignPress = (campaign) => {
    navigation.navigate('CampaignDetail', { campaign });
  };

  const handleLogoutPress = () => {
    confirmLogout(navigation);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          <LinearGradient colors={getCornerGradientColors()} style={styles.topRightGradient} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} />
          <LinearGradient colors={getCornerGradientColors().reverse()} style={styles.bottomLeftGradient} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} />
          
          <HomeHeader 
            userName={userData.name}
            onLogoutPress={handleLogoutPress}
            onNotificationPress={() => {}}
          />
          
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            // ✅ YENİ: ScrollView'a RefreshControl eklendi
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.PRIMARY]}
                tintColor={COLORS.PRIMARY}
              />
            }
          >
            <View style={styles.contentWrapper}>
              <HomeActiveCampaigns 
                activeCampaigns={activeCampaigns}
                onCampaignPress={handleCampaignPress}
                isLoading={loadingCampaigns}
              />
              
              <View style={styles.sectionSpacer} />
              <HomeStatsCard userData={userData} />
              <View style={styles.sectionSpacer} />
              <HomeQuickActions quickActions={QUICK_ACTIONS} />
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND, },
  safeArea: { flex: 1, },
  gradientContainer: { flex: 1, },
  topRightGradient: { position: 'absolute', top: 0, right: 0, width: width * 0.7, height: height * 0.6, borderBottomLeftRadius: 200, },
  bottomLeftGradient: { position: 'absolute', bottom: 0, left: 0, width: width * 0.7, height: height * 0.6, borderTopRightRadius: 200, },
  scrollView: { flex: 1, },
  scrollContent: { paddingBottom: Math.max(32, height * 0.08), },
  contentWrapper: { paddingHorizontal: Math.max(20, width * 0.05), },
  sectionSpacer: { height: Math.max(24, height * 0.03), },
});

export default HomeScreen;