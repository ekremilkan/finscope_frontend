// services/campaign.service.js
import api from './api';

class CampaignService {
  constructor() {
    this.baseURL = '/campaigns';
  }

  async _request(method, url, data = null) {
    try {
      console.log(`🔄 [${method.toUpperCase()}] Request: ${url}`);
      const response = await api[method](url, data);

      if (response.data && response.data.success) {
        console.log(`✅ [${method.toUpperCase()}] Success: ${url}`);
        return response.data.data;
      } else {
        const errorMessage = response.data?.message || `API error: ${url}`;
        console.error('❌ API Response Error:', errorMessage, response.data);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred.';
      console.error(`❌ [${method.toUpperCase()}] Critical Error: ${url}`, {
        message: errorMessage,
        responseData: error.response?.data
      });
      throw new Error(errorMessage);
    }
  }

  // Kampanya oluştur (Admin / Customer)
  createCampaign(campaignData) {
    return this._request('post', `${this.baseURL}/create`, campaignData);
  }

  // Tüm kampanyalar (Auth required)
   getAllCampaigns() {
    // Önbelleği atlamak için URL'nin sonuna benzersiz bir zaman damgası ekliyoruz.
    const urlWithCacheBust = `${this.baseURL}/all?_t=${new Date().getTime()}`;
    return this._request('get', urlWithCacheBust);
  }


  // ID'ye göre kampanya
  getCampaignById(campaignId) {
    return this._request('get', `${this.baseURL}/${campaignId}`);
  }

  // Kullanıcının progress'i
  getUserProgress(campaignId) {
    return this._request('get', `${this.baseURL}/${campaignId}/user-progress`);
  }

  // Kampanyaya katıl
  joinCampaign(campaignId) {
    return this._request('post', `${this.baseURL}/${campaignId}/join`, {});
  }

  // Progress güncelle
  updateProgress(campaignId, progressData) {
    return this._request('put', `${this.baseURL}/${campaignId}/progress`, progressData);
  }

  // Quiz tamamla
  completeQuiz(campaignId, completionData) {
    return this._request('post', `${this.baseURL}/${campaignId}/complete`, completionData);
  }

  // Kampanya güncelle
  updateCampaign(campaignId, campaignData) {
    return this._request('put', `${this.baseURL}/${campaignId}`, campaignData);
  }

  // Customer'ın kampanyaları
  getCustomerCampaigns() {
    return this._request('get', `${this.baseURL}/customer/list`);
  }

  // Kampanya silme isteği (Customer / Admin)
  requestDeleteCampaign(campaignId) {
    return this._request('delete', `${this.baseURL}/${campaignId}/request-delete`);
  }

  // Kampanya sil (Admin)
  deleteCampaign(campaignId) {
    return this._request('delete', `${this.baseURL}/${campaignId}`);
  }

  // Silme isteklerini getir (Admin)
  getDeleteRequests() {
    return this._request('get', `${this.baseURL}/admin/delete-requests`);
  }
}

const campaignService = new CampaignService();
export default campaignService;
