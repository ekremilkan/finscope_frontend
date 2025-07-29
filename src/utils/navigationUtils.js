import { Alert } from 'react-native';

// Navigation constants
export const NAVIGATION_ROUTES = {
  // Main tabs
  HOME: 'Home',
  CAMPAIGNS: 'Campaigns',
  WALLET: 'Wallet',
  PROFILE: 'Profile',
  
  // Stack screens
  QUIZ_SCREEN: 'QuizScreen',
  CAMPAIGN_DETAIL: 'CampaignDetail',
  ADD_WALLET: 'AddWalletScreen',
  CUSTOMER_CAMPAIGNS: 'CustomerCampaignsScreen',
};

// Navigation helpers
export const navigateToQuiz = (navigation, params) => {
  try {
    navigation.navigate(NAVIGATION_ROUTES.QUIZ_SCREEN, params);
  } catch (error) {
    console.error('Navigation to quiz error:', error);
    Alert.alert('Error', 'Failed to navigate to quiz');
  }
};

export const navigateToCampaignDetail = (navigation, campaignId) => {
  try {
    navigation.navigate(NAVIGATION_ROUTES.CAMPAIGN_DETAIL, { campaignId });
  } catch (error) {
    console.error('Navigation to campaign detail error:', error);
    Alert.alert('Error', 'Failed to navigate to campaign details');
  }
};

export const navigateToCampaigns = (navigation, params = {}) => {
  try {
    navigation.navigate(NAVIGATION_ROUTES.CAMPAIGNS, params);
  } catch (error) {
    console.error('Navigation to campaigns error:', error);
    Alert.alert('Error', 'Failed to navigate to campaigns');
  }
};

export const goBack = (navigation) => {
  try {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(NAVIGATION_ROUTES.HOME);
    }
  } catch (error) {
    console.error('Go back error:', error);
    navigation.navigate(NAVIGATION_ROUTES.HOME);
  }
};

// Navigation state helpers
export const getCurrentRoute = (navigation) => {
  try {
    return navigation.getCurrentRoute()?.name;
  } catch (error) {
    console.error('Get current route error:', error);
    return null;
  }
};

export const isQuizScreen = (navigation) => {
  return getCurrentRoute(navigation) === NAVIGATION_ROUTES.QUIZ_SCREEN;
};

export const isCampaignDetailScreen = (navigation) => {
  return getCurrentRoute(navigation) === NAVIGATION_ROUTES.CAMPAIGN_DETAIL;
};

// Navigation params helpers
export const getNavigationParams = (route, paramName) => {
  try {
    return route?.params?.[paramName];
  } catch (error) {
    console.error('Get navigation params error:', error);
    return null;
  }
};

export const setNavigationParams = (navigation, params) => {
  try {
    navigation.setParams(params);
  } catch (error) {
    console.error('Set navigation params error:', error);
  }
};

// Navigation guards
export const canNavigateToQuiz = (campaign) => {
  if (!campaign) return false;
  
  // Check if campaign is active
  if (campaign.status !== 'active') return false;
  
  // Check if user has joined or can join
  return campaign.userJoined || (!campaign.userCompleted && campaign.participants < campaign.maxParticipants);
};

export const canNavigateToCampaignDetail = (campaign) => {
  if (!campaign) return false;
  
  // All campaigns can be viewed in detail
  return true;
};

// Navigation flow helpers
export const handleQuizCompletion = (navigation, campaignId) => {
  try {
    // Navigate back to campaigns with refresh flag
    navigateToCampaigns(navigation, {
      refreshCampaigns: true,
      completedCampaignId: campaignId
    });
  } catch (error) {
    console.error('Handle quiz completion error:', error);
    navigateToCampaigns(navigation);
  }
};

export const handleCampaignJoin = (navigation, campaign) => {
  try {
    if (campaign.userJoined) {
      // User already joined, go to quiz
      navigateToQuiz(navigation, {
        campaignId: campaign._id,
        campaignTitle: campaign.title,
        reward: campaign.reward
      });
    } else {
      // User needs to join first, go to detail
      navigateToCampaignDetail(navigation, campaign._id);
    }
  } catch (error) {
    console.error('Handle campaign join error:', error);
    Alert.alert('Error', 'Failed to handle campaign join');
  }
}; 