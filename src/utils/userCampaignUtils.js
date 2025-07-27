import { Alert } from 'react-native';
import campaignService from '../services/campaignService';

export const filterUserCampaigns = (campaigns, searchQuery, selectedFilter) => {
  let filtered = campaigns;

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(campaign =>
      campaign.title.toLowerCase().includes(query) ||
      campaign.description.toLowerCase().includes(query) ||
      campaign.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Status filter
  if (selectedFilter !== 'all') {
    filtered = filtered.filter(campaign => {
      switch (selectedFilter) {
        case 'active':
          return campaign.status === 'active';
        case 'upcoming':
          return campaign.status === 'upcoming';
        case 'expired':
          return campaign.status === 'expired';
        default:
          return true;
      }
    });
  }

  return filtered;
};

// Enhanced join campaign function using campaignService
export const handleJoinCampaign = async (campaigns, setCampaigns, campaignId, navigation) => {
  try {
    const campaign = campaigns.find(c => c._id === campaignId);

    if (!campaign) {
      Alert.alert('Error', 'Campaign not found');
      return;
    }

    if (campaign.userJoined) {
      // Continue to quiz
      navigation.navigate('QuizScreen', {
        campaign: campaign,
        campaignId: campaign._id,
        campaignTitle: campaign.title,
        reward: campaign.reward
      });
    } else {
      // Join campaign using campaignService
      console.log('🔄 Joining campaign:', campaignId);
      const success = await campaignService.joinCampaign(campaignId);

      if (success) {
        // Update local state
        setCampaigns(prev => prev.map(c =>
          c._id === campaignId
            ? { ...c, userJoined: true, participants: c.participants + 1 }
            : c
        ));

        Alert.alert(
          'Success',
          'Successfully joined the campaign!',
          [
            {
              text: 'View Campaign Details',
              onPress: () => navigation.navigate('CampaignDetail', { campaignId: campaign._id })
            },
            {
              text: 'Start Quiz',
              onPress: () => navigation.navigate('QuizScreen', {
                campaignId: campaign._id,
                campaignTitle: campaign.title,
                reward: campaign.reward
              })
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to join campaign');
      }
    }
  } catch (error) {
    console.error('Join campaign error:', error);
    
    // Handle specific error cases
    if (error.response?.data?.message) {
      Alert.alert('Error', error.response.data.message);
    } else {
      Alert.alert('Error', 'Failed to join campaign');
    }
  }
};

// Get campaign details using campaignService
export const getCampaignDetails = async (campaignId) => {
  try {
    console.log('🔄 Getting campaign details for ID:', campaignId);
    const campaign = await campaignService.getCampaignById(campaignId);
    return campaign;
  } catch (error) {
    console.error('Get campaign details error:', error);
    throw error;
  }
};

// Get campaign questions using campaignService
export const getCampaignQuestions = async (campaignId) => {
  try {
    console.log('🔄 Getting campaign questions for ID:', campaignId);
    const questions = await campaignService.getCampaignQuestions(campaignId);
    return questions;
  } catch (error) {
    console.error('Get campaign questions error:', error);
    throw error;
  }
};

// Update quiz progress using campaignService
export const updateQuizProgress = async (campaignId, progressData) => {
  try {
    console.log('🔄 Updating quiz progress for campaign:', campaignId);
    const result = await campaignService.updateQuizProgress(campaignId, progressData);
    return result;
  } catch (error) {
    console.error('Update quiz progress error:', error);
    throw error;
  }
};

// Get user campaign progress using campaignService
export const getUserCampaignProgress = async (campaignId) => {
  try {
    console.log('🔄 Getting user progress for campaign:', campaignId);
    const progress = await campaignService.getUserCampaignProgress(campaignId);
    return progress;
  } catch (error) {
    console.error('Get user progress error:', error);
    throw error;
  }
};

// Utility functions for campaign data
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return '#10b981';
    case 'Intermediate':
      return '#f59e0b';
    case 'Advanced':
      return '#ef4444';
    default:
      return '#6366f1';
  }
};

export const getProgressPercentage = (participants, maxParticipants) => {
  if (!participants || !maxParticipants) return 0;
  return Math.round((participants / maxParticipants) * 100);
};

export const getCampaignStatusColor = (status) => {
  switch (status) {
    case 'active':
      return '#10b981';
    case 'upcoming':
      return '#f59e0b';
    case 'expired':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
};

export const getCampaignStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Aktif';
    case 'upcoming':
      return 'Yakında';
    case 'expired':
      return 'Süresi Dolmuş';
    default:
      return 'Bilinmiyor';
  }
}; 