import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDifficultyColor, getProgressPercentage } from '../../utils/userCampaignUtils';
import { getCampaignStatusColor, getCampaignStatusText } from '../../data/campaignData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const UserCampaignCard = ({ campaign, onJoinCampaign, onPress }) => {
  return (
    <TouchableOpacity style={styles.campaignCard} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignTitle} numberOfLines={1}>{campaign.title}</Text>
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
        <Text style={styles.campaignDescription} numberOfLines={2}>
          {campaign.description}
        </Text>
      </View>

      <View style={styles.campaignStats}>
        <View style={styles.statItem}>
          <Icon name="people" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.statText}>{campaign.participants}/{campaign.maxParticipants}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="quiz" size={16} color={COLORS.INFO} />
          <Text style={styles.statText}>{campaign.questions} questions</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="monetization-on" size={16} color={COLORS.SUCCESS} />
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
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    padding: Math.max(20, width * 0.05),
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
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
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
  },
  campaignDescription: {
    fontSize: Math.max(14, width * 0.035),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: Math.max(20, width * 0.05),
    ...getFontFamily('REGULAR'),
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
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: Math.max(12, width * 0.03),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    ...getFontFamily('MEDIUM'),
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.SURFACE,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 3,
  },
  campaignTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  tagText: {
    fontSize: Math.max(11, width * 0.028),
    color: COLORS.PRIMARY,
    ...getFontFamily('MEDIUM'),
  },
  moreTagsText: {
    fontSize: Math.max(11, width * 0.028),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
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
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
  },
  createdDate: {
    fontSize: Math.max(11, width * 0.028),
    color: COLORS.TEXT_DISABLED,
    marginTop: 2,
    ...getFontFamily('REGULAR'),
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonJoined: {
    backgroundColor: COLORS.SUCCESS,
    shadowColor: COLORS.SUCCESS,
  },
  joinButtonText: {
    fontSize: Math.max(12, width * 0.03),
    color: COLORS.SECONDARY,
    ...getFontFamily('SEMIBOLD'),
  },
});

export default UserCampaignCard; 