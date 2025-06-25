import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomerRecentCampaigns = ({ recentCampaigns }) => {
  return (
    <View style={styles.recentSection}>
      <Text style={styles.sectionTitle}>Son Kampanyalar</Text>
      {recentCampaigns.map((campaign) => (
        <View key={campaign.id} style={styles.campaignCard}>
          <View style={styles.campaignHeader}>
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignIcon}>{campaign.icon}</Text>
              <View style={styles.campaignDetails}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <View style={styles.campaignStats}>
                  <Text style={styles.participantCount}>👥 {campaign.participants} katılımcı</Text>
                  <Text style={styles.successRate}>✅ %{campaign.successRate} başarı</Text>
                </View>
              </View>
            </View>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor: campaign.status === 'active' 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(148, 163, 184, 0.2)'
              }
            ]}>
              <Text style={[
                styles.statusText,
                {
                  color: campaign.status === 'active' ? '#10b981' : '#94a3b8'
                }
              ]}>
                {campaign.status === 'active' ? 'Aktif' : 'Tamamlandı'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  recentSection: {
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
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: Math.max(28, width * 0.07),
    marginRight: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    textAlign: 'center',
    minWidth: 44,
  },
  campaignDetails: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: Math.max(14, width * 0.037),
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  campaignStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  participantCount: {
    fontSize: Math.max(12, width * 0.032),
    color: '#94a3b8',
    fontWeight: '500',
  },
  successRate: {
    fontSize: Math.max(12, width * 0.032),
    color: '#10b981',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: Math.max(12, width * 0.032),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomerRecentCampaigns; 