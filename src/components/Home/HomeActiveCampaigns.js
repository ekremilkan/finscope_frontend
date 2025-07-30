import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width, height } = Dimensions.get('window');

const HomeActiveCampaigns = ({ activeCampaigns, onCampaignStart, isLoading = false }) => {
  // Loading state
  if (isLoading) {
    return (
      <View style={styles.campaignsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Campaigns</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Live</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      </View>
    );
  }

  // Empty state
  if (!activeCampaigns || activeCampaigns.length === 0) {
    return (
      <View style={styles.campaignsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Campaigns</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Live</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={styles.emptyTitle}>No Active Campaigns</Text>
          <Text style={styles.emptyText}>Check back later for new campaigns!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.campaignsSection}>
      <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Active Campaigns</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>Live</Text>
        </View>
      </View>
      
      {activeCampaigns.map((campaign, index) => {
        // Safe campaign data access
        const campaignId = campaign?._id || campaign?.id || `campaign-${index}`;
        const title = campaign?.title || 'Untitled Campaign';
        const reward = campaign?.reward || 0;
        const participants = campaign?.participants || 0;
        const maxParticipants = campaign?.maxParticipants || 0;
        
        return (
          <TouchableOpacity 
            key={campaignId} 
            style={styles.campaignCard}
            activeOpacity={0.8}
            onPress={() => onCampaignStart(campaign)}
          >
            <View style={styles.cardContainer}>
          <View style={styles.campaignHeader}>
            <View style={styles.campaignInfo}>
                  <View style={styles.campaignIconContainer}>
                    <Text style={styles.campaignIcon}>📊</Text>
                  </View>
              <View style={styles.campaignDetails}>
                    <Text style={styles.campaignTitle} numberOfLines={2}>{title}</Text>
                <View style={styles.campaignMeta}>
                      <View style={styles.rewardContainer}>
                        <Text style={styles.rewardIcon}>💰</Text>
                        <Text style={styles.campaignReward}>{reward} USDT</Text>
                      </View>
                      <View style={styles.participantsContainer}>
                        <Text style={styles.participantsIcon}>👥</Text>
                        <Text style={styles.campaignTime}>
                          {participants}/{maxParticipants}
                        </Text>
                      </View>
                </View>
              </View>
            </View>
                <View style={styles.startButtonContainer}>
                  <View style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
                  </View>
          </View>
        </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  campaignsSection: {
    marginBottom: Math.max(24, height * 0.03),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Math.max(24, height * 0.03),
    marginTop: Math.max(16, height * 0.02),
  },
  sectionTitle: {
    fontSize: Math.max(22, width * 0.055),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: COLORS.PRIMARY,
    textShadowRadius: 4,
  },
  sectionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  sectionBadgeText: {
    color: COLORS.SUCCESS,
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
  },
  campaignCard: {
    marginBottom: Math.max(16, height * 0.02),
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContainer: {
    borderRadius: Math.max(20, width * 0.05),
    padding: Math.max(20, width * 0.05),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  campaignInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  campaignIconContainer: {
    width: Math.max(48, width * 0.12),
    height: Math.max(48, width * 0.12),
    borderRadius: Math.max(12, width * 0.03),
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  campaignIcon: {
    fontSize: Math.max(24, width * 0.06),
  },
  campaignDetails: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.043),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(8, height * 0.01),
    lineHeight: Math.max(20, height * 0.025),
  },
  campaignMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Math.max(8, width * 0.02),
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: Math.max(14, width * 0.037),
    marginRight: 4,
  },
  campaignReward: {
    fontSize: Math.max(14, width * 0.037),
    color: COLORS.SUCCESS,
    ...getFontFamily('SEMIBOLD'),
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsIcon: {
    fontSize: Math.max(14, width * 0.037),
    marginRight: 4,
  },
  campaignTime: {
    fontSize: Math.max(14, width * 0.037),
    color: COLORS.WARNING,
    ...getFontFamily('SEMIBOLD'),
  },
  startButtonContainer: {
    marginLeft: Math.max(16, width * 0.04),
  },
  startButton: {
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(12, height * 0.015),
    borderRadius: Math.max(16, width * 0.04),
    backgroundColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: COLORS.SECONDARY,
    fontSize: Math.max(14, width * 0.037),
    ...getFontFamily('BOLD'),
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(40, height * 0.05),
  },
  loadingText: {
    marginLeft: Math.max(12, width * 0.03),
    color: COLORS.TEXT_PRIMARY,
    fontSize: Math.max(16, width * 0.043),
    ...getFontFamily('MEDIUM'),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(40, height * 0.05),
  },
  emptyIconContainer: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(16, height * 0.02),
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  emptyIcon: {
    fontSize: Math.max(40, width * 0.1),
    color: COLORS.PRIMARY,
  },
  emptyTitle: {
    fontSize: Math.max(20, width * 0.05),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(8, height * 0.01),
  },
  emptyText: {
    fontSize: Math.max(16, width * 0.043),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    lineHeight: Math.max(22, height * 0.028),
    ...getFontFamily('REGULAR'),
  },
});

export default HomeActiveCampaigns; 