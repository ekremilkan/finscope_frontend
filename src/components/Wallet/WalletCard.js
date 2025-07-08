import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { formatWalletAddress, formatBalance } from '../../utils/walletUtils';
import { WALLET_DATA } from '../../data/walletData';

const { width } = Dimensions.get('window');

const WalletCard = ({ wallet, onPress, onDisconnect, onRefresh }) => {
  const walletInfo = WALLET_DATA.supportedWallets.find(w => w.id === wallet.walletType);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(wallet.id)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.walletInfo}>
          <View style={[styles.iconContainer, { backgroundColor: walletInfo?.color || '#6366f1' }]}>
            <Text style={styles.walletIcon}>{walletInfo?.icon || '💰'}</Text>
          </View>
          <View style={styles.walletDetails}>
            <Text style={styles.walletName}>{walletInfo?.name || 'Unknown Wallet'}</Text>
            <Text style={styles.walletAddress}>{formatWalletAddress(wallet.address)}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.disconnectButton}
          onPress={() => onDisconnect(wallet.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.disconnectIcon}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <Text style={styles.balanceAmount}>{wallet.balance || '0.00'}</Text>
        <Text style={styles.balanceUsd}>{wallet.usdValue || '$0.00'}</Text>
      </View>
      
      <View style={styles.networkContainer}>
        <View style={styles.networkBadge}>
          <Text style={styles.networkText}>{wallet.network?.toUpperCase() || 'ETH'}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.statusText}>Connected</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <Text style={styles.actionIcon}>📥</Text>
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onRefresh(wallet.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    padding: Math.max(20, width * 0.05),
    marginHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(8, width * 0.02),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: Math.max(48, width * 0.12),
    height: Math.max(48, width * 0.12),
    borderRadius: Math.max(24, width * 0.06),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(12, width * 0.03),
  },
  walletIcon: {
    fontSize: Math.max(24, width * 0.06),
  },
  walletDetails: {
    flex: 1,
  },
  walletName: {
    fontSize: Math.max(16, Math.min(20, width * 0.045)),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  disconnectButton: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    borderRadius: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disconnectIcon: {
    fontSize: Math.max(18, width * 0.045),
    color: '#ef4444',
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  balanceLabel: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: '#94a3b8',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: Math.max(24, Math.min(32, width * 0.07)),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  balanceUsd: {
    fontSize: Math.max(14, Math.min(18, width * 0.04)),
    color: '#10b981',
    fontWeight: '600',
  },
  networkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
  },
  networkBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 12,
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, width * 0.015),
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  networkText: {
    fontSize: Math.max(10, Math.min(12, width * 0.03)),
    color: '#6366f1',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: '#10b981',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Math.max(12, width * 0.03),
    marginHorizontal: Math.max(4, width * 0.01),
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  actionIcon: {
    fontSize: Math.max(16, width * 0.04),
    marginBottom: 4,
  },
  actionText: {
    fontSize: Math.max(10, Math.min(12, width * 0.03)),
    color: '#94a3b8',
    fontWeight: '500',
  },
});

export default WalletCard;
