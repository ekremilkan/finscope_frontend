import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const HomeQuickActions = ({ quickActions }) => {
  return (
    <View style={styles.quickActionsSection}>
      <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>Tools</Text>
        </View>
      </View>
      
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionItem}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[`${action.color}20`, `${action.color}10`]}
              style={styles.actionGradient}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={Math.max(24, width * 0.06)} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsSection: {
    marginBottom: Math.max(24, height * 0.03),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Math.max(16, height * 0.02),
  },
  sectionTitle: {
    fontSize: Math.max(22, width * 0.055),
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  sectionBadgeText: {
    color: '#8b5cf6',
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Math.max(12, width * 0.03),
  },
  quickActionItem: {
    width: (width - Math.max(64, width * 0.16)) / 2,
    borderRadius: Math.max(20, width * 0.05),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minHeight: Math.max(120, height * 0.15),
  },
  actionGradient: {
    borderRadius: Math.max(20, width * 0.05),
    padding: Math.max(20, width * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    minHeight: Math.max(120, height * 0.15),
  },
  quickActionIcon: {
    width: Math.max(56, width * 0.14),
    height: Math.max(56, width * 0.14),
    borderRadius: Math.max(28, width * 0.07),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.max(12, height * 0.015),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionTitle: {
    fontSize: Math.max(14, width * 0.037),
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default HomeQuickActions; 