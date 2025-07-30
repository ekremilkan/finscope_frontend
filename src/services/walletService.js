import api from './api';

/**
 * Wallet Service - Finscope Wallet API operations
 * Manages all wallet-related API calls
 */
class WalletService {
  
  /**
   * Address validation - No auth required
   * @param {string} network - Blockchain network (e.g., "Ethereum")
   * @param {string} address - Wallet address
   * @returns {Promise} API response
   */
  async validateAddress(network, address) {
    try {
      const response = await api.post('/wallets/validate-address', {
        network,
        address
      });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Address validation error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get supported networks - No auth required
   * @returns {Promise} Supported blockchain networks
   */
  async getSupportedNetworks() {
    try {
      const response = await api.get('/wallets/supported-networks');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error getting supported networks:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Connect wallet - JWT required
   * @param {string} network - Blockchain network
   * @param {string} address - Wallet address
   * @returns {Promise} Connection operation result
   */
  async connectWallet(network, address) {
    try {
      const response = await api.post('/wallets/connect', {
        network,
        address
      });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * List user's wallets - JWT required
   * @returns {Promise} Wallet list
   */
  async getWallets() {
    try {
      const response = await api.get('/wallets');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error getting wallet list:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Delete wallet - JWT required
   * @param {string} walletId - Wallet ID to delete
   * @returns {Promise} Deletion result
   */
  async deleteWallet(walletId) {
    try {
      const response = await api.delete(`/wallets/${walletId}`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Wallet deletion error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Set airdrop wallet - JWT required
   * @param {string} address - Wallet address for airdrop
   * @returns {Promise} Airdrop wallet setting result
   */
  async setAirdropWallet(address) {
    try {
      const response = await api.post('/wallets/airdrop', {
        address
      });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Airdrop wallet setting error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Remove airdrop wallet - JWT required
   * @returns {Promise} Airdrop wallet removal result
   */
  async removeAirdropWallet() {
    try {
      const response = await api.delete('/wallets/airdrop');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Airdrop wallet removal error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get airdrop wallet - JWT required
   * @returns {Promise} Current airdrop wallet
   */
  async getAirdropWallet() {
    try {
      const response = await api.get('/wallets/airdrop');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Error getting airdrop wallet:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Refresh wallet balance - JWT required
   * @param {string} walletId - Wallet ID to refresh
   * @returns {Promise} Balance refresh result
   */
  async refreshWalletBalance(walletId) {
    try {
      const response = await api.post(`/wallets/${walletId}/refresh-balance`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Balance refresh error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Refresh all wallet balances - JWT required
   * @returns {Promise} All balances refresh result
   */
  async refreshAllWalletBalances() {
    try {
      const response = await api.post('/wallets/refresh-all-balances');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('All balances refresh error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get portfolio summary - JWT required
   * @returns {Promise} Portfolio summary data
   */
  async getPortfolioSummary() {
    try {
      const response = await api.get('/wallets/portfolio-summary');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Portfolio summary error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get wallet transactions - JWT required
   * @param {string} walletId - Wallet ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Transaction list
   */
  async getWalletTransactions(walletId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/wallets/${walletId}/transactions`, {
        params: { page, limit }
      });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Transaction list error:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  // Helper methods
  isValidEthereumAddress(address) {
    if (!address || typeof address !== 'string') return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  }

  normalizeAddress(address) {
    if (!address) return '';
    return address.trim();
  }

  canAddWalletToNetwork(wallets, network) {
    if (!Array.isArray(wallets)) return true;
    const networkWallets = wallets.filter(wallet => wallet.network === network);
    return networkWallets.length < 3; // Max 3 wallets per network
  }

  getAirdropWallet(wallets) {
    if (!Array.isArray(wallets)) return null;
    return wallets.find(wallet => wallet.isAirdropAddress) || null;
  }
}

export default new WalletService(); 