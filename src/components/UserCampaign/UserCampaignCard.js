import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDifficultyColor, getProgressPercentage } from '../../utils/userCampaignUtils';

const { width } = Dimensions.get('window');

const UserCampaignCard = ({ campaign, onJoinCampaign, onPress }) => {
  return (
    <TouchableOpacity style={styles.campaignCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignTitle} numberOfLines={1}>{campaign.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(campaign.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(campaign.difficulty) }]}>
              {campaign.difficulty}
            </Text>
          </View>
        </View>
        <Text style={styles.campaignDescription} numberOfLines={2}>
          {campaign.description}
        </Text>
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.statItem}>
          <Icon name="people" size={16} color="#6366f1" />
          <Text style={styles.statText}>{campaign.participants}/{campaign.maxParticipants}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="quiz" size={16} color="#8b5cf6" />
          <Text style={styles.statText}>{campaign.questions} questions</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="monetization-on" size={16} color="#10b981" />
          <Text style={styles.statText}>{campaign.reward} USDT</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Participation: {getProgressPercentage(campaign.participants, campaign.maxParticipants)}%</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage(campaign.participants, campaign.maxParticipants)}%` }
            ]} 
          />
        </View>
      </View>

      <View style={styles.campaignTags}>
        {campaign.tags && campaign.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {campaign.tags && campaign.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{campaign.tags.length - 3}</Text>
        )}
      </View>

      <View style={styles.campaignFooter}>
        <View style={styles.footerInfo}>
          <Text style={styles.statusText}>
            {campaign.status === 'active' ? 'Active' : 
             campaign.status === 'upcoming' ? 'Upcoming' : 
             campaign.status === 'expired' ? 'Expired' : 'Unknown'}
          </Text>
          <Text style={styles.createdDate}>
            {new Date(campaign.createdAt).toLocaleDateString('en-US')}
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            campaign.userJoined && styles.joinButtonJoined
          ]}
          onPress={() => {
            if (campaign.userJoined) {
              onJoinCampaign(campaign._id);
            } else {
              // Navigate to campaign detail page
              if (onPress) {
                onPress();
              }
            }
          }}
        >
          <Icon 
            name={campaign.userJoined ? 'play-arrow' : 'visibility'} 
            size={16} 
            color="#ffffff" 
          />
          <Text style={styles.joinButtonText}>
            {campaign.userJoined ? 'Continue' : 'View Details'}
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  campaignHeader: {
    marginBottom: 16,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
  },
  campaignDescription: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.9)',
    lineHeight: Math.max(20, width * 0.05),
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.9)',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    marginBottom: 8,
    fontWeight: '500',
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  tagText: {
    fontSize: Math.max(11, width * 0.028),
    color: '#6366f1',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: Math.max(11, width * 0.028),
    color: 'rgba(148, 163, 184, 0.8)',
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
  statusText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
  },
  createdDate: {
    fontSize: Math.max(11, width * 0.028),
    color: 'rgba(148, 163, 184, 0.6)',
    marginTop: 2,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonJoined: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  joinButtonText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default UserCampaignCard; 