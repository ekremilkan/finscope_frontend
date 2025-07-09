/**
 * Wallet Data - Static data and configurations
 * Static data required for Finscope Wallet features
 */

// Ethereum network information
export const ETHEREUM_NETWORK = {
  id: 'ethereum',
  name: 'Ethereum',
  symbol: 'ETH',
  chainId: 1,
  color: '#627eea',
  icon: '⟠',
  rpcUrl: 'https://mainnet.infura.io/v3/',
  explorerUrl: 'https://etherscan.io/',
  isTestnet: false
};

// Supported networks (only Ethereum for now)
export const SUPPORTED_NETWORKS = [ETHEREUM_NETWORK];

// Wallet limits and configurations
export const WALLET_CONFIG = {
  maxWalletsPerNetwork: 3,
  addressValidationEnabled: true,
  airdropRequired: true,
  defaultNetwork: 'Ethereum'
};

// Wallet types
export const WALLET_TYPES = {
  EXTERNAL: 'external',
  IMPORTED: 'imported',
  CONNECTED: 'connected'
};

// Wallet statuses
export const WALLET_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  ERROR: 'error'
};

// Transaction types
export const TRANSACTION_TYPES = {
  SEND: 'send',
  RECEIVE: 'receive',
  SWAP: 'swap',
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  AIRDROP: 'airdrop',
  OTHER: 'other'
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
};

// Empty state messages
export const EMPTY_STATES = {
  noWallets: {
    title: 'No wallets yet',
    subtitle: 'Connect your first wallet to get started',
    icon: '👛',
    actionText: 'Connect Wallet'
  },
  noTransactions: {
    title: 'No transaction history',
    subtitle: 'No transactions have been made with this wallet yet',
    icon: '📋',
    actionText: 'Refresh'
  }
};

// Error messages
export const ERROR_MESSAGES = {
  networkError: 'Network connection error. Please check your internet connection.',
  invalidAddress: 'Invalid wallet address. Please use the correct format.',
  addressExists: 'This wallet address has already been added.',
  maxWalletsReached: 'Maximum number of wallets reached for this network (3).',
  airdropWalletRequired: 'At least one wallet must be selected for airdrop.',
  unauthorized: 'Your session has expired. Please log in again.',
  serverError: 'Server error. Please try again later.',
  deleteAirdropWallet: 'Please select another wallet before deleting the airdrop wallet.',
  unknownError: 'An unknown error occurred.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  walletConnected: 'Wallet connected successfully',
  walletDeleted: 'Wallet deleted successfully',
  airdropSet: 'Airdrop wallet set successfully',
  airdropRemoved: 'Airdrop wallet removed successfully',
  addressValid: 'Wallet address is valid'
};

// Loading messages
export const LOADING_MESSAGES = {
  validatingAddress: 'Validating address...',
  connectingWallet: 'Connecting wallet...',
  loadingWallets: 'Loading wallets...',
  deletingWallet: 'Deleting wallet...',
  settingAirdrop: 'Setting airdrop wallet...',
  removingAirdrop: 'Removing airdrop wallet...',
  loadingTransactions: 'Loading transactions...'
};

// Wallet card colors (tema uyumlu)
export const WALLET_COLORS = {
  background: '#0a0f1c',
  cardBackground: 'rgba(30, 41, 59, 0.8)',
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  ethereum: '#627eea',
  airdrop: '#f59e0b',
  text: '#ffffff',
  textSecondary: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.2)'
};

// Cüzdan ikonları
export const WALLET_ICONS = {
  ethereum: '⟠',
  airdrop: '💫',
  connected: '🔗',
  active: '✅',
  inactive: '⏸️',
  pending: '⏳',
  error: '❌'
};

// Form validasyon kuralları
export const VALIDATION_RULES = {
  address: {
    required: true,
    minLength: 26,
    maxLength: 100,
    ethereumRegex: /^0x[a-fA-F0-9]{40}$/
  },
  network: {
    required: true,
    allowedValues: ['Ethereum']
  }
};

// Responsive breakpoints
export const RESPONSIVE = {
  small: 360,
  medium: 768,
  large: 1024
};

// Animation durations (ms)
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  refresh: 1000
};

// Default wallet data (demo/test için)
export const DEFAULT_WALLET_DATA = {
  wallets: [],
  totalCount: 0,
  airdropWallet: null,
  loading: false,
  error: null,
  lastUpdated: null
};

// Pagination ayarları
export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 20,
  maxLimit: 50
};

// App constants
export const APP_CONSTANTS = {
  refreshInterval: 30000, // 30 saniye
  maxRetryAttempts: 3,
  retryDelay: 2000 // 2 saniye
};
