import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  formatAddressShort, 
  getWalletStatusColor, 
  getNetworkIcon,
  formatCurrency,
  formatUSDValue,
  formatLastUpdated,
  calculateTotalUSDValue,
  handleRefreshBalance
} from '../../utils/walletUtils';
import { WALLET_COLORS } from '../../data/walletData';

const { width } = Dimensions.get('window');

const WalletCard = ({ 
  wallet, 
  onPress, 
  onMenuPress, 
  onViewTransactions,
  onSetAirdrop,
  onBalanceRefresh,
  showMenu = true 
}) => {
  const [refreshing, setRefreshing] = useState(false);
  
  const statusColor = getWalletStatusColor(wallet);
  const networkIcon = getNetworkIcon(wallet.network);
  const shortAddress = formatAddressShort(wallet.address);
  
  // Bakiye bilgileri
  const hasBalances = wallet.balances && wallet.balances.length > 0;
  const totalUsdValue = wallet.totalUsdValue || calculateTotalUSDValue(wallet.balances || []);
  const primaryBalance = hasBalances ? wallet.balances[0] : null;

  // Bakiye yenileme handler
  const handleRefreshBalanceClick = async () => {
    if (refreshing) return;
    
    await handleRefreshBalance(
      wallet._id,
      setRefreshing,
      (updatedWallet) => {
        // Parent'e güncellenmiş wallet'ı gönder
        onBalanceRefresh && onBalanceRefresh(updatedWallet);
      }
    );
  };

  // Transaction history handler
  const handleViewTransactions = () => {
    if (onViewTransactions) {
      onViewTransactions(wallet);
    } else {
      console.log('Transaction History:', wallet._id);
    }
  };

  // Airdrop selection handler
  const handleSetAirdrop = () => {
    if (onSetAirdrop && !wallet.isAirdropAddress) {
      onSetAirdrop(wallet);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress && onPress(wallet)}
      activeOpacity={0.8}
    >
      {/* Airdrop Badge */}
      {wallet.isAirdropAddress && (
        <View style={styles.airdropBadge}>
          <Icon name="star" size={12} color="#ffffff" />
          <Text style={styles.airdropText}>Airdrop</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.networkIcon, { backgroundColor: statusColor }]}>
            <Text style={styles.networkEmoji}>{networkIcon}</Text>
          </View>
          <View style={styles.networkInfo}>
            <Text style={styles.networkName}>{wallet.network}</Text>
            <Text style={styles.walletAddress}>{shortAddress}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {/* Bakiye yenileme butonu */}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefreshBalanceClick}
            disabled={refreshing}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={WALLET_COLORS.primary} />
            ) : (
              <Icon name="refresh" size={18} color={WALLET_COLORS.primary} />
            )}
          </TouchableOpacity>

          {showMenu && (
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => onMenuPress && onMenuPress(wallet)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="more-vert" size={20} color={WALLET_COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <View style={styles.totalBalance}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalValue}>
            {formatUSDValue(totalUsdValue)}
          </Text>
        </View>

        {hasBalances && primaryBalance && (
          <View style={styles.primaryCurrency}>
            <Text style={styles.currencyAmount}>
              {formatCurrency(primaryBalance.amount, primaryBalance.currency)}
            </Text>
            <Text style={styles.currencyUsd}>
              {formatUSDValue(primaryBalance.usdValue)}
            </Text>
          </View>
        )}

        {!hasBalances && (
          <View style={styles.noBalance}>
            <Text style={styles.noBalanceText}>No balance data</Text>
            <Text style={styles.noBalanceSubtext}>Tap refresh to load balance</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.infoValue, { color: statusColor }]}>
                {wallet.isAirdropAddress ? 'Airdrop Wallet' : 'Active'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>
              {formatLastUpdated(wallet.lastBalanceCheck)}
            </Text>
          </View>
        </View>

        {/* Multiple currencies display */}
        {hasBalances && wallet.balances.length > 1 && (
          <View style={styles.currencyList}>
            <Text style={styles.currencyListTitle}>
              +{wallet.balances.length - 1} more currencies
            </Text>
            <View style={styles.currencyRow}>
              {wallet.balances.slice(1, 3).map((balance, index) => (
                <Text key={index} style={styles.currencyItem}>
                  {balance.currency}: {formatCurrency(balance.amount, balance.currency)}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryAction]}
            onPress={handleViewTransactions}
            activeOpacity={0.7}
          >
            <Icon name="history" size={16} color="#ffffff" />
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>

          {!wallet.isAirdropAddress && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={handleSetAirdrop}
              activeOpacity={0.7}
            >
              <Icon name="star-border" size={16} color={WALLET_COLORS.warning} />
              <Text style={[styles.actionText, { color: WALLET_COLORS.warning }]}>
                Set Airdrop
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Helper function - format date
const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Unknown';
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(20, width * 0.05),
    borderWidth: 1,
    borderColor: WALLET_COLORS.border,
    marginHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(8, width * 0.02),
    padding: Math.max(16, width * 0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  airdropBadge: {
    position: 'absolute',
    top: -8,
    right: Math.max(16, width * 0.04),
    backgroundColor: WALLET_COLORS.warning,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: WALLET_COLORS.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  airdropText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
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
    color: WALLET_COLORS.text,
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    marginBottom: 2,
  },
  walletAddress: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(13, width * 0.033),
    fontFamily: 'monospace',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: Math.max(8, width * 0.02),
  },
  balanceSection: {
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: WALLET_COLORS.border,
    padding: Math.max(12, width * 0.03),
    marginBottom: Math.max(16, width * 0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalBalance: {
    alignItems: 'center',
    marginBottom: Math.max(12, width * 0.03),
  },
  totalLabel: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(12, width * 0.03),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    color: WALLET_COLORS.text,
    fontSize: Math.max(24, width * 0.06),
    fontWeight: '700',
    marginTop: 4,
  },
  primaryCurrency: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(12, width * 0.03),
  },
  currencyAmount: {
    color: WALLET_COLORS.text,
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '600',
  },
  currencyUsd: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(14, width * 0.035),
  },
  noBalance: {
    alignItems: 'center',
    paddingVertical: Math.max(16, width * 0.04),
  },
  noBalanceText: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(14, width * 0.035),
    marginBottom: 4,
  },
  noBalanceSubtext: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(12, width * 0.03),
  },
  currencyList: {
    marginTop: Math.max(12, width * 0.03),
  },
  currencyListTitle: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(12, width * 0.03),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currencyItem: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(13, width * 0.033),
    fontWeight: '500',
  },
  content: {
    gap: Math.max(16, width * 0.04),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(12, width * 0.03),
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: WALLET_COLORS.text,
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
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
  actions: {
    flexDirection: 'row',
    gap: Math.max(12, width * 0.03),
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(10, width * 0.025),
    paddingHorizontal: Math.max(16, width * 0.04),
    borderRadius: Math.max(12, width * 0.03),
    gap: 6,
  },
  primaryAction: {
    backgroundColor: WALLET_COLORS.primary,
  },
  secondaryAction: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  actionText: {
    color: '#ffffff',
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '500',
  },
});

export default WalletCard;


