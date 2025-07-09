import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatAddressShort } from '../../utils/walletUtils';
import { WALLET_COLORS } from '../../data/walletData';

const { width, height } = Dimensions.get('window');

const WalletActionModal = ({
  visible = false,
  wallet = null,
  onClose,
  onSetAirdrop,
  onRemoveAirdrop,
  onDeleteWallet,
  onViewTransactions
}) => {
  
  if (!wallet) return null;

  const shortAddress = formatAddressShort(wallet.address);
  const isAirdropWallet = wallet.isAirdropAddress;

  // Modal action items
  const actions = [
    {
      id: 'transactions',
      title: 'Transaction History',
      subtitle: 'View transaction history',
      icon: 'history',
      color: WALLET_COLORS.primary,
      onPress: () => {
        onClose();
        onViewTransactions && onViewTransactions(wallet);
      }
    },
    {
      id: 'airdrop',
      title: isAirdropWallet ? 'Remove from Airdrop' : 'Set as Airdrop',
      subtitle: isAirdropWallet 
        ? 'Remove this wallet from airdrop selection' 
        : 'Set this wallet for airdrop',
      icon: isAirdropWallet ? 'star' : 'star-border',
      color: WALLET_COLORS.warning,
      onPress: () => {
        onClose();
        if (isAirdropWallet) {
          onRemoveAirdrop && onRemoveAirdrop(wallet);
        } else {
          onSetAirdrop && onSetAirdrop(wallet);
        }
      }
    },
    {
      id: 'delete',
      title: 'Delete Wallet',
      subtitle: isAirdropWallet 
        ? 'Remove from airdrop first to delete' 
        : 'Permanently delete this wallet',
      icon: 'delete',
      color: WALLET_COLORS.error,
      disabled: isAirdropWallet,
      destructive: true,
      onPress: () => {
        onClose();
        onDeleteWallet && onDeleteWallet(wallet);
      }
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.walletIcon}>
                    <Text style={styles.walletEmoji}>⟠</Text>
                  </View>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletNetwork}>{wallet.network}</Text>
                    <Text style={styles.walletAddress}>{shortAddress}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={20} color={WALLET_COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Airdrop Badge */}
              {isAirdropWallet && (
                <View style={styles.airdropBanner}>
                  <Icon name="star" size={16} color="#ffffff" />
                  <Text style={styles.airdropBannerText}>
                    This wallet is selected for airdrop
                  </Text>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {actions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.actionItem,
                      action.disabled && styles.disabledAction
                    ]}
                    onPress={action.disabled ? null : action.onPress}
                    disabled={action.disabled}
                    activeOpacity={action.disabled ? 1 : 0.7}
                  >
                    <View style={[
                      styles.actionIcon,
                      { backgroundColor: action.disabled 
                          ? 'rgba(148, 163, 184, 0.2)' 
                          : `${action.color}20` 
                      }
                    ]}>
                      <Icon 
                        name={action.icon} 
                        size={20} 
                        color={action.disabled ? WALLET_COLORS.textSecondary : action.color} 
                      />
                    </View>
                    
                    <View style={styles.actionContent}>
                      <Text style={[
                        styles.actionTitle,
                        action.disabled && styles.disabledText
                      ]}>
                        {action.title}
                      </Text>
                      <Text style={[
                        styles.actionSubtitle,
                        action.disabled && styles.disabledText
                      ]}>
                        {action.subtitle}
                      </Text>
                    </View>

                    {!action.disabled && (
                      <Icon 
                        name="chevron-right" 
                        size={16} 
                        color={WALLET_COLORS.textSecondary} 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Footer Info */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Wallet connection date: {formatDate(wallet.createdAt)}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: WALLET_COLORS.cardBackground,
    borderRadius: Math.max(24, width * 0.06),
    borderWidth: 1,
    borderColor: WALLET_COLORS.border,
    marginHorizontal: Math.max(20, width * 0.05),
    maxWidth: Math.min(400, width * 0.9),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.max(20, width * 0.05),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  walletIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: WALLET_COLORS.ethereum,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(12, width * 0.03),
  },
  walletEmoji: {
    fontSize: Math.max(18, width * 0.045),
  },
  walletInfo: {
    flex: 1,
  },
  walletNetwork: {
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
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  airdropBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WALLET_COLORS.warning,
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(16, width * 0.04),
    marginHorizontal: Math.max(20, width * 0.05),
    marginTop: Math.max(16, width * 0.04),
    borderRadius: 12,
    gap: 8,
  },
  airdropBannerText: {
    color: '#ffffff',
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(12, width * 0.03),
    borderRadius: 12,
    marginBottom: Math.max(8, width * 0.02),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  disabledAction: {
    opacity: 0.5,
  },
  actionIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(16, width * 0.04),
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: WALLET_COLORS.text,
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(13, width * 0.033),
  },
  disabledText: {
    color: WALLET_COLORS.textSecondary,
  },
  footer: {
    padding: Math.max(20, width * 0.05),
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
  },
  footerText: {
    color: WALLET_COLORS.textSecondary,
    fontSize: Math.max(12, width * 0.03),
    textAlign: 'center',
  },
});

export default WalletActionModal; 