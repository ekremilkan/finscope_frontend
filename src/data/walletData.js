// src/data/walletData.js
export const WALLET_DATA = {
  maxWallets: 3,
  supportedWallets: [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      color: '#f6851b',
      description: 'The most popular Ethereum wallet',
      isSupported: true
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      icon: '🛡️',
      color: '#3375bb',
      description: 'Mobile-focused multi-chain wallet',
      isSupported: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '💙',
      color: '#0052ff',
      description: 'Official wallet of Coinbase',
      isSupported: true
    }
  ],
  walletFeatures: [
    {
      id: 'balance',
      title: 'Balance Viewing',
      icon: '💰',
      description: 'View all token balances'
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      icon: '📜',
      description: 'Track send and receive transactions'
    },
    {
      id: 'defi',
      title: 'DeFi Integration',
      icon: '🏦',
      description: 'Opportunities for yield farming and staking'
    }
  ],
  securityFeatures: [
    'End-to-end encryption',
    'Biometric authentication',
    'Multi-signature support',
    'Hardware wallet integration'
  ],
  networkSupport: [
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      color: '#627eea',
      chainId: '0x1'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      color: '#8247e5',
      chainId: '0x89'
    },
    {
      id: 'bsc',
      name: 'Binance Smart Chain',
      symbol: 'BNB',
      color: '#f3ba2f',
      chainId: '0x38'
    }
  ]
};

export const WALLET_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

export const MOCK_CONNECTED_WALLETS = [
  {
    id: 'wallet_1',
    address: '0x1234...5678',
    walletType: 'metamask',
    balance: '2.45 ETH',
    usdValue: '$4,321.50',
    network: 'ethereum',
    status: WALLET_STATES.CONNECTED,
    connectedAt: new Date().toISOString()
  },
  {
    id: 'wallet_2',
    address: '0x9876...4321',
    walletType: 'trustwallet',
    balance: '1,250 MATIC',
    usdValue: '$892.75',
    network: 'polygon',
    status: WALLET_STATES.CONNECTED,
    connectedAt: new Date().toISOString()
  }
];

export const WALLET_ACTIONS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  REFRESH: 'refresh',
  VIEW_DETAILS: 'view_details',
  SEND: 'send',
  RECEIVE: 'receive'
};
