import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
// DEĞİŞİKLİK: Icon kütüphanesi eklendi
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ficon from 'react-native-vector-icons/FontAwesome5';
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
            {/* DEĞİŞİKLİK: Emoji yerine Icon eklendi */}
            <Icon name="trending-up" size={22} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.statLabel}>Success Rate</Text>
          <Text style={styles.statValue}>%{userData.successRate}</Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            {/* DEĞİŞİKLİK: Emoji yerine Icon eklendi */}
            <Icon name="task-alt" size={22} color={COLORS.PRIMARY} />
          </View>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{userData.completedCampaigns}/{userData.totalCampaigns}</Text>
        </View>
      </View>

      <View style={styles.featuredStatItem}>
        <View style={styles.featuredStatLeft}>
            <View style={styles.statIconContainer}>
                <Ficon name="coins" size={20} color={COLORS.PRIMARY} />
            </View>
            <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <Text style={styles.featuredStatValue}>{userData.totalEarnings} USDT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    padding: Math.max(18, width * 0.05),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 8, },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Math.max(20, height * 0.025),
  },
  statsTitle: {
    fontSize: Math.max(20, width * 0.055),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  statsBadge: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 8,
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
    marginBottom: Math.max(12, height * 0.015),
    gap: Math.max(12, width * 0.03),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Math.max(12, width * 0.03),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.SURFACE,
    minHeight: Math.max(90, height * 0.11),
    justifyContent: 'center',
  },
  statIconContainer: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(6, height * 0.008),
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  // statIcon stili artık kullanılmıyor, kaldırılabilir.
  statLabel: {
    fontSize: Math.max(12, width * 0.032),
    color: COLORS.TEXT_SECONDARY,
    marginBottom: Math.max(4, height * 0.005),
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
  featuredStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Math.max(12, width * 0.03),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.SURFACE,
    marginTop: 4,
  },
  featuredStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredStatValue: {
    fontSize: Math.max(18, width * 0.048),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  }
});

export default HomeStatsCard;