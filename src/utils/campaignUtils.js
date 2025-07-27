import { Alert } from 'react-native';
import { 
  CAMPAIGN_STATUS, 
  CAMPAIGN_CATEGORIES, 
  CAMPAIGN_DIFFICULTIES,
  getCampaignStatusColor,
  getCampaignStatusText,
  getDifficultyColor,
  getProgressPercentage,
  getTimeRemaining,
  validateCampaign,
  filterCampaigns,
  sortCampaigns
} from '../data/campaignData';

/**
 * Campaign Utils - Business logic ve helper fonksiyonları
 * Kampanya işlemleri için gerekli yardımcı fonksiyonlar
 */

// API Error Handling
export const handleApiError = (error, fallbackData = []) => {
  console.error('API Error:', error);
  
  let errorMessage = 'Bir hata oluştu';
  
  if (error.response) {
    // Server error
    switch (error.response.status) {
      case 401:
        errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        break;
      case 403:
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
        break;
      case 404:
        errorMessage = 'Kampanya bulunamadı.';
        break;
      case 429:
        errorMessage = 'Çok fazla istek gönderildi. Lütfen bekleyin.';
        break;
      case 500:
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
        break;
      default:
        errorMessage = error.response.data?.message || 'Sunucu hatası';
    }
  } else if (error.request) {
    // Network error
    errorMessage = 'İnternet bağlantınızı kontrol edin.';
  } else {
    // Other error
    errorMessage = error.message || 'Beklenmeyen bir hata oluştu';
  }
  
  // Show error alert
  Alert.alert('Hata', errorMessage, [{ text: 'Tamam' }]);
  
  return fallbackData;
};

// Campaign Data Validation
export const validateCampaignData = (campaign) => {
  const errors = validateCampaign(campaign);
  
  if (errors.length > 0) {
    Alert.alert('Doğrulama Hatası', errors.join('\n'), [{ text: 'Tamam' }]);
    return false;
  }
  
  return true;
};

// Campaign Status Management
export const isCampaignActive = (campaign) => {
  if (!campaign.isActive) return false;
  
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);
  
  return now >= startDate && now <= endDate;
};

export const isCampaignUpcoming = (campaign) => {
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  
  return campaign.isActive && now < startDate;
};

export const isCampaignExpired = (campaign) => {
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  
  return now > endDate;
};

export const getCampaignStatus = (campaign) => {
  if (!campaign.isActive) return CAMPAIGN_STATUS.PENDING_DELETION;
  if (isCampaignExpired(campaign)) return CAMPAIGN_STATUS.EXPIRED;
  if (isCampaignUpcoming(campaign)) return CAMPAIGN_STATUS.UPCOMING;
  return CAMPAIGN_STATUS.ACTIVE;
};

// Campaign Progress Management
export const getCampaignProgress = (campaign) => {
  const progress = getProgressPercentage(campaign.participants, campaign.maxParticipants);
  const timeRemaining = getTimeRemaining(campaign.endDate);
  
  return {
    progress,
    timeRemaining,
    isFull: campaign.participants >= campaign.maxParticipants,
    canJoin: campaign.participants < campaign.maxParticipants && isCampaignActive(campaign)
  };
};

// Campaign Filtering and Sorting
export const filterAndSortCampaigns = (campaigns, filters = {}, sortBy = 'createdAt', sortOrder = 'desc') => {
  let filtered = filterCampaigns(campaigns, filters);
  return sortCampaigns(filtered, sortBy, sortOrder);
};

// Campaign Search
export const searchCampaigns = (campaigns, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return campaigns;
  
  const term = searchTerm.toLowerCase().trim();
  
  return campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(term) ||
    campaign.description.toLowerCase().includes(term) ||
    campaign.tags.some(tag => tag.toLowerCase().includes(term)) ||
    campaign.category.toLowerCase().includes(term) ||
    campaign.difficulty.toLowerCase().includes(term)
  );
};

// Campaign Join Logic
export const canJoinCampaign = (campaign, userProgress = null) => {
  // Check if campaign is active
  if (!isCampaignActive(campaign)) return false;
  
  // Check if campaign is full
  if (campaign.participants >= campaign.maxParticipants) return false;
  
  // Check if user already joined
  if (campaign.userJoined) return false;
  
  // Check if user already completed
  if (campaign.userCompleted) return false;
  
  return true;
};

export const getJoinButtonText = (campaign) => {
  if (campaign.userCompleted) return 'Tamamlandı';
  if (campaign.userJoined) return 'Devam Et';
  if (!isCampaignActive(campaign)) return 'Kampanya Bitti';
  if (campaign.participants >= campaign.maxParticipants) return 'Dolu';
  return 'Katıl';
};

