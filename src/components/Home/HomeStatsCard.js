import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HomeStatsCard = ({ userData }) => {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>Kullanıcı İstatistikleri</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📈</Text>
          <Text style={styles.statLabel}>Başarı Oranı</Text>
          <Text style={styles.statValue}>%{userData.successRate}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statLabel}>Tamamlanan</Text>
          <Text style={styles.statValue}>{userData.completedCampaigns}/{userData.totalCampaigns} kampanya</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Toplam Kazanç</Text>
          <Text style={styles.statValue}>{userData.totalEarnings} USDT</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    margin: Math.max(20, width * 0.05),
    padding: Math.max(24, width * 0.06),
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    backdropFilter: 'blur(20px)',
  },
  statsHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: Math.max(20, width * 0.055),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(99, 102, 241, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    minHeight: 100,
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: Math.max(28, width * 0.07),
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: Math.max(12, width * 0.032),
    color: 'rgba(148, 163, 184, 0.9)',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  statValue: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default HomeStatsCard; 