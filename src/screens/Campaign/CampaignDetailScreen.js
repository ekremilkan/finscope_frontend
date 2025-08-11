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
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Services
import campaignService from '../../services/campaignService';

// Utils
import { handleApiError } from '../../utils/campaignUtils';
import { getCampaignDetails } from '../../utils/userCampaignUtils';
import { navigateToQuiz } from '../../utils/navigationUtils';

// Components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Constants
import { COLORS, getCornerGradientColors } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

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
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.headerGradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.backButtonGradient}
          >
            <Icon name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Campaign Details</Text>
        </View>
        
        <View style={styles.headerRight}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.headerRightGradient}
          >
            <Icon name="campaign" size={24} color={COLORS.PRIMARY} />
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.heroGradient}
      >
        {campaign.videoUrl ? (
          <TouchableOpacity 
            style={styles.videoContainer}
            onPress={handleVideoPress}
            activeOpacity={0.8}
          >
            <View style={styles.videoPlaceholder}>
              <LinearGradient
                colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
                style={styles.videoPlaceholderGradient}
              >
                <Icon name="play-circle-outline" size={64} color={COLORS.PRIMARY} />
                <Text style={styles.videoPlaceholderText}>Watch Video</Text>
                <Text style={styles.videoSubtext}>Tap to open video</Text>
              </LinearGradient>
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
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.heroPlaceholderGradient}
            >
              <Icon name="campaign" size={64} color={COLORS.PRIMARY} />
              <Text style={styles.heroPlaceholderText}>Campaign Image</Text>
            </LinearGradient>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const renderCampaignInfo = () => (
    <View style={styles.campaignInfo}>
      <Text style={styles.campaignTitle}>{campaign.title}</Text>
      <Text style={styles.campaignDescription}>{campaign.description}</Text>
      
      <View style={styles.campaignStats}>
        <LinearGradient
          colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
          style={styles.statsGradient}
        >
          <View style={styles.statItem}>
            <LinearGradient
              colors={[COLORS.PRIMARY + '20', COLORS.PRIMARY + '10']}
              style={styles.statIconGradient}
            >
              <Icon name="people" size={20} color={COLORS.PRIMARY} />
            </LinearGradient>
            <Text style={styles.statLabel}>Participants</Text>
            <Text style={styles.statValue}>
              {campaign.participants}/{campaign.maxParticipants}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient
              colors={['#8b5cf620', '#8b5cf610']}
              style={styles.statIconGradient}
            >
              <Icon name="quiz" size={20} color="#8b5cf6" />
            </LinearGradient>
            <Text style={styles.statLabel}>Questions</Text>
            <Text style={styles.statValue}>{campaign.questions}</Text>
          </View>
          
          <View style={styles.statItem}>
            <LinearGradient
              colors={[COLORS.SUCCESS + '20', COLORS.SUCCESS + '10']}
              style={styles.statIconGradient}
            >
              <Icon name="monetization-on" size={20} color={COLORS.SUCCESS} />
            </LinearGradient>
            <Text style={styles.statLabel}>Reward</Text>
            <Text style={styles.statValue}>{campaign.reward} USDT</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );

  const renderCampaignContent = () => (
    <View style={styles.campaignContent}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.contentGradient}
      >
        <Text style={styles.contentTitle}>Campaign Content</Text>
        <Text style={styles.contentText}>{campaign.content}</Text>
      </LinearGradient>
    </View>
  );

  const renderImageGallery = () => {
    if (!campaign.imageUrls || campaign.imageUrls.length === 0) return null;
    
    return (
      <View style={styles.imageGallery}>
        <LinearGradient
          colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
          style={styles.galleryGradient}
        >
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
        </LinearGradient>
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
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']}
            style={styles.actionButtonGradient}
          >
            <Icon name="block" size={20} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.actionButtonText}>
              {campaign.status === 'expired' ? 'Campaign Expired' : 'Campaign Not Active'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    if (campaign.userCompleted) {
      return (
        <TouchableOpacity style={[styles.actionButton, styles.completedButton]} disabled>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']}
            style={styles.actionButtonGradient}
          >
            <Icon name="check-circle" size={20} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.actionButtonText}>Completed</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    
    if (campaign.userJoined && campaign.userJoined === true) {
      return (
        <TouchableOpacity 
          style={[styles.actionButton, styles.continueButton]}
          onPress={handleStartQuiz}
        >
          <LinearGradient
            colors={[COLORS.SUCCESS, COLORS.SUCCESS]}
            style={styles.actionButtonGradient}
          >
            <Icon name="play-arrow" size={20} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.actionButtonText}>Continue Quiz</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity 
        style={[styles.actionButton, styles.joinButton]}
        onPress={handleJoinCampaign}
        disabled={joining}
      >
        <LinearGradient
          colors={joining 
            ? [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80']
            : [COLORS.PRIMARY, COLORS.PRIMARY]
          }
          style={styles.actionButtonGradient}
        >
          {joining ? (
            <ActivityIndicator size="small" color={COLORS.TEXT_PRIMARY} />
          ) : (
            <Icon name="add" size={20} color={COLORS.TEXT_PRIMARY} />
          )}
          <Text style={styles.actionButtonText}>
            {joining ? 'Joining...' : 'Start Campaign'}
          </Text>
        </LinearGradient>
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
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.errorGradient}
      >
        <Icon name="error" size={48} color={COLORS.ERROR} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadCampaignDetails}
        >
          <LinearGradient
            colors={[COLORS.PRIMARY, COLORS.PRIMARY]}
            style={styles.retryButtonGradient}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
          >
            {renderHeader()}
            {renderLoadingState()}
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
          >
            {renderHeader()}
            {renderErrorState()}
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
            style={styles.gradientContainer}
          >
            {renderHeader()}
            <View style={styles.errorContainer}>
              <LinearGradient
                colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
                style={styles.errorGradient}
              >
                <Icon name="campaign" size={48} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.errorText}>Campaign not found</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient
          colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]}
          style={styles.gradientContainer}
        >
          {/* Corner Gradients */}
          <LinearGradient
            colors={getCornerGradientColors()}
            style={styles.topRightGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <LinearGradient
            colors={getCornerGradientColors().reverse()}
            style={styles.bottomLeftGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          />
          
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
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    position: 'relative',
  },
  topRightGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 250,
    borderBottomLeftRadius: 125,
  },
  bottomLeftGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 250,
    height: 250,
    borderTopRightRadius: 125,
  },
  header: {
    borderRadius: Math.max(16, width * 0.04),
    margin: Math.max(16, width * 0.04),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
  },
  backButton: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonGradient: {
    padding: Math.max(8, width * 0.02),
    borderRadius: Math.max(12, width * 0.03),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  headerRight: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRightGradient: {
    padding: Math.max(8, width * 0.02),
    borderRadius: Math.max(12, width * 0.03),
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: Math.max(200, height * 0.25),
    margin: Math.max(16, width * 0.04),
    borderRadius: Math.max(20, width * 0.05),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroGradient: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    flex: 1,
  },
  videoPlaceholderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholderText: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
    marginTop: Math.max(8, width * 0.02),
  },
  videoSubtext: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: Math.max(4, width * 0.01),
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
  },
  heroPlaceholderGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: Math.max(8, width * 0.02),
  },
  campaignInfo: {
    padding: Math.max(20, width * 0.05),
  },
  campaignTitle: {
    fontSize: Math.max(24, width * 0.06),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(12, width * 0.03),
  },
  campaignDescription: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
    marginBottom: Math.max(20, width * 0.05),
  },
  campaignStats: {
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: Math.max(16, width * 0.04),
    padding: Math.max(16, width * 0.04),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(8, width * 0.02),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
  },
  statLabel: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: Math.max(4, width * 0.01),
  },
  statValue: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginTop: Math.max(2, width * 0.005),
  },
  campaignContent: {
    padding: Math.max(20, width * 0.05),
  },
  contentGradient: {
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentTitle: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(12, width * 0.03),
  },
  contentText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 24,
  },
  imageGallery: {
    padding: Math.max(20, width * 0.05),
  },
  galleryGradient: {
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  galleryTitle: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(12, width * 0.03),
  },
  galleryImage: {
    width: Math.max(120, width * 0.3),
    height: Math.max(80, height * 0.1),
    borderRadius: Math.max(12, width * 0.03),
    marginRight: Math.max(12, width * 0.03),
  },
  actionContainer: {
    padding: Math.max(20, width * 0.05),
    backgroundColor: COLORS.GLASS_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SECONDARY,
  },
  actionButton: {
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
  },
  joinButton: {
    // Gradient already applied
  },
  continueButton: {
    // Gradient already applied
  },
  completedButton: {
    // Gradient already applied
  },
  disabledButton: {
    // Gradient already applied
  },
  actionButtonText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
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
  errorGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(20, width * 0.05),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('MEDIUM'),
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: Math.max(16, width * 0.04),
  },
  retryButton: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: Math.max(16, width * 0.04),
  },
  retryButtonGradient: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(12, width * 0.03),
  },
  retryButtonText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
});

export default CampaignDetailScreen; 