import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { WALLET_COLORS } from '../../data/walletData';
import { getFontFamily } from '../../constants/fontConstants';
import { COLORS } from '../../constants/colorConstants';

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
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SECONDARY,
  },
  titleSection: {
    flex: 1,
    marginRight: Math.max(16, width * 0.04),
  },
  logoContainer: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    marginBottom: Math.max(8, width * 0.02),
    borderRadius: Math.max(6, width * 0.015),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  logo: {
    width: Math.max(24, width * 0.06),
    height: Math.max(24, width * 0.06),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(4, width * 0.01),
  },
  title: {
    fontSize: Math.max(20, Math.min(24, width * 0.06)),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginRight: Math.max(8, width * 0.02),
  },
  countContainer: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, width * 0.01),
    borderRadius: Math.max(12, width * 0.03),
  },
  countText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
  },
  subtitle: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Math.max(8, width * 0.02),
  },
  refreshButton: {
    width: Math.max(36, width * 0.09),
    height: Math.max(36, width * 0.09),
    borderRadius: Math.max(18, width * 0.045),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  settingsButton: {
    width: Math.max(36, width * 0.09),
    height: Math.max(36, width * 0.09),
    borderRadius: Math.max(18, width * 0.045),
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(8, width * 0.02),
    borderRadius: Math.max(16, width * 0.04),
    gap: Math.max(4, width * 0.01),
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SECONDARY,
  },
  disabledButtonText: {
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
  },
});

export default WalletHeader;
