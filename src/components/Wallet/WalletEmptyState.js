import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const WalletEmptyState = ({ onConnectWallet }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You haven't connected any wallets yet</Text>
      
      <Text style={styles.description}>
        To perform your financial transactions, you first need to connect a wallet. 
        MetaMask, Trust Wallet, and Coinbase Wallet are supported.
      </Text>
      
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureText}>Secure connection</Text>
        </View>
        
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Fast transactions</Text>
        </View>
        
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🌐</Text>
          <Text style={styles.featureText}>Multi-chain support</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.connectButton}
        onPress={onConnectWallet}
        activeOpacity={0.8}
      >
        <Text style={styles.connectButtonText}>Connect Your First Wallet</Text>
      </TouchableOpacity>
      
      <Text style={styles.limitText}>You can connect up to 3 wallets</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(40, width * 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Math.max(22, width * 0.06),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  description: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    marginBottom: Math.max(24, width * 0.06),
    textAlign: 'center',
    maxWidth: 380,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Math.max(40, width * 0.1),
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: Math.max(36, width * 0.1),
    marginBottom: Math.max(12, width * 0.03),
  },
  featureText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    fontWeight: '600',
    textAlign: 'center',
  },
  connectButton: {
    backgroundColor: '#6366f1',
    paddingVertical: Math.max(14, width * 0.04),
    paddingHorizontal: Math.max(60, width * 0.15),
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#4f46e5',
    marginBottom: Math.max(24, width * 0.06),
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: Math.max(16, width * 0.045),
    fontWeight: '700',
  },
  limitText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#64748b',
  },
});

export default WalletEmptyState;
