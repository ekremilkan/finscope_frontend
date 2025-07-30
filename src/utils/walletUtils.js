// src/utils/walletUtils.js
import { Alert } from 'react-native';
import { 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  WALLET_CONFIG,
  VALIDATION_RULES,
  ETHEREUM_NETWORK 
} from '../data/walletData';
import walletService from '../services/walletService';

/**
 * Wallet Utils - Business logic and helper functions
 * Helper functions required for wallet operations
 */

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean} Validity
 */
export const isValidEthereumAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  return VALIDATION_RULES.address.ethereumRegex.test(address.trim());
};

/**
 * Normalize address (clean and format)
 * @param {string} address - Raw address
 * @returns {string} Cleaned address
 */
export const normalizeAddress = (address) => {
  if (!address) return '';
  return address.trim();
};

/**
 * Format address for short display
 * @param {string} address - Full address
 * @param {number} prefixLength - Number of starting characters
 * @param {number} suffixLength - Number of ending characters
 * @returns {string} Shortened address
 */
export const formatAddressShort = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address || address.length < prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Check maximum wallet limit for network
 * @param {Array} wallets - Existing wallets
 * @param {string} network - Network to check
 * @returns {boolean} Can add wallet
 */
export const canAddWalletToNetwork = (wallets, network) => {
  if (!Array.isArray(wallets)) return true;
  const networkWallets = wallets.filter(wallet => wallet.network === network);
  return networkWallets.length < WALLET_CONFIG.maxWalletsPerNetwork;
};

/**
 * Find airdrop wallet
 * @param {Array} wallets - Wallet list
 * @returns {Object|null} Airdrop wallet
 */
export const getAirdropWallet = (wallets) => {
  if (!Array.isArray(wallets)) return null;
  return wallets.find(wallet => wallet.isAirdropAddress) || null;
};

/**
 * Check if wallet address already exists
 * @param {Array} wallets - Existing wallets
 * @param {string} address - Address to check
 * @returns {boolean} Address exists
 */
export const isAddressExists = (wallets, address) => {
  if (!Array.isArray(wallets) || !address) return false;
  const normalizedAddress = normalizeAddress(address).toLowerCase();
  return wallets.some(wallet => 
    wallet.address.toLowerCase() === normalizedAddress
  );
};

/**
 * Pre-connection wallet validation
 * @param {Array} wallets - Existing wallets
 * @param {string} network - Network
 * @param {string} address - Address
 * @returns {Object} Validation result
 */
export const validateWalletConnection = (wallets, network, address) => {
  // Address format check
  if (!isValidEthereumAddress(address)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.invalidAddress
    };
  }

  // Check if address already exists
  if (isAddressExists(wallets, address)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.addressExists
    };
  }

  // Check network wallet limit
  if (!canAddWalletToNetwork(wallets, network)) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.maxWalletsReached
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * API hata mesajını kullanıcı dostu mesaja çevir
 * @param {Object} error - API error objesi
 * @returns {string} Kullanıcı dostu hata mesajı
 */
export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.unknownError;

  // API'den gelen error response kontrol et
  if (error.response && error.response.data) {
    const apiError = error.response.data;
    
    // Spesifik API hata mesajları
    if (apiError.message) {
      return apiError.message;
    }
    
    // HTTP status kodlarına göre
    switch (error.response.status) {
      case 400:
        return apiError.error || ERROR_MESSAGES.invalidAddress;
      case 401:
        return ERROR_MESSAGES.unauthorized;
      case 404:
        return 'Kaynak bulunamadı';
      case 500:
        return ERROR_MESSAGES.serverError;
      default:
        return ERROR_MESSAGES.unknownError;
    }
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return ERROR_MESSAGES.networkError;
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED') {
    return 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
  }

  return error.message || ERROR_MESSAGES.unknownError;
};

/**
 * Başarı mesajı göster
 * @param {string} message - Gösterilecek mesaj
 * @param {Function} onPress - Tamam butonuna basılınca çalışacak fonksiyon
 */
