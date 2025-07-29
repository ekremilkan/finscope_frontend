import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  getCampaignStatusColor, 
  getCampaignStatusText, 
  getDifficultyColor,
  getProgressPercentage,
  getTimeRemaining,
  formatCampaignDuration,
  formatCampaignReward,
  formatCampaignParticipants,
  getCampaignDifficultyIcon,
  getJoinButtonText,
  getJoinButtonColor,
  isCampaignActive
} from '../../utils/campaignUtils';

const { width } = Dimensions.get('window');

const CampaignCard = ({ campaign, onJoinCampaign, onPress }) => {
  const progressPercentage = getProgressPercentage(campaign.participants, campaign.maxParticipants);
  const timeRemaining = getTimeRemaining(campaign.endDate);
  const isActive = isCampaignActive(campaign);
  const joinButtonText = getJoinButtonText(campaign);
  const joinButtonColor = getJoinButtonColor(campaign);

  const handleJoinPress = () => {
    if (onJoinCampaign) {
      onJoinCampaign(campaign);
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.campaignCard} 
      activeOpacity={0.8}
      onPress={handleCardPress}
    >
      {/* Campaign Header */}
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignTitle} numberOfLines={2}>
            {campaign.title}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getCampaignStatusColor(campaign.status) + '20' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: getCampaignStatusColor(campaign.status) }
            ]}>
              {getCampaignStatusText(campaign.status)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.campaignDescription} numberOfLines={3}>
          {campaign.description}
        </Text>
      </View>

      {/* Campaign Stats */}
      <View style={styles.campaignStats}>
        <View style={styles.statItem}>
          <Icon name="people" size={16} color="#6366f1" />
          <Text style={styles.statText}>
            {formatCampaignParticipants(campaign.participants, campaign.maxParticipants)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="quiz" size={16} color="#8b5cf6" />
          <Text style={styles.statText}>
            {campaign.questions} soru
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Icon name="monetization-on" size={16} color="#10b981" />
          <Text style={styles.statText}>
            {formatCampaignReward(campaign.reward)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Katılım Oranı</Text>
          <Text style={styles.progressText}>%{progressPercentage}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* Campaign Tags */}
      <View style={styles.campaignTags}>
        {campaign.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        
        {campaign.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{campaign.tags.length - 3}</Text>
        )}
      </View>

      {/* Time Remaining */}
      {isActive && timeRemaining > 0 && (
        <View style={styles.timeRemainingContainer}>
          <Icon name="access-time" size={14} color="#f59e0b" />
          <Text style={styles.timeRemainingText}>
            {timeRemaining.days > 0 
              ? `${timeRemaining.days} gün kaldı`
              : `${timeRemaining.hours} saat kaldı`
            }
          </Text>
        </View>
      )}

      {/* Campaign Footer */}
      <View style={styles.campaignFooter}>
        <View style={styles.footerInfo}>
          {campaign.userCompleted && (
            <View style={styles.completedBadge}>
              <Icon name="check-circle" size={16} color="#10b981" />
              <Text style={styles.completedText}>Tamamlandı</Text>
            </View>
          )}
          
          {campaign.userScore && (
            <Text style={styles.scoreText}>
              Skor: %{campaign.userScore}
            </Text>
          )}
          
          <Text style={styles.createdDate}>
            {new Date(campaign.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.joinButton,
            { backgroundColor: joinButtonColor }
          ]}
          onPress={handleJoinPress}
          disabled={!isActive || campaign.userCompleted}
        >
          <Icon 
            name={campaign.userJoined ? 'play-arrow' : 'add'} 
            size={16} 
            color="#ffffff" 
          />
          <Text style={styles.joinButtonText}>
            {joinButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: Math.max(20, width * 0.05),
    marginBottom: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  campaignHeader: {
    marginBottom: Math.max(16, width * 0.04),
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Math.max(8, width * 0.02),
  },
  campaignTitle: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: Math.max(12, width * 0.03),
  },
  statusBadge: {
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, width * 0.01),
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
  },
  campaignDescription: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    lineHeight: 20,
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Math.max(16, width * 0.04),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#94a3b8',
    marginTop: Math.max(4, width * 0.01),
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: Math.max(16, width * 0.04),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(8, width * 0.02),
  },
  progressLabel: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
  },
  progressText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#6366f1',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  campaignTags: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, width * 0.01),
    borderRadius: 12,
    marginRight: Math.max(8, width * 0.02),
  },
  difficultyIcon: {
    fontSize: Math.max(14, width * 0.035),
    marginRight: Math.max(4, width * 0.01),
  },
  difficultyText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
  },
  tag: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, width * 0.01),
    borderRadius: 12,
    marginRight: Math.max(8, width * 0.02),
  },
  tagText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#6366f1',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#94a3b8',
  },
  timeRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
  },
  timeRemainingText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#f59e0b',
    marginLeft: Math.max(4, width * 0.01),
    fontWeight: '500',
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerInfo: {
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.max(4, width * 0.01),
  },
  completedText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#10b981',
    marginLeft: Math.max(4, width * 0.01),
    fontWeight: '600',
  },
  scoreText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#8b5cf6',
    marginBottom: Math.max(4, width * 0.01),
  },
  createdDate: {
    fontSize: Math.max(12, width * 0.03),
    color: '#94a3b8',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(10, width * 0.025),
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  joinButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: Math.max(6, width * 0.015),
  },
});

export default CampaignCard; 