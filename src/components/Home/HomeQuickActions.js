import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

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
            <View style={styles.actionContainer}>
            <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <Icon name={action.icon} size={Math.max(24, width * 0.06)} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>{action.title}</Text>
            </View>
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
    marginBottom: Math.max(24, height * 0.03),
    marginTop: Math.max(16, height * 0.02),
  },
  sectionTitle: {
    fontSize: Math.max(22, width * 0.055),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textShadowColor: COLORS.PRIMARY,
    textShadowRadius: 4,
  },
  sectionBadge: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(6, height * 0.008),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.3)',
  },
  sectionBadgeText: {
    color: COLORS.PRIMARY,
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
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
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    minHeight: Math.max(120, height * 0.15),
  },
  actionContainer: {
    borderRadius: Math.max(20, width * 0.05),
    padding: Math.max(20, width * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
    minHeight: Math.max(120, height * 0.15),
  },
  quickActionIcon: {
    width: Math.max(56, width * 0.14),
    height: Math.max(56, width * 0.14),
    borderRadius: Math.max(28, width * 0.07),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.max(12, height * 0.015),
    shadowColor: COLORS.SHADOW_SECONDARY,
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
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
  },
});

export default HomeQuickActions; 