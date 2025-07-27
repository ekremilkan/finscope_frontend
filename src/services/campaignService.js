import api from './api';
import { storageService } from './AsyncStorage';

// Campaign Service Class
class CampaignService {
  constructor() {
    this.baseURL = '/campaigns';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get all campaigns (Public endpoint)
  async getAllCampaigns() {
    try {
      console.log('🔄 Fetching campaigns from API...');
      const response = await api.get(`${this.baseURL}/all`);
      
      if (response.data.success) {
        const campaigns = response.data.data;
        console.log('✅ Campaigns fetched successfully:', campaigns.length);
        return campaigns;
      } else {
        throw new Error(response.data.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('❌ Campaign fetch error:', error);
      throw error; // Re-throw error instead of returning mock data
    }
  }

  // Get campaign by ID (Auth required)
  async getCampaignById(campaignId) {
    try {
      console.log('🔄 Fetching campaign details for ID:', campaignId);
      const response = await api.get(`${this.baseURL}/${campaignId}`);
      
      if (response.data.success) {
        console.log('✅ Campaign details fetched successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch campaign details');
      }
    } catch (error) {
      console.error('❌ Campaign details fetch error:', error);
      throw error;
    }
  }

  // Get campaign questions (Auth required)
  async getCampaignQuestions(campaignId) {
    try {
      console.log('🔄 Fetching campaign questions for ID:', campaignId);
      const response = await api.get(`/questions/campaign/${campaignId}`);
      
      if (response.data.success) {
        console.log('✅ Campaign questions fetched successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch campaign questions');
      }
    } catch (error) {
      console.error('❌ Campaign questions fetch error:', error);
      throw error;
    }
  }

  // Join campaign (Real API call)
  async joinCampaign(campaignId) {
    try {
      console.log('🔄 Joining campaign:', campaignId);
      const response = await api.post(`/campaigns/${campaignId}/join`);
      
      if (response.data.success) {
        console.log('✅ Successfully joined campaign');
        return true;
      } else {
        console.error('❌ Join campaign failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Join campaign error:', error);
      throw error;
    }
  }

  // Update quiz progress (Real API call)
  async updateQuizProgress(campaignId, progressData) {
    try {
      console.log('🔄 Updating quiz progress for campaign:', campaignId);
      const response = await api.put(`${this.baseURL}/${campaignId}/progress`, progressData);
      
      if (response.data.success) {
        console.log('✅ Quiz progress updated successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update quiz progress');
      }
    } catch (error) {
      console.error('❌ Update quiz progress error:', error);
      throw error;
    }
  }

  // Get user campaign progress (Real API call)
  async getUserCampaignProgress(campaignId) {
    try {
      console.log('🔄 Getting user progress for campaign:', campaignId);
      const response = await api.get(`${this.baseURL}/${campaignId}/user-progress`);
      
      if (response.data.success) {
        console.log('✅ User progress fetched successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user progress');
      }
    } catch (error) {
      console.error('❌ Get user progress error:', error);
      throw error;
    }
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  clearCache() {
    this.cache.clear();
  }
}

const campaignService = new CampaignService();
export default campaignService; 