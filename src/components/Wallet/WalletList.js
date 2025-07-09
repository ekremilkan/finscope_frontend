import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  Dimensions 
} from 'react-native';
import WalletCard from './WalletCard';
import { WALLET_COLORS, EMPTY_STATES } from '../../data/walletData';

const { width } = Dimensions.get('window');

const WalletList = ({ 
  wallets = [], 
  loading = false,
  onRefresh,
  onWalletPress,
  onWalletMenuPress,
  onViewTransactions,
  onSetAirdrop,
  onBalanceRefresh,
  showEmptyState = true
}) => {

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{EMPTY_STATES.noWallets.icon}</Text>
      <Text style={styles.emptyTitle}>{EMPTY_STATES.noWallets.title}</Text>
      <Text style={styles.emptySubtitle}>{EMPTY_STATES.noWallets.subtitle}</Text>
    </View>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <View style={styles.container}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={[styles.skeletonCard, styles.skeleton]}>
          <View style={styles.skeletonHeader}>
            <View style={[styles.skeletonAvatar, styles.skeleton]} />
            <View style={styles.skeletonText}>
              <View style={[styles.skeletonLine, styles.skeletonLineTitle, styles.skeleton]} />
              <View style={[styles.skeletonLine, styles.skeletonLineSubtitle, styles.skeleton]} />
            </View>
          </View>
          <View style={styles.skeletonContent}>
            <View style={[styles.skeletonLine, styles.skeletonLineContent, styles.skeleton]} />
            <View style={[styles.skeletonLine, styles.skeletonLineContent, styles.skeleton]} />
          </View>
        </View>
      ))}
    </View>
  );

  // Ana render
  if (loading && wallets.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[WALLET_COLORS.primary]}
            tintColor={WALLET_COLORS.primary}
            progressBackgroundColor={WALLET_COLORS.cardBackground}
          />
        ) : null
      }
      contentContainerStyle={[
        styles.contentContainer,
        wallets.length === 0 && showEmptyState && styles.emptyContentContainer
      ]}
    >
      {wallets.length === 0 && showEmptyState ? (
        <EmptyState />
      ) : (
        <>
          {/* Wallet Cards */}
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet._id}
              wallet={wallet}
              onPress={onWalletPress}
              onMenuPress={onWalletMenuPress}
              onViewTransactions={onViewTransactions}
              onSetAirdrop={onSetAirdrop}
              onBalanceRefresh={onBalanceRefresh}
            />
          ))}
          
          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WALLET_COLORS.background,
  },
  contentContainer: {
    paddingVertical: Math.max(16, width * 0.04),
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Math.max(32, width * 0.08),
    paddingVertical: Math.max(48, width * 0.12),
  },
  emptyIcon: {
    fontSize: Math.max(64, width * 0.16),
    marginBottom: Math.max(24, width * 0.06),
  },
  emptyTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '600',
    color: WALLET_COLORS.text,
    textAlign: 'center',
    marginBottom: Math.max(12, width * 0.03),
  },
  emptySubtitle: {
    fontSize: Math.max(16, width * 0.04),
    color: WALLET_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: Math.max(24, width * 0.06),
  },
  
  // Loading Skeleton Styles
  skeletonCard: {
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(20, width * 0.05),
    borderWidth: 1,
    borderColor: WALLET_COLORS.border,
    marginHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(8, width * 0.02),
    padding: Math.max(16, width * 0.04),
  },
  skeleton: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
  },
  skeletonAvatar: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    marginRight: Math.max(12, width * 0.03),
  },
  skeletonText: {
    flex: 1,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonLineTitle: {
    width: '60%',
  },
  skeletonLineSubtitle: {
    width: '40%',
  },
  skeletonContent: {
    gap: 8,
  },
  skeletonLineContent: {
    width: '80%',
  },
  
  // Spacing
  bottomSpacing: {
    height: Math.max(32, width * 0.08),
  },
});

export default WalletList; 