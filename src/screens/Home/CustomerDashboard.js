//kampanya oluşturma web sitesi üzerinden olacak (link ile yönlendirme)
//ROI kaldrılacak
//start edit delete kalkıcak (report kalacak (kullanıcı segmentleri))
//deFi-meme-rwa(real word asset)-ai

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data imports
import { 
  CUSTOMER_DASHBOARD_DATA, 
  CUSTOMER_RECENT_CAMPAIGNS, 
  getKPICards
} from '../../data/customerDashboardData';

// Utils imports
import { confirmCustomerLogout, handleTabNavigation } from '../../utils/customerDashboardUtils';

// Component imports
import CustomerKPICards from '../../components/Customer/CustomerKPICards';
import CustomerRecentCampaigns from '../../components/Customer/CustomerRecentCampaigns';
import CustomerSettingsModal from '../../components/Customer/CustomerSettingsModal';
import CustomerHeader from '../../components/Customer/CustomerHeader';

const CustomerDashboard = ({ navigation, route, onSwitchPress }) => {
  const [activeTab, setActiveTab] = useState(route?.params?.activeTab || 'dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const kpiCards = getKPICards(CUSTOMER_DASHBOARD_DATA);

  const handleTabPress = (itemId) => {
    handleTabNavigation(itemId, setActiveTab, navigation);
  };

  const handleLogoutPress = () => {
    confirmCustomerLogout(navigation, setShowSettingsModal);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom','top']}>
      <CustomerHeader
        activeTab="Dashboard"
        onSettingsPress={() => setShowSettingsModal(true)}
        onNotificationPress={() => {/* Notification handler */}}
        onSwitchPress={() => {
          console.log('CustomerDashboard: Switch button pressed');
          onSwitchPress && onSwitchPress();
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <CustomerKPICards kpiCards={kpiCards} />
        <CustomerRecentCampaigns recentCampaigns={CUSTOMER_RECENT_CAMPAIGNS} />
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <CustomerSettingsModal 
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

export default CustomerDashboard;