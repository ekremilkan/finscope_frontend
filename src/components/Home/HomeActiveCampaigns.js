import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
          <ActivityIndicator size="large" color="#6366f1" />
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
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)']}
              style={styles.cardGradient}
            >
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
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6']}
                    style={styles.startButton}
                  >
                    <Text style={styles.startButtonText}>Start</Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
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
    marginBottom: Math.max(16, height * 0.02),
  },
  sectionTitle: {
    fontSize: Math.max(22, width * 0.055),
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  sectionBadgeText: {
    color: '#10b981',
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '700',
  },
  campaignCard: {
    marginBottom: Math.max(16, height * 0.02),
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    borderRadius: Math.max(20, width * 0.05),
    padding: Math.max(20, width * 0.05),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
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
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Math.max(16, width * 0.04),
  },
  campaignIcon: {
    fontSize: Math.max(24, width * 0.06),
  },
  campaignDetails: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.043),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Math.max(8, height * 0.01),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    color: '#10b981',
    fontWeight: '600',
    textShadowColor: 'rgba(16, 185, 129, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    color: '#f59e0b',
    fontWeight: '600',
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  startButtonContainer: {
    marginLeft: Math.max(16, width * 0.04),
  },
  startButton: {
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(12, height * 0.015),
    borderRadius: Math.max(16, width * 0.04),
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: Math.max(14, width * 0.037),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(40, height * 0.05),
  },
  loadingText: {
    marginLeft: Math.max(12, width * 0.03),
    color: '#ffffff',
    fontSize: Math.max(16, width * 0.043),
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Math.max(40, height * 0.05),
  },
  emptyIconContainer: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(16, height * 0.02),
  },
  emptyIcon: {
    fontSize: Math.max(40, width * 0.1),
    color: '#f59e0b',
  },
  emptyTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: Math.max(8, height * 0.01),
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  emptyText: {
    fontSize: Math.max(16, width * 0.043),
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    lineHeight: Math.max(22, height * 0.028),
  },
});

export default HomeActiveCampaigns; 