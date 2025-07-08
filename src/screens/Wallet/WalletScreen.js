import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data imports
import { WALLET_DATA, MOCK_CONNECTED_WALLETS } from '../../data/walletData';

// Utils imports
import {
  handleNavigation,
  loadWalletData,
  handleWalletAction,
  handleDisconnectWallet,
  refreshWalletData,
  validateWalletLimit,
  showErrorAlert,
  showSuccessAlert,
} from '../../utils/walletUtils';

// Component imports
import WalletHeader from '../../components/Wallet/WalletHeader';
import WalletCard from '../../components/Wallet/WalletCard';
import WalletEmptyState from '../../components/Wallet/WalletEmptyState';
import WalletConnectionModal from '../../components/Wallet/WalletConnectionModal';

const WalletScreen = ({ navigation }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionModalVisible, setConnectionModalVisible] = useState(false);

  // Load wallet data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // For mock data - use loadWalletData in real app
      setTimeout(() => {
        setWallets(MOCK_CONNECTED_WALLETS);
        setLoading(false);
      }, 1000);
      
      // Real API call:
      // await loadWalletData(setWallets, setLoading);
    } catch (error) {
      showErrorAlert('Error', 'An error occurred while loading wallet data');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSettingsPress = () => {
    handleNavigation(navigation, 'WalletSettings');
  };

  const handleConnectWallet = () => {
    if (!validateWalletLimit(wallets)) {
      showErrorAlert(
        'Limit Exceeded',
        `You can connect up to ${WALLET_DATA.maxWallets} wallets`
      );
      return;
    }
    setConnectionModalVisible(true);
  };

  const handleWalletConnected = (walletData) => {
    // Add new wallet
    const newWallet = {
      id: `wallet_${Date.now()}`,
      address: walletData.address,
      walletType: walletData.walletType || 'metamask',
      balance: '0.00 ETH',
      usdValue: '$0.00',
      network: 'ethereum',
      status: 'connected',
      connectedAt: new Date().toISOString(),
    };

    setWallets(prev => [...prev, newWallet]);
    showSuccessAlert('Success', 'Wallet connected successfully!');
  };

  const handleDisconnectWalletPress = async (walletId) => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect this wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            const result = await handleDisconnectWallet(walletId);
            if (result) {
              setWallets(prev => prev.filter(w => w.id !== walletId));
              showSuccessAlert('Success', 'Wallet disconnected');
            }
          },
        },
      ]
    );
  };

  const handleWalletPress = (walletId) => {
    handleNavigation(navigation, 'WalletDetails', { walletId });
  };

  const handleRefreshWallet = async (walletId) => {
    try {
      const result = await refreshWalletData(walletId);
      if (result.success) {
        // Update wallet data
        setWallets(prev => 
          prev.map(w => 
            w.id === walletId 
              ? { ...w, balance: result.balance }
              : w
          )
        );
        showSuccessAlert('Success', 'Wallet data updated');
      } else {
        showErrorAlert('Error', result.error);
      }
    } catch (error) {
      showErrorAlert('Error', 'An error occurred while updating wallet data');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <WalletHeader
          onBackPress={handleBackPress}
          onSettingsPress={handleSettingsPress}
          walletCount={0}
          maxWallets={WALLET_DATA.maxWallets}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <WalletHeader
        onBackPress={handleBackPress}
        onSettingsPress={handleSettingsPress}
        walletCount={wallets.length}
        maxWallets={WALLET_DATA.maxWallets}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {wallets.length === 0 ? (
          <WalletEmptyState onConnectWallet={handleConnectWallet} />
        ) : (
          <View style={styles.walletsContainer}>
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onPress={handleWalletPress}
                onDisconnect={handleDisconnectWalletPress}
                onRefresh={handleRefreshWallet}
              />
            ))}
            
            {validateWalletLimit(wallets) && (
              <TouchableOpacity
                style={styles.addWalletButton}
                onPress={handleConnectWallet}
                activeOpacity={0.8}
              >
                <Text style={styles.addWalletIcon}>+</Text>
                <Text style={styles.addWalletText}>Connect New Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <WalletConnectionModal
        visible={connectionModalVisible}
        onClose={() => setConnectionModalVisible(false)}
        onWalletConnected={handleWalletConnected}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  addWalletButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderStyle: 'dashed',
    padding: 32,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  addWalletIcon: {
    fontSize: 32,
    color: '#6366f1',
    marginBottom: 8,
  },
  addWalletText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default WalletScreen;
