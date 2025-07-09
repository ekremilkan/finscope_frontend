import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Data imports
import { 
  WALLET_COLORS, 
  WALLET_CONFIG, 
  ETHEREUM_NETWORK,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES 
} from '../../data/walletData';

// Utils imports
import {
  validateWalletConnection,
  validateAddressRealTime,
  showSuccessAlert,
  showErrorAlert,
  handleAsyncOperation
} from '../../utils/walletUtils';

// Service imports
import walletService from '../../services/walletService';

const { width } = Dimensions.get('window');

const AddWalletScreen = ({ navigation }) => {
  // State management
  const [address, setAddress] = useState('');
  const [addressValid, setAddressValid] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userWallets, setUserWallets] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Network sabitlendi (şimdilik sadece Ethereum)
  const selectedNetwork = ETHEREUM_NETWORK.name;

  // Authentication kontrolü
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Component mount - mevcut cüzdanları yükle (authenticated ise)
  useEffect(() => {
    if (isAuthenticated === true) {
      loadUserWallets();
    }
  }, [isAuthenticated]);

  // Form validasyon kontrolü
  useEffect(() => {
    setFormValid(address.length > 0 && addressValid === true);
  }, [address, addressValid]);

  // Authentication kontrolü
  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      const authenticated = !!(token || refreshToken);
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        // Auth olmayan kullanıcıyı geri gönder
        navigation.goBack();
        showErrorAlert('Cüzdan bağlamak için giriş yapmanız gerekiyor');
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
      navigation.goBack();
      showErrorAlert('Kimlik doğrulama hatası');
    }
  };

  // Kullanıcının mevcut cüzdanlarını yükle
  const loadUserWallets = async () => {
    try {
      const result = await walletService.getWallets();
      if (result.success) {
        setUserWallets(result.data.data.wallets || []);
      }
    } catch (error) {
      console.log('Mevcut cüzdanlar yüklenemedi:', error);
    }
  };

  // Loading screen for auth check
  if (isAuthenticated === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={WALLET_COLORS.primary} />
          <Text style={styles.loadingText}>Authenticating...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If not authenticated, this screen shouldn't be accessible
  // But just in case, show error and go back
  if (isAuthenticated === false) {
    navigation.goBack();
    return null;
  }

  // Address change handler
  const handleAddressChange = (text) => {
    setAddress(text);
    
    // Real-time validation (debounced)
    clearTimeout(handleAddressChange.timeoutId);
    handleAddressChange.timeoutId = setTimeout(() => {
      validateAddressRealTime(
        text, 
        selectedNetwork, 
        setAddressValid, 
        setValidationMessage
      );
    }, 500);
  };

  // Clear address
  const handleClearAddress = () => {
    setAddress('');
    setAddressValid(null);
    setValidationMessage('');
  };

  // Connect wallet operation
  const handleConnectWallet = async () => {
    if (!formValid) return;

    // Client-side validation
    const validation = validateWalletConnection(userWallets, selectedNetwork, address);
    if (!validation.isValid) {
      showErrorAlert(validation.error);
      return;
    }

    // Connect wallet via API
    await handleAsyncOperation(
      setLoading,
      () => walletService.connectWallet(selectedNetwork, address),
      (data) => {
        // Success
        showSuccessAlert(
          SUCCESS_MESSAGES.walletConnected,
          () => {
            // Go back to main screen and refresh list
            navigation.goBack();
          }
        );
      },
      (error) => {
        showErrorAlert(error);
      }
    );
  };

  // Go back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Network info component
  const NetworkInfo = () => (
    <View style={styles.networkContainer}>
      <View style={styles.networkHeader}>
        <View style={styles.networkIcon}>
          <Text style={styles.networkEmoji}>{ETHEREUM_NETWORK.icon}</Text>
        </View>
        <View style={styles.networkInfo}>
          <Text style={styles.networkName}>{ETHEREUM_NETWORK.name}</Text>
          <Text style={styles.networkSubtitle}>Mainnet Network</Text>
        </View>
        <View style={styles.networkBadge}>
          <Text style={styles.networkBadgeText}>Selected</Text>
        </View>
      </View>
      
      <View style={styles.networkDetails}>
        <Text style={styles.networkDetailText}>
          • Address format: 0x + 40 hex characters
        </Text>
        <Text style={styles.networkDetailText}>
          • EIP-55 Checksum supported
        </Text>
        <Text style={styles.networkDetailText}>
          • Maximum {WALLET_CONFIG.maxWalletsPerNetwork} wallets can be connected
        </Text>
      </View>
    </View>
  );

  // Address input component
  const AddressInput = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Wallet Address</Text>
      
      <View style={[
        styles.inputWrapper,
        addressValid === true && styles.inputSuccess,
        addressValid === false && styles.inputError
      ]}>
        <TextInput
          style={styles.textInput}
          value={address}
          onChangeText={handleAddressChange}
          placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
          placeholderTextColor={WALLET_COLORS.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={false}
          selectTextOnFocus={true}
        />
        
        {address.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearAddress}
          >
            <Icon name="clear" size={20} color={WALLET_COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Validation message */}
      {validationMessage.length > 0 && (
        <View style={[
          styles.validationContainer,
          addressValid === true && styles.validationSuccess,
          addressValid === false && styles.validationError
        ]}>
          <Icon 
            name={addressValid === true ? 'check-circle' : 'error'} 
            size={16} 
            color={addressValid === true ? WALLET_COLORS.success : WALLET_COLORS.error} 
          />
          <Text style={[
            styles.validationText,
            addressValid === true && styles.validationTextSuccess,
            addressValid === false && styles.validationTextError
          ]}>
            {validationMessage}
          </Text>
        </View>
      )}
    </View>
  );

  // Action buttons component
  const ActionButtons = () => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleGoBack}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.primaryButton,
          (!formValid || loading) && styles.disabledButton
        ]}
        onPress={handleConnectWallet}
        disabled={!formValid || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.primaryButtonText}>Connect Wallet</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
            disabled={loading}
          >
            <Icon name="arrow-back" size={24} color={WALLET_COLORS.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Connect Wallet</Text>
            <Text style={styles.headerSubtitle}>
              Enter your Ethereum wallet address
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <NetworkInfo />
          <AddressInput />
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={WALLET_COLORS.primary} />
              <Text style={styles.loadingText}>
                {LOADING_MESSAGES.connectingWallet}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <ActionButtons />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WALLET_COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  backButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    marginLeft: Math.max(16, width * 0.04),
  },
  headerTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: WALLET_COLORS.text,
  },
  headerSubtitle: {
    fontSize: Math.max(14, width * 0.035),
    color: WALLET_COLORS.textSecondary,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Math.max(20, width * 0.05),
    gap: Math.max(24, width * 0.06),
  },
  
  // Network Info Styles
  networkContainer: {
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: WALLET_COLORS.border,
    padding: Math.max(16, width * 0.04),
  },
  networkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(12, width * 0.03),
  },
  networkIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: WALLET_COLORS.ethereum,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(12, width * 0.03),
  },
  networkEmoji: {
    fontSize: Math.max(18, width * 0.045),
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: WALLET_COLORS.text,
  },
  networkSubtitle: {
    fontSize: Math.max(12, width * 0.03),
    color: WALLET_COLORS.textSecondary,
  },
  networkBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  networkBadgeText: {
    fontSize: Math.max(10, width * 0.025),
    fontWeight: '600',
    color: WALLET_COLORS.success,
  },
  networkDetails: {
    gap: 4,
  },
  networkDetailText: {
    fontSize: Math.max(12, width * 0.03),
    color: WALLET_COLORS.textSecondary,
  },
  
  // Input Styles
  inputContainer: {
    gap: Math.max(8, width * 0.02),
  },
  inputLabel: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: WALLET_COLORS.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 2,
    borderColor: WALLET_COLORS.border,
    paddingHorizontal: Math.max(16, width * 0.04),
    minHeight: Math.max(56, width * 0.14),
  },
  inputSuccess: {
    borderColor: WALLET_COLORS.success,
  },
  inputError: {
    borderColor: WALLET_COLORS.error,
  },
  textInput: {
    flex: 1,
    fontSize: Math.max(14, width * 0.035),
    color: WALLET_COLORS.text,
    fontFamily: 'monospace',
  },
  clearButton: {
    padding: 8,
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  validationText: {
    fontSize: Math.max(12, width * 0.03),
    flex: 1,
  },
  validationTextSuccess: {
    color: WALLET_COLORS.success,
  },
  validationTextError: {
    color: WALLET_COLORS.error,
  },
  
  // Loading Styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.max(16, width * 0.04),
    gap: 8,
  },
  loadingText: {
    fontSize: Math.max(14, width * 0.035),
    color: WALLET_COLORS.textSecondary,
  },
  
  // Button Styles
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    gap: Math.max(12, width * 0.03),
  },
  button: {
    flex: 1,
    height: Math.max(48, width * 0.12),
    borderRadius: Math.max(12, width * 0.03),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: WALLET_COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  disabledButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: WALLET_COLORS.textSecondary,
  },
});

export default AddWalletScreen; 