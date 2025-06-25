import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CustomerKPICards = ({ kpiCards }) => {
  return (
    <View style={styles.kpiSection}>
      <Text style={styles.sectionTitle}>Performance Summary</Text>
      <View style={styles.kpiGrid}>
        {kpiCards.map((kpi) => (
          <View key={kpi.id} style={[styles.kpiCard, { borderLeftColor: kpi.color }]}>
            <View style={styles.kpiHeader}>
              <Icon name={kpi.icon} size={24} color={kpi.color} />
              <Text style={styles.kpiTitle}>{kpi.title}</Text>
            </View>
            <View style={styles.kpiValueContainer}>
              <Text style={[styles.kpiValue, { color: kpi.color }]}>
                {kpi.value} {kpi.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  kpiSection: {
    margin: Math.max(20, width * 0.05),
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiCard: {
    width: (width - Math.max(64, width * 0.16)) / 2,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
    borderLeftWidth: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiTitle: {
    fontSize: Math.max(12, width * 0.032),
    color: 'rgba(148, 163, 184, 0.9)',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  kpiValueContainer: {
    alignItems: 'flex-start',
  },
  kpiValue: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default CustomerKPICards; 