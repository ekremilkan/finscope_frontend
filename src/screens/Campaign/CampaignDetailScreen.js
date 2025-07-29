import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Services
import campaignService from '../../services/campaignService';

// Utils
import { handleApiError } from '../../utils/campaignUtils';
import { getCampaignDetails } from '../../utils/userCampaignUtils';
import { navigateToQuiz } from '../../utils/navigationUtils';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { width, height } = Dimensions.get('window');

const CampaignDetailScreen = ({ navigation, route }) => {
  const { campaignId } = route.params;
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  // Load campaign details on mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCampaignDetails();
    }, [campaignId])
  );

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading campaign details for ID:', campaignId);
      const campaignData = await getCampaignDetails(campaignId);
      
      if (campaignData) {
        setCampaign(campaignData);
        console.log('✅ Campaign details loaded successfully');
      } else {
        setError('Kampanya detayları yüklenemedi');
      }
    } catch (error) {
      console.error('❌ Load campaign details error:', error);
      setError('Kampanya detayları yüklenirken bir hata oluştu');
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCampaign = async () => {
    if (!campaign) return;
    
    // Check if campaign is active
    if (campaign.status !== 'active') {
      Alert.alert(
        'Campaign Not Active',
        campaign.status === 'expired' 
          ? 'This campaign has expired and is no longer accepting participants.'
          : 'This campaign is not currently active.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setJoining(true);
      
      console.log('🔄 Joining campaign:', campaignId);
      const success = await campaignService.joinCampaign(campaignId);
      
      if (success) {
        console.log('✅ Successfully joined campaign, navigating to quiz...');
        // Use navigation utility for quiz navigation
        navigateToQuiz(navigation, {
          campaignId: campaign._id,
          campaignTitle: campaign.title,
          reward: campaign.reward
        });
      } else {
        Alert.alert('Error', 'Failed to join campaign');
      }
    } catch (error) {
      console.error('Join campaign error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to join campaign');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleStartQuiz = () => {
    if (!campaign) return;
    
    // Use navigation utility for quiz navigation
    navigateToQuiz(navigation, {
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      reward: campaign.reward
    });
  };

  const handleVideoPress = () => {
    if (campaign?.videoUrl) {
      Linking.openURL(campaign.videoUrl);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={24} color="#6366f1" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Campaign Details</Text>
      </View>
      
      <View style={styles.headerRight}>
        <Icon name="campaign" size={24} color="#6366f1" />
      </View>
    </View>
  );

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      {campaign.videoUrl ? (
        <TouchableOpacity 
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={0.8}
        >
          <View style={styles.videoPlaceholder}>
            <Icon name="play-circle-outline" size={64} color="#6366f1" />
            <Text style={styles.videoPlaceholderText}>Watch Video</Text>
            <Text style={styles.videoSubtext}>Tap to open video</Text>
          </View>
        </TouchableOpacity>
      ) : campaign.imageUrls && campaign.imageUrls.length > 0 ? (
        <Image
          source={{ uri: campaign.imageUrls[0] }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.heroPlaceholder}>
          <Icon name="campaign" size={64} color="#6366f1" />
          <Text style={styles.heroPlaceholderText}>Campaign Image</Text>
        </View>
      )}
    </View>
  );

  const renderCampaignInfo = () => (
    <View style={styles.campaignInfo}>
      <Text style={styles.campaignTitle}>{campaign.title}</Text>
      <Text style={styles.campaignDescription}>{campaign.description}</Text>
      
      <View style={styles.campaignStats}>
        <View style={styles.statItem}>
          <Icon name="people" size={20} color="#6366f1" />
          <Text style={styles.statLabel}>Participants</Text>
          <Text style={styles.statValue}>
            {campaign.participants}/{campaign.maxParticipants}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="quiz" size={20} color="#8b5cf6" />
          <Text style={styles.statLabel}>Questions</Text>
          <Text style={styles.statValue}>{campaign.questions}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="monetization-on" size={20} color="#10b981" />
          <Text style={styles.statLabel}>Reward</Text>
          <Text style={styles.statValue}>{campaign.reward} USDT</Text>
        </View>
      </View>
    </View>
  );

  const renderCampaignContent = () => (
    <View style={styles.campaignContent}>
      <Text style={styles.contentTitle}>Campaign Content</Text>
      <Text style={styles.contentText}>{campaign.content}</Text>
    </View>
  );

  const renderImageGallery = () => {
    if (!campaign.imageUrls || campaign.imageUrls.length === 0) return null;
    
    return (
      <View style={styles.imageGallery}>
        <Text style={styles.galleryTitle}>Campaign Images</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {campaign.imageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.galleryImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderActionButton = () => {
    console.log('🔍 Campaign state:', {
      userCompleted: campaign.userCompleted,
      userJoined: campaign.userJoined,
      status: campaign.status
    });

    // Check if campaign is active
    if (campaign.status !== 'active') {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.disabledButton]} disabled>
          <Icon name="block" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>
            {campaign.status === 'expired' ? 'Campaign Expired' : 'Campaign Not Active'}
          </Text>
        </TouchableOpacity>
      );
    }

    if (campaign.userCompleted) {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.completedButton]} disabled>
          <Icon name="check-circle" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Completed</Text>
        </TouchableOpacity>
      );
    }
    
    if (campaign.userJoined && campaign.userJoined === true) {
      return (
        <TouchableOpacity 
          style={[styles.actionButton, styles.continueButton]}
          onPress={handleStartQuiz}
        >
          <Icon name="play-arrow" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Continue Quiz</Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity 
        style={[styles.actionButton, styles.joinButton]}
        onPress={handleJoinCampaign}
        disabled={joining}
      >
        {joining ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Icon name="add" size={20} color="#ffffff" />
        )}
        <Text style={styles.actionButtonText}>
          {joining ? 'Joining...' : 'Start Campaign'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <LoadingSpinner text="Loading campaign details..." />
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Icon name="error" size={48} color="#ef4444" />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={loadCampaignDetails}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Icon name="campaign" size={48} color="#94a3b8" />
          <Text style={styles.errorText}>Campaign not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        {renderCampaignInfo()}
        {renderCampaignContent()}
        {renderImageGallery()}
      </ScrollView>
      
      <View style={styles.actionContainer}>
        {renderActionButton()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  backButton: {
    padding: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    padding: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: Math.max(200, height * 0.25),
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    margin: Math.max(16, width * 0.04),
    borderRadius: 20,
    overflow: 'hidden',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  videoPlaceholderText: {
    fontSize: Math.max(18, width * 0.045),
    color: '#6366f1',
    fontWeight: '600',
    marginTop: Math.max(8, width * 0.02),
  },
  videoSubtext: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    marginTop: Math.max(4, width * 0.01),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
  },
  heroPlaceholderText: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    marginTop: Math.max(8, width * 0.02),
  },
  campaignInfo: {
    padding: Math.max(20, width * 0.05),
  },
  campaignTitle: {
    fontSize: Math.max(24, width * 0.06),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Math.max(12, width * 0.03),
  },
  campaignDescription: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    lineHeight: 24,
    marginBottom: Math.max(20, width * 0.05),
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: Math.max(12, width * 0.03),
    color: '#94a3b8',
    marginTop: Math.max(4, width * 0.01),
  },
  statValue: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
    marginTop: Math.max(2, width * 0.005),
  },
  campaignContent: {
    padding: Math.max(20, width * 0.05),
  },
  contentTitle: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: Math.max(12, width * 0.03),
  },
  contentText: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    lineHeight: 24,
  },
  imageGallery: {
    padding: Math.max(20, width * 0.05),
  },
  galleryTitle: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: Math.max(12, width * 0.03),
  },
  galleryImage: {
    width: Math.max(120, width * 0.3),
    height: Math.max(80, height * 0.1),
    borderRadius: 12,
    marginRight: Math.max(12, width * 0.03),
  },
  actionContainer: {
    padding: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  joinButton: {
    backgroundColor: '#6366f1',
  },
  continueButton: {
    backgroundColor: '#10b981',
  },
  completedButton: {
    backgroundColor: '#6b7280',
  },
  disabledButton: {
    backgroundColor: '#4b5563',
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: Math.max(8, width * 0.02),
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.max(20, width * 0.05),
  },
  errorText: {
    fontSize: Math.max(16, width * 0.04),
    color: '#ef4444',
    textAlign: 'center',
    marginTop: Math.max(16, width * 0.04),
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    marginTop: Math.max(16, width * 0.04),
  },
  retryButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default CampaignDetailScreen; 