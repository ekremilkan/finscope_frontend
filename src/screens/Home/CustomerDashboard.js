import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data imports
import { 
  CUSTOMER_DASHBOARD_DATA, 
  CUSTOMER_RECENT_CAMPAIGNS, 
  CUSTOMER_BOTTOM_NAV_ITEMS,
  getKPICards
} from '../../data/customerDashboardData';

// Utils imports
import { confirmCustomerLogout, handleTabNavigation } from '../../utils/customerDashboardUtils';

// Component imports
import CustomerHeader from '../../components/Customer/CustomerHeader';
import CustomerKPICards from '../../components/Customer/CustomerKPICards';
import CustomerRecentCampaigns from '../../components/Customer/CustomerRecentCampaigns';
import CustomerBottomNavigation from '../../components/Customer/CustomerBottomNavigation';
import CustomerSettingsModal from '../../components/Customer/CustomerSettingsModal';

const CustomerDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const kpiCards = getKPICards(CUSTOMER_DASHBOARD_DATA);

  const handleTabPress = (itemId) => {
    handleTabNavigation(itemId, setActiveTab, navigation);
  };

  const handleLogoutPress = () => {
    confirmCustomerLogout(navigation, setShowSettingsModal);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <CustomerHeader 
        onSettingsPress={() => setShowSettingsModal(true)}
        onNotificationPress={() => {}}
        onSwitchPress={() => navigation.navigate('Home')}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <CustomerKPICards kpiCards={kpiCards} />
        <CustomerRecentCampaigns recentCampaigns={CUSTOMER_RECENT_CAMPAIGNS} />
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <CustomerBottomNavigation 
        bottomNavItems={CUSTOMER_BOTTOM_NAV_ITEMS}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
      
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