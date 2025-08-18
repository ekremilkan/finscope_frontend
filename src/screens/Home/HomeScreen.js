import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

// Data imports
import { HOME_USER_DATA, QUICK_ACTIONS } from '../../data/homeData';

// Service imports
import campaignService from '../../services/campaignService';

// Utils imports
import { loadUserData, handleLogout, handleTabNavigation } from '../../utils/homeUtils';

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
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);

  // DEĞİŞİKLİK: Kampanyaları gruplamak yerine istenen önceliğe göre sıralayan mantık
  const loadActiveCampaigns = useCallback(async () => {
    if (!refreshing) {
      setLoadingCampaigns(true);
    }
    try {
      const allCampaigns = await campaignService.getAllCampaigns();
      if (!Array.isArray(allCampaigns)) {
        setActiveCampaigns([]);
        return;
      }

      const progressPromises = allCampaigns.map(campaign =>
        campaignService.getUserProgress(campaign._id).catch(() => null)
      );
      const userProgressResults = await Promise.all(progressPromises);

      const mergedCampaigns = allCampaigns.map((campaign, index) => {
        const progress = userProgressResults[index];
        let userStatus = null;
        if (progress) {
          if (progress.completed) {
            userStatus = 'completed';
          } else if (progress.progress && progress.progress.currentQuestion > 0) {
            userStatus = 'in-progress';
          }
        }
        return { ...campaign, userStatus };
      });
      
      // Sıralama için kampanyalara öncelik puanı veren bir fonksiyon
      const getCampaignPriority = (campaign) => {
        if (!campaign) return 4; // Hatalı veriyi en sona at
        const now = new Date();
        const end = new Date(campaign.endDate);

        const isActive = campaign.status === 'active' && now <= end && campaign.userStatus !== 'completed';
        const isUpcoming = campaign.status === 'upcoming';
        const isMissed = now > end && campaign.userStatus !== 'completed';

        if (isActive || isUpcoming) return 1; // En yüksek öncelik
        if (isMissed) return 2; // İkinci öncelik
        return 3; // Diğer her şey (örn: completed)
      };

      // Tüm kampanyaları öncelik puanına göre sırala
      const sortedCampaigns = mergedCampaigns.sort((a, b) => {
        const priorityA = getCampaignPriority(a);
        const priorityB = getCampaignPriority(b);
        // Öncelikler farklıysa, puana göre sırala
        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }
        // Öncelikler aynıysa, bitiş tarihine göre yeniden eskiye sırala (isteğe bağlı)
        return new Date(b.endDate) - new Date(a.endDate);
      });
      
      setActiveCampaigns(sortedCampaigns);

    } catch (error) {
      console.error('⌐ Load campaigns error on Home:', error);
      setActiveCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useFocusEffect(
    useCallback(() => {
      loadUserData(setUserData);
      loadActiveCampaigns();
    }, [loadActiveCampaigns])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCampaigns(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setShowAllCampaigns(false);
  }, []);

  const handleCampaignPress = (campaign) => {
    navigation.navigate('CampaignDetail', { campaign });
  };

  const handleLogoutPress = () => {
    handleLogout(navigation);
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
                showAllCampaigns={showAllCampaigns}
                onViewMorePress={() => setShowAllCampaigns(true)}
              />
              
              <View style={styles.sectionSpacer} />
              <HomeStatsCard userData={userData} />
              <View style={styles.sectionSpacer} />
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