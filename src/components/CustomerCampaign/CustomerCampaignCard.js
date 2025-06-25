import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getStatusColor, getStatusText, getProgressPercentage } from '../../utils/campaignUtils';

const { width } = Dimensions.get('window');

const CustomerCampaignCard = ({ campaign, onDelete, onToggleStatus }) => {
  const handleDelete = () => {
    Alert.alert(
      'Kampanyayı Sil',
      'Bu kampanyayı silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDelete(campaign.id)
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.campaignCard} activeOpacity={0.8}>
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignTitle} numberOfLines={2}>{campaign.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(campaign.status) }]}>
              {getStatusText(campaign.status)}
            </Text>
          </View>
        </View>
        <Text style={styles.campaignDescription} numberOfLines={2}>
          {campaign.description}
        </Text>
      </View>

      <View style={styles.campaignMetrics}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Icon name="people" size={16} color="#6366f1" />
            <Text style={styles.metricValue}>{campaign.participants}</Text>
            <Text style={styles.metricLabel}>Katılımcı</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="monetization-on" size={16} color="#10b981" />
            <Text style={styles.metricValue}>{campaign.reward}</Text>
            <Text style={styles.metricLabel}>USDT Ödül</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="trending-up" size={16} color="#f59e0b" />
            <Text style={styles.metricValue}>%{campaign.conversionRate}</Text>
            <Text style={styles.metricLabel}>Başarı</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="payments" size={16} color="#8b5cf6" />
            <Text style={styles.metricValue}>{campaign.totalSpent}</Text>
            <Text style={styles.metricLabel}>Harcama</Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Doluluk Oranı</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage(campaign.participants, campaign.maxParticipants)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          %{getProgressPercentage(campaign.participants, campaign.maxParticipants)}
        </Text>
      </View>

      <View style={styles.campaignTags}>
        {campaign.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {campaign.tags.length > 3 && (
          <Text style={styles.moreTagsText}>+{campaign.tags.length - 3}</Text>
        )}
      </View>

      <View style={styles.campaignActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onToggleStatus(campaign.id)}
        >
          <Icon 
            name={campaign.status === 'active' ? 'pause' : 'play-arrow'} 
            size={16} 
            color="#6366f1" 
          />
          <Text style={styles.actionText}>
            {campaign.status === 'active' ? 'Duraklat' : 'Başlat'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="edit" size={16} color="#10b981" />
          <Text style={styles.actionText}>Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="analytics" size={16} color="#f59e0b" />
          <Text style={styles.actionText}>Rapor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleDelete}
        >
          <Icon name="delete" size={16} color="#ef4444" />
          <Text style={[styles.actionText, { color: '#ef4444' }]}>Sil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: Math.max(20, width * 0.05),
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  campaignHeader: {
    marginBottom: 16,
  },
  campaignTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
  },
  campaignDescription: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.9)',
    lineHeight: Math.max(20, width * 0.05),
  },
  campaignMetrics: {
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '700',
    color: '#ffffff',
  },
  metricLabel: {
    fontSize: Math.max(11, width * 0.028),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressLabel: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
    minWidth: 60,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  progressText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '600',
    minWidth: 30,
  },
  campaignTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  tagText: {
    fontSize: Math.max(11, width * 0.028),
    color: '#6366f1',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: Math.max(11, width * 0.028),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '500',
  },
  campaignActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.9)',
    fontWeight: '500',
  },
});

export default CustomerCampaignCard; 