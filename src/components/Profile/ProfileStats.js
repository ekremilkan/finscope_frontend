import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import { getResponsiveSize, processUserStats } from '../../utils/profileUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const ICON_COLOR = '#F7D648';

const ProfileStats = ({ stats, isLoading = false }) => {
  const StatCard = ({ iconName, label, value, color = COLORS.PRIMARY, isLoading = false }) => (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer,{ backgroundColor: 'rgba(247, 214, 72, 0.1)' }]}>
          <Icon name={iconName} size={20} color={ICON_COLOR}/>
      </View>
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
          <StatCard iconName="coins" label="Total Earnings:" value="..." isLoading={true} />
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
          iconName="coins"
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
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    marginBottom: Math.max(10, width * 0.025),
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Math.max(12, width * 0.03),
  },
  statLabel: {
    fontSize: getResponsiveSize(width, 0.04, 16, 20),
    color: COLORS.TEXT_SECONDARY,
    ...getFontFamily('MEDIUM'),
    flex: 1,
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