export const showSuccessAlert = (message, onPress = null) => {
  Alert.alert(
    'Başarılı',
    message,
    [
      {
        text: 'Tamam',
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};

/**
 * Hata mesajı göster
 * @param {string} message - Gösterilecek hata mesajı
 * @param {Function} onPress - Tamam butonuna basılınca çalışacak fonksiyon
 */
export const showErrorAlert = (message, onPress = null) => {
  Alert.alert(
    'Hata',
    message,
    [
      {
        text: 'Tamam',
        onPress: onPress,
        style: 'default'
      }
    ]
  );
};

/**
 * Onay dialog'u göster
 * @param {string} title - Dialog başlığı
 * @param {string} message - Dialog mesajı
 * @param {Function} onConfirm - Onay butonuna basılınca çalışacak fonksiyon
 * @param {Function} onCancel - İptal butonuna basılınca çalışacak fonksiyon
 */
export const showConfirmAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'İptal',
        onPress: onCancel,
        style: 'cancel'
      },
      {
        text: 'Tamam',
        onPress: onConfirm,
        style: 'destructive'
      }
    ]
  );
};

/**
 * Airdrop wallet removal confirmation
 * @param {Object} wallet - Wallet to remove from airdrop
 * @param {Function} onConfirm - Confirmation function
 */
export const confirmRemoveAirdropWallet = (wallet, onConfirm) => {
  const shortAddress = formatAddressShort(wallet.address);
  
  showConfirmAlert(
    'Remove Airdrop Wallet',
    `Are you sure you want to remove ${shortAddress} from airdrop selection?`,
    onConfirm
  );
};

/**
 * Wallet deletion confirmation
 * @param {Object} wallet - Wallet to delete
 * @param {Function} onConfirm - Confirmation function
 */
export const confirmDeleteWallet = (wallet, onConfirm) => {
  const shortAddress = formatAddressShort(wallet.address);
  const title = wallet.isAirdropAddress ? 'Cannot Delete Airdrop Wallet' : 'Delete Wallet';
  
  if (wallet.isAirdropAddress) {
    showErrorAlert('Please remove this wallet from airdrop selection before deleting it.');
    return;
  }

  showConfirmAlert(
    title,
    `Are you sure you want to delete the wallet ${shortAddress}?`,
    onConfirm
  );
};

/**
 * Airdrop wallet change confirmation
 * @param {Object} wallet - Wallet to set as airdrop
 * @param {Function} onConfirm - Confirmation function
 */
export const confirmSetAirdropWallet = (wallet, onConfirm) => {
  const shortAddress = formatAddressShort(wallet.address);
  
  showConfirmAlert(
    'Set Airdrop Wallet',
    `Are you sure you want to set ${shortAddress} as your airdrop wallet?`,
    onConfirm
  );
};

/**
 * Navigation helper - Cüzdan ekleme sayfasına git
 * @param {Object} navigation - React Navigation objesi
 */
export const navigateToAddWallet = (navigation) => {
  navigation.navigate('AddWalletScreen');
};

/**
 * Navigation helper - Cüzdan detay sayfasına git
 * @param {Object} navigation - React Navigation objesi
 * @param {Object} wallet - Cüzdan objesi
 */
export const navigateToWalletDetail = (navigation, wallet) => {
  navigation.navigate('WalletDetailScreen', { wallet });
};

/**
 * Loading state yönetimi
 * @param {Function} setLoading - Loading state setter
 * @param {Function} operation - Async operasyon
 * @param {Function} onSuccess - Başarı callback'i
 * @param {Function} onError - Hata callback'i
 */
