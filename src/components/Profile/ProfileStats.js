import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize, processUserStats } from '../../utils/profileUtils';
import { COLORS } from '../../data/profileData';

const { width } = Dimensions.get('window');

const ProfileStats = ({ stats, isLoading = false }) => {
  const StatCard = ({ icon, label, value, color = COLORS.primary, isLoading = false }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      {isLoading ? (
        <View style={styles.loadingBar}>
          <Text style={styles.loadingText}>...</Text>
        </View>
      ) : (
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      )}
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>📈 Financial Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="💰" label="Total Savings" value="..." isLoading={true} />
          <StatCard icon="📊" label="Transaction Count" value="..." isLoading={true} />
          <StatCard icon="📈" label="Investment Return" value="..." isLoading={true} />
          <StatCard icon="⭐" label="Credit Score" value="..." isLoading={true} />
        </View>
      </View>
    );
  }

  const processedStats = processUserStats(stats || {});

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📈 Financial Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon="💰"
          label="Total Savings"
          value={processedStats.savings || '₺0'}
          color={COLORS.success}
        />
        <StatCard
          icon="📊"
          label="Transaction Count"
          value={processedStats.transactions || '0'}
          color={COLORS.primary}
        />
        <StatCard
          icon="📈"
          label="Investment Return"
          value={processedStats.returns || '0%'}
          color={processedStats.returns?.includes('+') ? COLORS.success : COLORS.error}
        />
        <StatCard
          icon="⭐"
          label="Credit Score"
          value={processedStats.creditScore || '0'}
          color={getCreditScoreColor(processedStats.creditScore)}
        />
      </View>
    </View>
  );
};

const getCreditScoreColor = (score) => {
  const numScore = parseInt(score) || 0;
  if (numScore >= 750) return COLORS.success;
  if (numScore >= 650) return COLORS.warning;
  if (numScore >= 500) return '#ff6b35';
  return COLORS.error;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    ...getGlassMorphismStyle(0.7),
    width: '48%',
    alignItems: 'center',
    paddingVertical: Math.max(20, width * 0.05),
    paddingHorizontal: Math.max(12, width * 0.03),
    marginBottom: Math.max(12, width * 0.03),
  },
  statIcon: {
    fontSize: getResponsiveSize(width, 0.08, 24, 36),
    marginBottom: Math.max(8, width * 0.02),
  },
  statValue: {
    fontSize: getResponsiveSize(width, 0.04, 16, 22),
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingBar: {
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    height: Math.max(20, width * 0.05),
    borderRadius: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
  },
});

export default ProfileStats;
