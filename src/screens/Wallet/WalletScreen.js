
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Data imports
import { DEFAULT_WALLET_DATA, WALLET_CONFIG, WALLET_COLORS } from '../../data/walletData';

// Utils imports
import { 
  refreshWallets, 
  confirmDeleteWallet, 
  confirmSetAirdropWallet,
  confirmRemoveAirdropWallet,
  showSuccessAlert,
  showErrorAlert,
  handleAsyncOperation
} from '../../utils/walletUtils';

// Service imports
import walletService from '../../services/walletService';

// Component imports
import WalletHeader from '../../components/Wallet/WalletHeader';
import WalletList from '../../components/Wallet/WalletList';
import WalletActionModal from '../../components/Wallet/WalletActionModal';

const WalletScreen = ({ navigation }) => {
  // State management
  const [wallets, setWallets] = useState(DEFAULT_WALLET_DATA.wallets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: checking, false: not auth, true: authenticated

  // Authentication check
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Load wallets (only if authenticated)
  useEffect(() => {
    if (isAuthenticated === true) {
      loadWallets();
    }
  }, [isAuthenticated]);

  // Authentication check
  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      const authenticated = !!(token || refreshToken);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  // Redirect to login page
  const handleGoToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', state: { routes: [{ name: 'Login' }] } }],
    });
  };

  // Authentication required component
  const AuthRequiredComponent = () => (
    <View style={styles.authContainer}>
      <View style={styles.authContent}>
        <Icon name="account-balance-wallet" size={80} color={WALLET_COLORS.primary} />
        <Text style={styles.authTitle}>Wallet Features</Text>
        <Text style={styles.authSubtitle}>
          You need to log in to access wallet features
        </Text>
        <Text style={styles.authDescription}>
          • Connect your Ethereum wallet{'\n'}
          • Select airdrop wallet{'\n'}
          • View transaction history
        </Text>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleGoToLogin}
          activeOpacity={0.8}
        >
          <Icon name="login" size={20} color="#ffffff" />
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Loading component
  const LoadingComponent = () => (
    <View style={styles.authContainer}>
      <Text style={styles.authSubtitle}>Loading...</Text>
    </View>
  );

  // Authenticated user functions
  const loadWallets = async () => {
    await refreshWallets(setWallets, setLoading, setError);
  };

  const handleRefresh = () => {
    loadWallets();
  };

  const handleAddWallet = () => {
    navigation.navigate('AddWalletScreen');
  };

  const handleWalletPress = (wallet) => {
    console.log('Wallet details:', wallet);
  };

  const handleWalletMenu = (wallet) => {
    setSelectedWallet(wallet);
    setShowActionModal(true);
  };

  const handleCloseModal = () => {
    setShowActionModal(false);
    setSelectedWallet(null);
  };

  const handleSetAirdrop = async (wallet) => {
    confirmSetAirdropWallet(wallet, async () => {
      await handleAsyncOperation(
        setLoading,
        () => walletService.setAirdropWallet(wallet.address),
        (data) => {
          setWallets(data.data.wallets || []);
          showSuccessAlert('Airdrop wallet set successfully');
        },
        (error) => {
          showErrorAlert(error);
        }
      );
    });
  };

  const handleRemoveAirdrop = async (wallet) => {
    confirmRemoveAirdropWallet(wallet, async () => {
      await handleAsyncOperation(
        setLoading,
        () => walletService.removeAirdropWallet(),
        (data) => {
          // Refresh wallet list after removing airdrop
          loadWallets();
          showSuccessAlert('Airdrop wallet removed successfully');
        },
        (error) => {
          showErrorAlert(error);
        }
      );
    });
  };

  const handleDeleteWallet = async (wallet) => {
    confirmDeleteWallet(wallet, async () => {
      await handleAsyncOperation(
        setLoading,
        () => walletService.deleteWallet(wallet._id),
        () => {
          loadWallets();
          showSuccessAlert('Wallet deleted successfully');
        },
        (error) => {
          showErrorAlert(error);
        }
      );
    });
  };

  const handleViewTransactions = (wallet) => {
    console.log('Transaction history:', wallet);
  };

  const handleBalanceRefresh = (updatedWallet) => {
    // Cüzdan listesindeki ilgili cüzdanı güncelle
    setWallets(prevWallets => 
      prevWallets.map(wallet => 
        wallet._id === updatedWallet._id ? updatedWallet : wallet
      )
    );
  };

  const handleRefreshAllBalances = async () => {
    await handleAsyncOperation(
      setLoading,
      () => walletService.refreshAllWalletBalances(),
      (data) => {
        // Tüm cüzdan listesini yenile
        loadWallets();
        showSuccessAlert(`${data.data.updatedCount} wallet balances updated`);
      },
      (error) => {
        showErrorAlert(error);
      }
    );
  };

  const handleSettings = () => {
    console.log('Wallet settings');
  };

  // Main render
  if (isAuthenticated === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LoadingComponent />
      </SafeAreaView>
    );
  }

  if (isAuthenticated === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <AuthRequiredComponent />
      </SafeAreaView>
    );
  }

  // Authenticated user - normal wallet interface
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <WalletHeader
        walletCount={wallets.length}
        maxWallets={WALLET_CONFIG.maxWalletsPerNetwork}
        onAddPress={handleAddWallet}
        onSettingsPress={handleSettings}
        onRefreshAllPress={handleRefreshAllBalances}
        showSettings={false}
      />

      {/* Wallet List */}
      <WalletList
        wallets={wallets}
        loading={loading}
        onRefresh={handleRefresh}
        onWalletPress={handleWalletPress}
        onWalletMenuPress={handleWalletMenu}
        onViewTransactions={handleViewTransactions}
        onSetAirdrop={handleSetAirdrop}
        onBalanceRefresh={handleBalanceRefresh}
      />

      {/* Action Modal */}
      <WalletActionModal
        visible={showActionModal}
        wallet={selectedWallet}
        onClose={handleCloseModal}
        onSetAirdrop={handleSetAirdrop}
        onRemoveAirdrop={handleRemoveAirdrop}
        onDeleteWallet={handleDeleteWallet}
        onViewTransactions={handleViewTransactions}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  // Auth Required Styles
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  authContent: {
    alignItems: 'center',
    maxWidth: 300,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: WALLET_COLORS.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: 16,
    color: WALLET_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  authDescription: {
    fontSize: 14,
    color: WALLET_COLORS.textSecondary,
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WALLET_COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: WALLET_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletScreen;
