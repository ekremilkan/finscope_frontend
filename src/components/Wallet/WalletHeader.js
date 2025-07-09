import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WALLET_COLORS } from '../../data/walletData';

const { width } = Dimensions.get('window');

const WalletHeader = ({ 
  title = 'My Wallets',
  walletCount = 0,
  maxWallets = 3,
  onAddPress,
  onSettingsPress,
  onRefreshAllPress,
  showAddButton = true,
  showSettings = false,
  showRefreshAll = true
}) => {

  const canAddWallet = walletCount < maxWallets;
  const hasWallets = walletCount > 0;
  
  return (
    <View style={styles.container}>
      {/* Main title section */}
      <View style={styles.titleSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>
              {walletCount}/{maxWallets}
            </Text>
          </View>
        </View>
        
        {walletCount > 0 && (
          <Text style={styles.subtitle}>
            {walletCount === 1 
              ? '1 wallet connected' 
              : `${walletCount} wallets connected`
            }
          </Text>
        )}
      </View>

      {/* Right side buttons */}
      <View style={styles.actions}>
        {showRefreshAll && hasWallets && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefreshAllPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="refresh" size={18} color={WALLET_COLORS.primary} />
          </TouchableOpacity>
        )}

        {showSettings && (
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={onSettingsPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="settings" size={20} color={WALLET_COLORS.textSecondary} />
          </TouchableOpacity>
        )}

        {showAddButton && (
          <TouchableOpacity 
            style={[
              styles.addButton, 
              !canAddWallet && styles.disabledButton
            ]}
            onPress={canAddWallet ? onAddPress : null}
            disabled={!canAddWallet}
            activeOpacity={canAddWallet ? 0.7 : 1}
          >
            <Icon 
              name="add" 
              size={20} 
              color={canAddWallet ? '#ffffff' : WALLET_COLORS.textSecondary} 
            />
            <Text style={[
              styles.addButtonText,
              !canAddWallet && styles.disabledButtonText
            ]}>
              Add
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: WALLET_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
    minHeight: Math.max(80, width * 0.2),
  },
  titleSection: {
    flex: 1,
    paddingRight: Math.max(16, width * 0.04),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(4, width * 0.01),
  },
  title: {
    fontSize: Math.max(24, width * 0.06),
    fontWeight: '700',
    color: WALLET_COLORS.text,
    marginRight: Math.max(12, width * 0.03),
  },
  countContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 12,
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, width * 0.01),
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  countText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
    color: WALLET_COLORS.primary,
  },
  subtitle: {
    fontSize: Math.max(14, width * 0.035),
    color: WALLET_COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(12, width * 0.03),
  },
  settingsButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WALLET_COLORS.primary,
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(10, width * 0.025),
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: WALLET_COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
  },
  disabledButtonText: {
    color: WALLET_COLORS.textSecondary,
  },
  refreshButton: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default WalletHeader;
