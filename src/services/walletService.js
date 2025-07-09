import api from './api';

/**
 * Wallet Service - Finscope Cüzdan API işlemleri
 * Tüm wallet-related API çağrılarını yönetir
 */
class WalletService {
  
  /**
   * Adres doğrulama - Auth gerektirmez
   * @param {string} network - Blockchain ağı (örn: "Ethereum")
   * @param {string} address - Cüzdan adresi
   * @returns {Promise} API yanıtı
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
      console.error('Adres doğrulama hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Desteklenen ağları getir - Auth gerektirmez
   * @returns {Promise} Desteklenen blockchain ağları
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
      console.error('Desteklenen ağlar alma hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Cüzdan bağlama - JWT gerekli
   * @param {string} network - Blockchain ağı
   * @param {string} address - Cüzdan adresi
   * @returns {Promise} Bağlama işlemi sonucu
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
      console.error('Cüzdan bağlama hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Kullanıcının cüzdanlarını listele - JWT gerekli
   * @returns {Promise} Cüzdan listesi
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
      console.error('Cüzdan listesi alma hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Cüzdan silme - JWT gerekli
   * @param {string} walletId - Silinecek cüzdanın ID'si
   * @returns {Promise} Silme işlemi sonucu
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
      console.error('Cüzdan silme hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Airdrop cüzdanı ayarlama - JWT gerekli
   * @param {string} address - Airdrop için seçilen cüzdan adresi
   * @returns {Promise} Airdrop ayarlama sonucu
   */
  async setAirdropWallet(address) {
    try {
      const response = await api.post('/wallets/set-airdrop', {
        address
      });
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Airdrop cüzdanı ayarlama hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Airdrop cüzdanını kaldırma - JWT gerekli
   * @returns {Promise} Airdrop kaldırma sonucu
   */
  async removeAirdropWallet() {
    try {
      const response = await api.delete('/wallets/remove-airdrop');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Airdrop cüzdanı kaldırma hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Mevcut airdrop cüzdanını görüntüleme - JWT gerekli
   * @returns {Promise} Airdrop cüzdanı bilgisi
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
      console.error('Airdrop cüzdanı görüntüleme hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Cüzdan bakiyesini yenileme - JWT gerekli
   * @param {string} walletId - Bakiyesi güncellenecek cüzdanın ID'si
   * @returns {Promise} Bakiye yenileme sonucu
   */
  async refreshWalletBalance(walletId) {
    try {
      const response = await api.put(`/wallets/${walletId}/balance/refresh`);
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Cüzdan bakiyesi yenileme hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Tüm cüzdan bakiyelerini yenileme - JWT gerekli
   * @returns {Promise} Toplu bakiye yenileme sonucu
   */
  async refreshAllWalletBalances() {
    try {
      const response = await api.put('/wallets/balance/refresh-all');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Tüm cüzdan bakiyeleri yenileme hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Portföy özeti - JWT gerekli
   * @returns {Promise} Portföy özeti bilgisi
   */
  async getPortfolioSummary() {
    try {
      const response = await api.get('/wallets/portfolio');
      return {
        success: true,
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error('Portföy özeti alma hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Cüzdan işlem geçmişi - JWT gerekli
   * @param {string} walletId - Cüzdan ID'si
   * @param {number} page - Sayfa numarası (varsayılan: 1)
   * @param {number} limit - Sayfa başına kayıt (varsayılan: 20)
   * @returns {Promise} İşlem geçmişi
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
      console.error('Cüzdan işlem geçmişi alma hatası:', error);
      return {
        success: false,
        data: null,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Ethereum adresi için özel doğrulama
   * @param {string} address - Ethereum adresi
   * @returns {boolean} Geçerliliği
   */
  isValidEthereumAddress(address) {
    // Ethereum adresi format kontrolü: 0x + 40 hex karakter
    const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumRegex.test(address);
  }

  /**
   * Adres formatını normalize et
   * @param {string} address - Ham adres
   * @returns {string} Normalize edilmiş adres
   */
  normalizeAddress(address) {
    if (!address) return '';
    
    // Boşlukları temizle
    address = address.trim();
    
    // Ethereum adresi ise checksummed hale getir
    if (this.isValidEthereumAddress(address)) {
      return address; // API'den dönen normalize edilmiş adresi kullanacağız
    }
    
    return address;
  }

  /**
   * Network spesifik maximum cüzdan sayısını kontrol et
   * @param {Array} wallets - Mevcut cüzdanlar
   * @param {string} network - Kontrol edilecek network
   * @returns {boolean} Limit durumu
   */
  canAddWalletToNetwork(wallets, network) {
    const MAX_WALLETS_PER_NETWORK = 3;
    const networkWallets = wallets.filter(wallet => wallet.network === network);
    return networkWallets.length < MAX_WALLETS_PER_NETWORK;
  }

  /**
   * Airdrop cüzdanını bul
   * @param {Array} wallets - Cüzdan listesi
   * @returns {Object|null} Airdrop cüzdanı
   */
  getAirdropWallet(wallets) {
    return wallets.find(wallet => wallet.isAirdropAddress) || null;
  }
}

// Singleton instance
const walletService = new WalletService();

export default walletService; 