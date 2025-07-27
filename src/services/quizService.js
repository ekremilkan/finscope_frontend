import api from './api';
import { API_CONFIG } from '../config/api.config';

class QuizService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Get questions for a specific campaign
  async getCampaignQuestions(campaignId) {
    try {
      console.log('🔄 Getting questions for campaign:', campaignId);
      const response = await api.get(`/questions/campaign/${campaignId}`);
      
      if (response.data.success) {
        console.log('✅ Questions loaded successfully:', response.data.data.length);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to load questions');
      }
    } catch (error) {
      console.error('❌ Get questions error:', error);
      throw error;
    }
  }

  // Update quiz progress
  async updateQuizProgress(campaignId, progressData) {
    try {
      console.log('🔄 Updating quiz progress for campaign:', campaignId);
      const response = await api.put(`/campaigns/${campaignId}/progress`, progressData);
      
      if (response.data.success) {
        console.log('✅ Quiz progress updated successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update progress');
      }
    } catch (error) {
      console.error('❌ Update progress error:', error);
      throw error;
    }
  }

  // Submit quiz completion
  async submitQuizCompletion(campaignId, completionData) {
    try {
      console.log('🔄 Submitting quiz completion for campaign:', campaignId);
      const response = await api.post(`/campaigns/${campaignId}/complete`, completionData);
      
      if (response.data.success) {
        console.log('✅ Quiz completion submitted successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to submit completion');
      }
    } catch (error) {
      console.error('❌ Submit completion error:', error);
      throw error;
    }
  }

  // Get user quiz progress
  async getUserQuizProgress(campaignId) {
    try {
      console.log('🔄 Getting user quiz progress for campaign:', campaignId);
      const response = await api.get(`/campaigns/${campaignId}/progress`);
      
      if (response.data.success) {
        console.log('✅ User progress loaded successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to load progress');
      }
    } catch (error) {
      console.error('❌ Get progress error:', error);
      throw error;
    }
  }
}

export default new QuizService(); 