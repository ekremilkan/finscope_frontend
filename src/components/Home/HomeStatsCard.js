import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width, height } = Dimensions.get('window');

const HomeStatsCard = ({ userData }) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>User Statistics</Text>
        <View style={styles.statsBadge}>
          <Text style={styles.statsBadgeText}>Overview</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>📈</Text>
          </View>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statValue}>%{userData.successRate}</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>🎯</Text>
          </View>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{userData.completedCampaigns}/{userData.totalCampaigns}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
          <Text style={styles.statIcon}>💰</Text>
          </View>
          <Text style={styles.statLabel}>Total Earnings</Text>
          <Text style={styles.statValue}>{userData.totalEarnings} USDT</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    padding: Math.max(24, width * 0.06),
    borderRadius: Math.max(24, width * 0.06),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Math.max(24, height * 0.03),
    marginTop: Math.max(16, height * 0.02),
  },
  statsTitle: {
    fontSize: Math.max(20, width * 0.055),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: COLORS.PRIMARY,
    textShadowRadius: 4,
  },
  statsBadge: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  statsBadgeText: {
    color: COLORS.PRIMARY,
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Math.max(16, height * 0.02),
    gap: Math.max(12, width * 0.03),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Math.max(16, width * 0.04),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.SURFACE,
    minHeight: Math.max(100, height * 0.12),
    justifyContent: 'center',
  },
  statIconContainer: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(8, height * 0.01),
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  statIcon: {
    fontSize: Math.max(20, width * 0.05),
  },
  statLabel: {
    fontSize: Math.max(12, width * 0.032),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: Math.max(6, height * 0.008),
    textAlign: 'center',
    ...getFontFamily('SEMIBOLD'),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: Math.max(16, width * 0.043),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
});

export default HomeStatsCard; 