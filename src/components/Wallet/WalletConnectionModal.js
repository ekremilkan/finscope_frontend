import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { WALLET_DATA } from '../../data/walletData';
import { connectWallet, connectMetaMask, showErrorAlert, showSuccessAlert } from '../../utils/walletUtils';

const { width, height } = Dimensions.get('window');

const WalletConnectionModal = ({ visible, onClose, onWalletConnected }) => {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleWalletConnection = async (walletType) => {
    setConnecting(true);
    setSelectedWallet(walletType);
    
    try {
      let result;
      
      if (walletType === 'metamask') {
        result = await connectMetaMask();
      } else {
        // General connection for other wallet types
        result = await connectWallet(walletType, 'mock_address');
      }
      
      if (result.success) {
        showSuccessAlert('Success', 'Wallet connected successfully!');
        onWalletConnected(result);
        onClose();
      } else {
        showErrorAlert('Error', result.error || 'Wallet connection failed');
      }
    } catch (error) {
      showErrorAlert('Error', 'An unexpected error occurred');
    } finally {
      setConnecting(false);
      setSelectedWallet(null);
    }
  };

  const renderWalletOption = (wallet) => (
    <TouchableOpacity
      key={wallet.id}
      style={[
        styles.walletOption,
        connecting && selectedWallet === wallet.id && styles.walletOptionConnecting,
      ]}
      onPress={() => handleWalletConnection(wallet.id)}
      disabled={connecting || !wallet.isSupported}
      activeOpacity={0.8}
    >
      <View style={styles.walletOptionContent}>
        <View style={[styles.walletIconContainer, { backgroundColor: wallet.color }]}>
          <Text style={styles.walletOptionIcon}>{wallet.icon}</Text>
        </View>
        
        <View style={styles.walletOptionInfo}>
          <Text style={styles.walletOptionName}>{wallet.name}</Text>
          <Text style={styles.walletOptionDescription}>{wallet.description}</Text>
        </View>
        
        {connecting && selectedWallet === wallet.id ? (
          <ActivityIndicator size="small" color="#6366f1" />
        ) : (
          <Text style={styles.walletOptionArrow}>→</Text>
        )}
      </View>
      
      {!wallet.isSupported && (
        <View style={styles.unsupportedOverlay}>
          <Text style={styles.unsupportedText}>Coming Soon</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Connect Wallet</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={connecting}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Select one of the supported wallets
            </Text>
            
            <View style={styles.walletsContainer}>
              {WALLET_DATA.supportedWallets.map(renderWalletOption)}
            </View>
            
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>🔒 Security Features</Text>
              {WALLET_DATA.securityFeatures.map((feature, index) => (
                <View key={index} style={styles.securityFeature}>
                  <Text style={styles.securityFeatureText}>• {feature}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.networkSupport}>
              <Text style={styles.networkTitle}>🌐 Supported Networks</Text>
              <View style={styles.networkList}>
                {WALLET_DATA.networkSupport.map((network) => (
                  <View key={network.id} style={styles.networkItem}>
                    <View style={[styles.networkDot, { backgroundColor: network.color }]} />
                    <Text style={styles.networkName}>{network.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Text style={styles.footerText}>
              By connecting a wallet, you agree to the terms of service
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0a0f1c',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Math.max(24, width * 0.06),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  modalTitle: {
    fontSize: Math.max(20, Math.min(24, width * 0.055)),
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: Math.max(32, width * 0.08),
    height: Math.max(32, width * 0.08),
    borderRadius: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Math.max(20, width * 0.05),
    color: '#94a3b8',
    fontWeight: '300',
  },
  modalContent: {
    flex: 1,
    padding: Math.max(24, width * 0.06),
  },
  modalSubtitle: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: '#94a3b8',
    marginBottom: Math.max(24, width * 0.06),
    textAlign: 'center',
  },
  walletsContainer: {
    marginBottom: Math.max(32, width * 0.08),
  },
  walletOption: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: Math.max(16, width * 0.04),
    overflow: 'hidden',
  },
  walletOptionConnecting: {
    borderColor: 'rgba(99, 102, 241, 0.5)',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  walletOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Math.max(16, width * 0.04),
  },
  walletIconContainer: {
    width: Math.max(48, width * 0.12),
    height: Math.max(48, width * 0.12),
    borderRadius: Math.max(24, width * 0.06),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(12, width * 0.03),
  },
  walletOptionIcon: {
    fontSize: Math.max(24, width * 0.06),
  },
  walletOptionInfo: {
    flex: 1,
  },
  walletOptionName: {
    fontSize: Math.max(16, Math.min(20, width * 0.045)),
    fontWeight: '700',
    color: '#ffffff',
  },
  walletOptionDescription: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: '#94a3b8',
  },
  walletOptionArrow: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
  },
  unsupportedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unsupportedText: {
    fontWeight: '700',
    fontSize: Math.max(18, width * 0.045),
    color: '#ef4444',
    textTransform: 'uppercase',
  },
  securityInfo: {
    marginBottom: Math.max(24, width * 0.06),
  },
  securityTitle: {
    fontWeight: '700',
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    marginBottom: Math.max(8, width * 0.02),
  },
  securityFeature: {
    marginLeft: Math.max(16, width * 0.04),
    marginBottom: Math.max(4, width * 0.01),
  },
  securityFeatureText: {
    fontSize: Math.max(12, width * 0.035),
    color: '#94a3b8',
  },
  networkSupport: {
    marginBottom: Math.max(24, width * 0.06),
  },
  networkTitle: {
    fontWeight: '700',
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    marginBottom: Math.max(8, width * 0.02),
  },
  networkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Math.max(16, width * 0.04),
    marginBottom: Math.max(8, width * 0.02),
  },
  networkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Math.max(6, width * 0.015),
  },
  networkName: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
  },
  modalFooter: {
    padding: Math.max(16, width * 0.04),
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  footerText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#64748b',
    textAlign: 'center',
  },
});

export default WalletConnectionModal;