export const handleAsyncOperation = async (setLoading, operation, onSuccess = null, onError = null) => {
  try {
    setLoading(true);
    const result = await operation();
    
    if (result.success) {
      onSuccess && onSuccess(result.data);
      return result.data;
    } else {
      const errorMessage = getErrorMessage(result.error);
      onError ? onError(errorMessage) : showErrorAlert(errorMessage);
      return null;
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    onError ? onError(errorMessage) : showErrorAlert(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
};

/**
 * Cüzdan listesini yenile
 * @param {Function} setWallets - Wallet state setter
 * @param {Function} setLoading - Loading state setter
 * @param {Function} setError - Error state setter
 */
export const refreshWallets = async (setWallets, setLoading, setError = null) => {
  await handleAsyncOperation(
    setLoading,
    () => walletService.getWallets(),
    (data) => {
      setWallets(data.data.wallets || []);
      setError && setError(null);
    },
    (error) => {
      setError && setError(error);
    }
  );
};

/**
 * Adres doğrulama (real-time)
 * @param {string} address - Doğrulanacak adres
 * @param {string} network - Network
 * @param {Function} setAddressValid - Validation state setter
 * @param {Function} setValidationMessage - Message setter
 */
export const validateAddressRealTime = async (address, network, setAddressValid, setValidationMessage) => {
  // Boş adres kontrolü
  if (!address || address.length < 10) {
    setAddressValid(null);
    setValidationMessage('');
    return;
  }

  // Format kontrolü
  if (!isValidEthereumAddress(address)) {
    setAddressValid(false);
    setValidationMessage('Geçersiz Ethereum adresi formatı');
    return;
  }

  // API ile doğrulama
  try {
    const result = await walletService.validateAddress(network, address);
    
    if (result.success && result.data.data.valid) {
      setAddressValid(true);
      setValidationMessage('Adres geçerli');
    } else {
      setAddressValid(false);
      setValidationMessage(result.data.data.error || 'Adres geçersiz');
    }
  } catch (error) {
    setAddressValid(false);
    setValidationMessage('Adres doğrulanamadı');
  }
};

/**
 * Cüzdan kartı için durum rengi
 * @param {Object} wallet - Cüzdan objesi
 * @returns {string} Renk kodu
 */
export const getWalletStatusColor = (wallet) => {
  if (wallet.isAirdropAddress) return '#f59e0b'; // Airdrop - amber
  return '#10b981'; // Normal - green
};

/**
 * Cüzdan için network ikonunu getir
 * @param {string} network - Network adı
 * @returns {string} Icon emoji
 */
export const getNetworkIcon = (network) => {
  switch (network.toLowerCase()) {
    case 'ethereum':
      return '⟠';
    default:
      return '🔗';
  }
};

/**
 * Para birimini formatla
 * @param {string} amount - Miktar
 * @param {string} currency - Para birimi
 * @returns {string} Formatlanmış miktar
 */
export const formatCurrency = (amount, currency) => {
  if (!amount || isNaN(amount)) return '0';
  
  const numAmount = parseFloat(amount);
  
  // Büyük sayılar için kısaltma
  if (numAmount >= 1000000) {
    return `${(numAmount / 1000000).toFixed(2)}M ${currency}`;
  } else if (numAmount >= 1000) {
    return `${(numAmount / 1000).toFixed(2)}K ${currency}`;
  } else if (numAmount >= 1) {
    return `${numAmount.toFixed(4)} ${currency}`;
  } else {
    return `${numAmount.toFixed(6)} ${currency}`;
  }
};

/**
 * USD değerini formatla
 * @param {string} usdValue - USD değeri
 * @returns {string} Formatlanmış USD değeri
 */
export const formatUSDValue = (usdValue) => {
  if (!usdValue || isNaN(usdValue)) return '$0.00';
  
  const numValue = parseFloat(usdValue);
  
  if (numValue >= 1000000) {
    return `$${(numValue / 1000000).toFixed(2)}M`;
  } else if (numValue >= 1000) {
    return `$${(numValue / 1000).toFixed(2)}K`;
  } else {
    return `$${numValue.toFixed(2)}`;
  }
};

/**
 * Bakiye güncelleme zamanını formatla
 * @param {string} lastUpdated - Son güncelleme tarihi
 * @returns {string} Formatlanmış zaman
 */
export const formatLastUpdated = (lastUpdated) => {
  if (!lastUpdated) return 'Never updated';
  
  try {
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit'
    });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Cüzdan bakiyelerinin toplam USD değerini hesapla
 * @param {Array} balances - Bakiye array'i
 * @returns {string} Toplam USD değeri
 */
export const calculateTotalUSDValue = (balances) => {
  if (!Array.isArray(balances) || balances.length === 0) return '0';
  
  const total = balances.reduce((sum, balance) => {
    const usdValue = parseFloat(balance.usdValue || 0);
    return sum + usdValue;
  }, 0);
  
  return total.toFixed(2);
};

/**
 * Bakiye yenileme handler
 * @param {string} walletId - Cüzdan ID'si  
 * @param {Function} setLoading - Loading state setter
 * @param {Function} onSuccess - Başarı callback'i
 * @param {Function} onError - Hata callback'i
 */
export const handleRefreshBalance = async (walletId, setLoading, onSuccess = null, onError = null) => {
  await handleAsyncOperation(
    setLoading,
    () => walletService.refreshWalletBalance(walletId),
    (data) => {
      onSuccess && onSuccess(data.data.wallet);
    },
    (error) => {
      onError ? onError(error) : showErrorAlert(error);
    }
  );
};
