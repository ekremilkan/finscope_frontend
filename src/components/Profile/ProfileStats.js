import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { getResponsiveSize, processUserStats } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ProfileStats = ({ stats, isLoading = false }) => {
  const StatCard = ({ icon, label, value, color = COLORS.PRIMARY, isLoading = false }) => (
    // Kartın içindeki tüm elemanlar artık tek bir grup olarak ortalanıyor
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {isLoading ? (
        <View style={styles.loadingBar} />
      ) : (
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Financial Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="💰" label="Total Earnings:" value="..." isLoading={true} />
        </View>
      </View>
    );
  }

  const processedStats = processUserStats(stats || {});

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Financial Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          icon="💰"
          label="Total Earnings:"
          value={processedStats.savings || '₺0'}
          color={COLORS.SUCCESS}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginTop: Math.max(16, width * 0.04),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: Math.max(12, width * 0.03),
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  statCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(12, width * 0.03),
    marginBottom: Math.max(10, width * 0.025),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    fontSize: getResponsiveSize(width, 0.08, 24, 36),
    marginRight: Math.max(8, width * 0.02),
  },
  statLabel: {
    fontSize: getResponsiveSize(width, 0.04, 14, 18),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
    marginRight: Math.max(10, width * 0.025),
  },
  statValue: {
    fontSize: getResponsiveSize(width, 0.045, 18, 24),
    ...getFontFamily('BOLD'),
  },
  loadingBar: {
    backgroundColor: COLORS.SURFACE,
    height: Math.max(24, width * 0.06),
    width: '25%',
    borderRadius: 10,
  },
});

export default ProfileStats;