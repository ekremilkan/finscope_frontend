import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native'; // useFocusEffect import edildi

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
  const [activeTab, setActiveTab] = useState('home');

  // ✅ DEĞİŞİKLİK 1: Veri çekme mantığı useFocusEffect içine alındı.
  // Bu sayede kullanıcı ana sayfaya her döndüğünde en güncel veriler çekilir.
  useFocusEffect(
    useCallback(() => {
      loadUserData(setUserData);
      loadActiveCampaigns();
    }, [])
  );

  // ✅ DEĞİŞİKLİK 2: Fonksiyon artık kullanıcı ilerlemesini de çekip birleştiriyor.
  const loadActiveCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const allCampaigns = await campaignService.getAllCampaigns();
      if (!Array.isArray(allCampaigns) || allCampaigns.length === 0) {
        setActiveCampaigns([]);
        return;
      }

      // Her kampanya için kullanıcı ilerlemesini çek
      const progressPromises = allCampaigns.map(campaign =>
        campaignService.getUserProgress(campaign._id).catch(() => null)
      );
      const userProgressResults = await Promise.all(progressPromises);

      // Verileri birleştir
      const mergedCampaigns = allCampaigns.map((campaign, index) => {
        const progress = userProgressResults[index];
        let userStatus = null;
        if (progress) {
          userStatus = progress.completed ? 'completed' : 'in-progress';
        }
        return { ...campaign, userStatus };
      });
      
      // Ana sayfada gösterilecek kampanyaları filtrele (örneğin sadece ilk 4 tanesi)
      const campaignsToShow = mergedCampaigns
        .filter(campaign => ['active', 'upcoming', 'completed', 'in-progress'].includes(campaign?.userStatus) || ['active', 'upcoming', 'expired'].includes(campaign?.status) )
        .slice(0, 4);
        
      setActiveCampaigns(campaignsToShow);

    } catch (error) {
      console.error('❌ Load campaigns error on Home:', error);
      setActiveCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

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
          >
            <View style={styles.contentWrapper}>
              <HomeActiveCampaigns 
                activeCampaigns={activeCampaigns}
                onCampaignPress={handleCampaignPress} // Prop adı onCampaignPress olarak güncellendi
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
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  safeArea: { flex: 1 },
  gradientContainer: { flex: 1 },
  topRightGradient: { position: 'absolute', top: 0, right: 0, width: width * 0.7, height: height * 0.6, borderBottomLeftRadius: 200 },
  bottomLeftGradient: { position: 'absolute', bottom: 0, left: 0, width: width * 0.7, height: height * 0.6, borderTopRightRadius: 200 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: Math.max(32, height * 0.08) },
  contentWrapper: { paddingHorizontal: Math.max(20, width * 0.05) },
  sectionSpacer: { height: Math.max(24, height * 0.03) },
});

export default HomeScreen;