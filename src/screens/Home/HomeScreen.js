//community=social links
//ayarlar ikonu yerine logout ikonu gelecek

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

// Data imports
import { HOME_USER_DATA, QUICK_ACTIONS, BOTTOM_NAV_ITEMS } from '../../data/homeData';

// Service imports
import campaignService from '../../services/campaignService';

// Utils imports
import { loadUserData, confirmLogout, handleTabNavigation, handleCampaignStart } from '../../utils/homeUtils';

// Component imports
import HomeHeader from '../../components/Home/HomeHeader';
import HomeStatsCard from '../../components/Home/HomeStatsCard';
import HomeQuickActions from '../../components/Home/HomeQuickActions';
import HomeActiveCampaigns from '../../components/Home/HomeActiveCampaigns';
import HomeSettingsModal from '../../components/Home/HomeSettingsModal';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(HOME_USER_DATA);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadUserData(setUserData);
    loadActiveCampaigns();
  }, []);

  // Load active campaigns from API
  const loadActiveCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      
      const allCampaigns = await campaignService.getAllCampaigns();
      
      // Check if campaigns is an array
      if (!Array.isArray(allCampaigns)) {
        setActiveCampaigns([]);
        return;
      }
      
      // Filter active campaigns (status: 'active' or upcoming)
      const active = allCampaigns.filter(campaign => {
        return campaign?.status === 'active' || campaign?.status === 'upcoming';
      }).slice(0, 3); // Show only first 3 campaigns
      
      setActiveCampaigns(active);
    } catch (error) {
      console.error('❌ Load active campaigns error:', error);
      setActiveCampaigns([]); // Empty array on error
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleTabPress = (itemId) => {
    handleTabNavigation(itemId, activeTab, setActiveTab, navigation);
  };

  const handleCampaignPress = (campaign) => {
    handleCampaignStart(campaign, navigation);
  };

  const handleLogoutPress = () => {
    confirmLogout(navigation, setShowSettingsModal);
  };

  return (
    <LinearGradient
      colors={['#0a0f1c', '#1a1f2c', '#0a0f1c']}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <HomeHeader 
          userName={userData.name}
          onSettingsPress={() => {
            console.log('🔧 Settings button pressed!');
            setShowSettingsModal(true);
            console.log('🔧 showSettingsModal set to true');
          }}
          onNotificationPress={() => {}}
        />
        
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
          overScrollMode="never"
        >
          <View style={styles.contentWrapper}>
            <HomeActiveCampaigns 
              activeCampaigns={activeCampaigns}
              onCampaignStart={handleCampaignPress}
              isLoading={loadingCampaigns}
            />
            
            <View style={styles.sectionSpacer} />
            
            <HomeStatsCard userData={userData} />
            
            <View style={styles.sectionSpacer} />
            
            <HomeQuickActions quickActions={QUICK_ACTIONS} />
          </View>
        </ScrollView>
        
        <HomeSettingsModal 
          showModal={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onLogout={handleLogoutPress}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Math.max(32, height * 0.08),
  },
  contentWrapper: {
    paddingHorizontal: Math.max(20, width * 0.05),
  },
  sectionSpacer: {
    height: Math.max(24, height * 0.03),
  },
});

export default HomeScreen;