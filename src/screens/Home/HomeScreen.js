import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data imports
import { HOME_USER_DATA, ACTIVE_CAMPAIGNS, QUICK_ACTIONS, BOTTOM_NAV_ITEMS } from '../../data/homeData';

// Utils imports
import { loadUserData, confirmLogout, handleTabNavigation, handleCampaignStart } from '../../utils/homeUtils';

// Component imports
import HomeHeader from '../../components/Home/HomeHeader';
import HomeStatsCard from '../../components/Home/HomeStatsCard';
import HomeQuickActions from '../../components/Home/HomeQuickActions';
import HomeActiveCampaigns from '../../components/Home/HomeActiveCampaigns';
import HomeSettingsModal from '../../components/Home/HomeSettingsModal';

const HomeScreen = ({ navigation,onSwitchPress  }) => {
  const [userData, setUserData] = useState(HOME_USER_DATA);
  const [activeTab, setActiveTab] = useState('home');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadUserData(setUserData);
  }, []);

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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <HomeHeader 
        userName={userData.name}
        onSettingsPress={() => setShowSettingsModal(true)}
        onNotificationPress={() => {}}
        onSwitchPress={onSwitchPress}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeStatsCard userData={userData} />
        <HomeQuickActions quickActions={QUICK_ACTIONS} />
        <HomeActiveCampaigns 
          activeCampaigns={ACTIVE_CAMPAIGNS}
          onCampaignStart={handleCampaignPress}
        />
        <View style={styles.bottomSpacing} />
      </ScrollView>

      
      
      <HomeSettingsModal 
        showModal={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onLogout={handleLogoutPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default HomeScreen;