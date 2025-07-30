import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getGlassMorphismStyle, getResponsiveSize, processUserStats } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ProfileStats = ({ stats, isLoading = false }) => {
  const StatCard = ({ icon, label, value, color = COLORS.PRIMARY, isLoading = false }) => (
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
          color={COLORS.SUCCESS}
        />
        <StatCard
          icon="📊"
          label="Transaction Count"
          value={processedStats.transactions || '0'}
          color={COLORS.PRIMARY}
        />
        <StatCard
          icon="📈"
          label="Investment Return"
          value={processedStats.returns || '0%'}
          color={processedStats.returns?.includes('+') ? COLORS.SUCCESS : COLORS.ERROR}
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
  if (numScore >= 750) return COLORS.SUCCESS;
  if (numScore >= 650) return COLORS.WARNING;
  if (numScore >= 500) return '#ff6b35';
  return COLORS.ERROR;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(20, width * 0.05),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(16, width * 0.04),
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
    paddingVertical: Math.max(20, width * 0.05),
    paddingHorizontal: Math.max(12, width * 0.03),
    marginBottom: Math.max(12, width * 0.03),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: getResponsiveSize(width, 0.08, 24, 36),
    marginBottom: Math.max(8, width * 0.02),
  },
  statValue: {
    fontSize: getResponsiveSize(width, 0.04, 16, 22),
    ...getFontFamily('BOLD'),
    marginBottom: 4,
  },
  statLabel: {
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    ...getFontFamily('MEDIUM'),
  },
  loadingBar: {
    backgroundColor: COLORS.SURFACE,
    height: Math.max(20, width * 0.05),
    borderRadius: 10,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: getResponsiveSize(width, 0.03, 12, 16),
  },
});

export default ProfileStats;
