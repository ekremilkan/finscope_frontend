import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

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
    borderColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    shadowColor: '#000',
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
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(99, 102, 241, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  statsBadgeText: {
    color: '#6366f1',
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '700',
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
    borderColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    minHeight: Math.max(100, height * 0.12),
    justifyContent: 'center',
  },
  statIconContainer: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(8, height * 0.01),
  },
  statIcon: {
    fontSize: Math.max(20, width * 0.05),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: Math.max(12, width * 0.032),
    color: 'rgba(148, 163, 184, 0.9)',
    marginBottom: Math.max(6, height * 0.008),
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: Math.max(16, width * 0.043),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default HomeStatsCard; 