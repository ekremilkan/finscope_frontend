// src/utils/walletUtils.js
import { Alert } from 'react-native';
import { storageService } from '../services/AsyncStorage';
import { WALLET_DATA, WALLET_STATES, WALLET_ACTIONS } from '../data/walletData';

// API Base URL - Add your backend URL here
const API_BASE_URL = 'https://your-backend-api.com/api/v1';

// Navigation handlers
export const handleNavigation = (navigation, route, params) => {
  navigation.navigate(route, params);
};

// Wallet Connection Logic
export const connectWallet = async (walletType, address) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`
      },
      body: JSON.stringify({
        walletType,
        address,
        timestamp: new Date().toISOString()
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      await storageService.setItem(`wallet_${walletType}`, {
        address,
        connectedAt: new Date().toISOString(),
        status: WALLET_STATES.CONNECTED
      });
      return { success: true, data };
    } else {
      throw new Error(data.message || 'Wallet connection failed');
    }
  } catch (error) {
    console.error('Wallet connection error:', error);
    return { success: false, error: error.message };
  }
};

// Wallet Disconnection
export const disconnectWallet = async (walletId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${walletId}/disconnect`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });

    if (response.ok) {
      await storageService.removeItem(`wallet_${walletId}`);
      return { success: true };
    } else {
      throw new Error('Failed to disconnect the wallet');
    }
  } catch (error) {
    console.error('Wallet disconnect error:', error);
    return { success: false, error: error.message };
  }
};

// Get Connected Wallets
export const getConnectedWallets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, wallets: data.wallets || [] };
    } else {
      throw new Error(data.message || 'Failed to load wallets');
    }
  } catch (error) {
    console.error('Get wallets error:', error);
    return { success: false, error: error.message };
  }
};

// Get Wallet Balance
export const getWalletBalance = async (walletId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/wallets/${walletId}/balance`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, balance: data.balance };
    } else {
      throw new Error(data.message || 'Failed to load balance');
    }
  } catch (error) {
    console.error('Get balance error:', error);
    return { success: false, error: error.message };
  }
};

// MetaMask Integration
export const connectMetaMask = async () => {
  try {
    // MetaMask connection logic
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      });

      const address = accounts[0];
      
      // Save to backend
      const result = await connectWallet('metamask', address);
      
      if (result.success) {
        return { success: true, address, chainId };
      } else {
        throw new Error(result.error);
      }
    } else {
      throw new Error('MetaMask not found');
    }
  } catch (error) {
    console.error('MetaMask connection error:', error);
    return { success: false, error: error.message };
  }
};

// Wallet Action Handler
export const handleWalletAction = async (action, walletId, navigation) => {
  switch (action) {
    case WALLET_ACTIONS.CONNECT:
      return await showWalletConnectionModal();
    
    case WALLET_ACTIONS.DISCONNECT:
      return await handleDisconnectWallet(walletId);
    
    case WALLET_ACTIONS.REFRESH:
      return await refreshWalletData(walletId);
    
    case WALLET_ACTIONS.VIEW_DETAILS:
      handleNavigation(navigation, 'WalletDetails', { walletId });
      break;
    
    case WALLET_ACTIONS.SEND:
      handleNavigation(navigation, 'SendTransaction', { walletId });
      break;
    
    case WALLET_ACTIONS.RECEIVE:
      handleNavigation(navigation, 'ReceiveTransaction', { walletId });
      break;
    
    default:
      console.warn('Unknown wallet action:', action);
  }
};

// Wallet Connection Modal
export const showWalletConnectionModal = () => {
  return new Promise((resolve) => {
    Alert.alert(
      'Connect Wallet',
      'Which wallet would you like to connect?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
        { text: 'MetaMask', onPress: () => resolve('metamask') },
        { text: 'Trust Wallet', onPress: () => resolve('trustwallet') },
        { text: 'Coinbase', onPress: () => resolve('coinbase') }
      ]
    );
  });
};

// Disconnect Confirmation
export const handleDisconnectWallet = async (walletId) => {
  return new Promise((resolve) => {
    Alert.alert(
      'Disconnect Wallet',
      'Are you sure you want to disconnect this wallet?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            const result = await disconnectWallet(walletId);
            resolve(result.success);
          }
        }
      ]
    );
  });
};

// Refresh Wallet Data
export const refreshWalletData = async (walletId) => {
  try {
    const balanceResult = await getWalletBalance(walletId);
    if (balanceResult.success) {
      return { success: true, balance: balanceResult.balance };
    } else {
      throw new Error(balanceResult.error);
    }
  } catch (error) {
    console.error('Refresh wallet error:', error);
    return { success: false, error: error.message };
  }
};

// Validation Functions
export const validateWalletLimit = (currentWallets) => {
  return currentWallets.length < WALLET_DATA.maxWallets;
};

export const isWalletSupported = (walletType) => {
  return WALLET_DATA.supportedWallets.some(
    wallet => wallet.id === walletType && wallet.isSupported
  );
};

export const formatWalletAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance, symbol) => {
  if (!balance) return '0';
  return `${parseFloat(balance).toFixed(2)} ${symbol}`;
};

// Error Handlers
export const showErrorAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showSuccessAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

// Storage and Auth Helpers
const getAuthToken = async () => {
  return await storageService.getItem('auth_token');
};

export const loadWalletData = async (setWallets, setLoading) => {
  setLoading(true);
  try {
    const result = await getConnectedWallets();
    if (result.success) {
      setWallets(result.wallets);
    } else {
      showErrorAlert('Error', result.error);
    }
  } catch (error) {
    showErrorAlert('Error', 'An error occurred while loading wallet data');
  } finally {
    setLoading(false);
  }
};
