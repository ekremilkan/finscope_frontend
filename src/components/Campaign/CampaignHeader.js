import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CampaignHeader = ({ navigation, campaignCount, totalCount }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={Math.max(20, Math.min(28, width * 0.06))} color="#6366f1" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Kampanyalar</Text>
        <Text style={styles.headerSubtitle}>
          {campaignCount} kampanya gösteriliyor
          {totalCount !== campaignCount && ` / ${totalCount} toplam`}
        </Text>
      </View>

      <View style={styles.headerRight}>
        <Icon name="campaign" size={Math.max(20, Math.min(28, width * 0.06))} color="#6366f1" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
    minHeight: Math.max(70, width * 0.18),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Math.max(12, width * 0.03),
  },
  headerTitle: {
    fontSize: Math.max(18, Math.min(24, width * 0.06)),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: Math.max(12, Math.min(16, width * 0.04)),
    color: '#94a3b8',
    marginTop: Math.max(4, width * 0.01),
    textAlign: 'center',
  },
  headerRight: {
    padding: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default CampaignHeader; 