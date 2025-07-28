import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const HomeActiveCampaigns = ({ activeCampaigns, onCampaignStart, isLoading = false }) => {
  // Loading state
  if (isLoading) {
    return (
      <View style={styles.campaignsSection}>
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
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
        <Text style={styles.sectionTitle}>Active Campaigns</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Active Campaigns</Text>
          <Text style={styles.emptyText}>Check back later for new campaigns!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.campaignsSection}>
      <Text style={styles.sectionTitle}>Active Campaigns</Text>
      {activeCampaigns.map((campaign, index) => {
        // Safe campaign data access
        const campaignId = campaign?._id || campaign?.id || `campaign-${index}`;
        const title = campaign?.title || 'Untitled Campaign';
        const reward = campaign?.reward || 0;
        const participants = campaign?.participants || 0;
        const maxParticipants = campaign?.maxParticipants || 0;
        
        return (
          <View key={campaignId} style={styles.campaignCard}>
            <View style={styles.campaignHeader}>
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignIcon}>📊</Text>
                <View style={styles.campaignDetails}>
                  <Text style={styles.campaignTitle}>{title}</Text>
                  <View style={styles.campaignMeta}>
                    <Text style={styles.campaignReward}>💰 {reward} USDT</Text>
                    <Text style={styles.campaignTime}>
                      ⏱️ {participants}/{maxParticipants} participants
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.startButton} 
                activeOpacity={0.8}
                onPress={() => onCampaignStart(campaign)}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  campaignsSection: {
    paddingHorizontal: Math.max(20, width * 0.05),
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  campaignCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: Math.max(20, width * 0.05),
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
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
  campaignIcon: {
    fontSize: Math.max(32, width * 0.08),
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    textAlign: 'center',
    minWidth: 48,
  },
  campaignDetails: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.043),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  campaignMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  campaignReward: {
    fontSize: Math.max(14, width * 0.037),
    color: '#10b981',
    fontWeight: '600',
    textShadowColor: 'rgba(16, 185, 129, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  campaignTime: {
    fontSize: Math.max(14, width * 0.037),
    color: '#f59e0b',
    fontWeight: '600',
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  startButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: Math.max(24, width * 0.06),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
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
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: '#ffffff',
    fontSize: Math.max(16, width * 0.043),
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: Math.max(48, width * 0.12),
    marginBottom: 10,
    color: '#f59e0b',
  },
  emptyTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(245, 158, 11, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  emptyText: {
    fontSize: Math.max(16, width * 0.043),
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});

export default HomeActiveCampaigns; 