export const getJoinButtonColor = (campaign) => {
  if (campaign.userCompleted) return '#10b981';
  if (campaign.userJoined) return '#6366f1';
  if (!isCampaignActive(campaign)) return '#6b7280';
  if (campaign.participants >= campaign.maxParticipants) return '#ef4444';
  return '#6366f1';
};

// Campaign Display Utilities
export const formatCampaignDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 gün';
  return `${diffDays} gün`;
};

export const formatCampaignReward = (reward) => {
  return `${reward} USDT`;
};

export const formatCampaignParticipants = (participants, maxParticipants) => {
  return `${participants}/${maxParticipants}`;
};

export const getCampaignDifficultyIcon = (difficulty) => {
  switch (difficulty) {
    case CAMPAIGN_DIFFICULTIES.BEGINNER:
      return '🌱';
    case CAMPAIGN_DIFFICULTIES.INTERMEDIATE:
      return '🌿';
    case CAMPAIGN_DIFFICULTIES.ADVANCED:
      return '🌳';
    default:
      return '📚';
  }
};

// Campaign Navigation
export const navigateToCampaignDetail = (navigation, campaign) => {
  navigation.navigate('CampaignDetail', { campaignId: campaign.id });
};

export const navigateToQuiz = (navigation, campaign) => {
  navigation.navigate('QuizScreen', {
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    reward: campaign.reward
  });
};

// Campaign Actions
export const handleJoinCampaign = async (campaign, campaignService, navigation) => {
  try {
    if (!canJoinCampaign(campaign)) {
      Alert.alert('Hata', 'Bu kampanyaya katılamazsınız.');
      return false;
    }
    
    const success = await campaignService.joinCampaign(campaign.id);
    
    if (success) {
      Alert.alert(
        'Başarılı', 
        'Kampanyaya başarıyla katıldınız!',
        [
          {
            text: 'Kampanya Detayına Git',
            onPress: () => navigateToCampaignDetail(navigation, campaign)
          },
          {
            text: 'Quiz\'e Başla',
            onPress: () => navigateToQuiz(navigation, campaign)
          }
        ]
      );
      return true;
    } else {
      Alert.alert('Hata', 'Kampanyaya katılırken bir hata oluştu.');
      return false;
    }
  } catch (error) {
    console.error('Join campaign error:', error);
    Alert.alert('Hata', 'Kampanyaya katılırken bir hata oluştu.');
    return false;
  }
};

// Campaign Refresh
export const refreshCampaigns = async (campaignService, setCampaigns, setLoading, setError) => {
  try {
    setLoading(true);
    setError(null);
    
    const campaigns = await campaignService.getAllCampaigns();
    setCampaigns(campaigns);
    
    console.log('✅ Campaigns refreshed successfully');
  } catch (error) {
    console.error('❌ Refresh campaigns error:', error);
    setError('Kampanyalar yüklenirken bir hata oluştu');
  } finally {
    setLoading(false);
  }
};

// Campaign Cache Management
export const clearCampaignCache = (campaignService) => {
  campaignService.clearCache();
  console.log('✅ Campaign cache cleared');
};

// Campaign Analytics
export const getCampaignStats = (campaigns) => {
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => getCampaignStatus(c) === CAMPAIGN_STATUS.ACTIVE).length,
    upcoming: campaigns.filter(c => getCampaignStatus(c) === CAMPAIGN_STATUS.UPCOMING).length,
    expired: campaigns.filter(c => getCampaignStatus(c) === CAMPAIGN_STATUS.EXPIRED).length,
    joined: campaigns.filter(c => c.userJoined).length,
    completed: campaigns.filter(c => c.userCompleted).length,
    totalReward: campaigns.reduce((sum, c) => sum + c.reward, 0),
    averageReward: campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + c.reward, 0) / campaigns.length) : 0
  };
  
  return stats;
};

// Legacy functions for backward compatibility
export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return '#10b981';
    case 'draft': return '#f59e0b';
    case 'completed': return '#6366f1';
    default: return '#94a3b8';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'draft': return 'Draft';
    case 'completed': return 'Completed';
    default: return 'Unknown';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'completed': return 'Completed';
    case 'draft': return 'Draft';
    case 'paused': return 'Paused';
    default: return 'Unknown';
  }
};

// Export existing functions for backward compatibility
export { 
  filterCampaigns as filterCampaignsLegacy,
  getProgressPercentage as getProgressPercentageLegacy,
  getDifficultyColor as getDifficultyColorLegacy
}; 