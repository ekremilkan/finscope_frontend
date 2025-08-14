import React from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width, height } = Dimensions.get('window');

// Bu bileşen artık UserCampaignCard'daki mantığı temel alıyor ve tutarlı veri gösteriyor
const CampaignCard = ({ campaign, onCampaignPress }) => {
  if (!campaign) return null;

  const userStatus = campaign?.userStatus;
  const campaignStatus = campaign?.status;
  
  const isCompleted = userStatus === 'completed';
  const userJoined = userStatus === 'in-progress';
  const isActive = campaignStatus === 'active';
  const isExpired = new Date() > new Date(campaign.endDate);

  // Kampanya bitiş süresini hesaplama
  const getCampaignEndTime = () => {
    if (!campaign?.endDate) return { text: 'N/A', color: COLORS.TEXT_DISABLED };
    
    const now = new Date();
    const end = new Date(campaign.endDate);
    const difference = end - now;

    if (difference <= 0) {
      return { text: 'Finished', color: COLORS.ERROR };
    }

    // 1 saat = 3600000 ms
    if (difference < 3600000) {
      const minutes = Math.floor(difference / (1000 * 60));
      const seconds = Math.floor((difference / 1000) % 60);
      return { 
        text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 
        color: COLORS.WARNING 
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    
    if (days > 0) {
      return { text: `${days}d ${hours}h`, color: COLORS.INFO };
    } else {
      return { text: `${hours}h`, color: COLORS.INFO };
    }
  };

  const getCardState = () => {
    if (isCompleted) {
      return { statusText: 'Success', statusColor: COLORS.SUCCESS, buttonText: 'View' };
    }
    if (isExpired) {
      return { statusText: 'Missed', statusColor: COLORS.ERROR, buttonText: 'View' };
    }
    if (isActive) {
      if (userJoined) {
        return { statusText: 'Active', statusColor: COLORS.PRIMARY, buttonText: 'Continue' };
      }
      return { statusText: 'Active', statusColor: COLORS.PRIMARY, buttonText: 'Start' };
    }
    if (campaignStatus === 'upcoming') {
      return { statusText: 'Upcoming', statusColor: COLORS.WARNING, buttonText: 'View' };
    }
    return { statusText: 'Inactive', statusColor: COLORS.TEXT_DISABLED, buttonText: 'View' };
  };

  const cardState = getCardState();
  const endTimeInfo = getCampaignEndTime();

  // Toplam katılımcı sayısını hesapla - API'den gelen currentParticipants objesi
  const totalParticipants = campaign.currentParticipants ? 
    Object.values(campaign.currentParticipants).reduce((sum, count) => sum + count, 0) : 0;

  // Soru sayısını al - API'den direkt sayı geliyorsa kullan, yoksa questionIds array'inin uzunluğunu al
  const questionCount = campaign.questions || campaign.questionIds?.length || 0;

  return (
    <TouchableOpacity
      style={styles.campaignCard}
      activeOpacity={0.9}
      onPress={() => onCampaignPress(campaign)}
    >
      <View style={styles.cardContainer}>
        <View style={styles.campaignInfo}>
          <View style={[styles.campaignIconContainer, { borderColor: cardState.statusColor + '30', backgroundColor: cardState.statusColor + '15' }]}>
             <Text style={styles.campaignIcon}>📊</Text>
          </View>
          <View style={styles.campaignDetails}>
            <Text style={styles.campaignTitle} numberOfLines={2}>{campaign?.title || 'Untitled Campaign'}</Text>
            <View style={styles.campaignMeta}>
              <View style={styles.metaItem}>
                <Icon name="people" size={14} color={COLORS.PRIMARY} />
                <Text style={styles.metaText}>{totalParticipants}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="quiz" size={14} color={COLORS.INFO} />
                <Text style={styles.metaText}>{questionCount}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="monetization-on" size={14} color={COLORS.SUCCESS} />
                <Text style={styles.metaText}>{campaign?.reward || 0}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.campaignFooter}>
          <View style={styles.statusTimeContainer}>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: cardState.statusColor }]}>{cardState.statusText}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="schedule" size={12} color={endTimeInfo.color} />
              <Text style={[styles.timeText, { color: endTimeInfo.color }]}>{endTimeInfo.text}</Text>
            </View>
          </View>
          
          <View style={styles.startButtonContainer}>
            <View style={[styles.startButton, { backgroundColor: cardState.statusColor === COLORS.SUCCESS ? COLORS.SUCCESS : COLORS.PRIMARY }]}>
              <Text style={styles.startButtonText}>{cardState.buttonText}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeActiveCampaigns = ({ activeCampaigns, onCampaignPress, isLoading = false }) => {
  if (isLoading) {
    return (
      <View style={styles.campaignsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campaigns</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      </View>
    );
  }

  if (!activeCampaigns || activeCampaigns.length === 0) {
    return (
      <View style={styles.campaignsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campaigns</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Campaigns Available</Text>
          <Text style={styles.emptyText}>Check back later!</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.campaignsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Campaigns</Text>
        <View style={styles.sectionBadge}><Text style={styles.sectionBadgeText}>Live</Text></View>
      </View>
      {activeCampaigns.map((campaign) => (
        <CampaignCard
          key={campaign?._id}
          campaign={campaign}
          onCampaignPress={onCampaignPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  campaignsSection: { marginBottom: Math.max(24, height * .03) },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Math.max(16, height * .02), marginTop: Math.max(16, height * .02) },
  sectionTitle: { fontSize: Math.max(22, width * .055), ...getFontFamily('BOLD'), color: COLORS.TEXT_PRIMARY },
  sectionBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  sectionBadgeText: { color: COLORS.SUCCESS, fontSize: 12, ...getFontFamily('SEMIBOLD') },
  campaignCard: { marginBottom: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: .1, shadowRadius: 10, elevation: 5 },
  cardContainer: { borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.BORDER_SECONDARY, backgroundColor: COLORS.CARD_BACKGROUND },
  campaignInfo: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginBottom: 16 },
  campaignIconContainer: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1 },
  campaignIcon: { fontSize: 24 },
  campaignDetails: { flex: 1 },
  campaignTitle: { fontSize: 16, ...getFontFamily('SEMIBOLD'), color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
  campaignMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, ...getFontFamily('MEDIUM'), color: COLORS.TEXT_SECONDARY },
  campaignFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTimeContainer: { flex: 1 },
  statusContainer: { marginBottom: 4 },
  statusText: { fontSize: 13, ...getFontFamily('SEMIBOLD') },
  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontSize: 11, ...getFontFamily('MEDIUM') },
  startButtonContainer: { alignItems: 'center' },
  startButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  startButtonText: { fontSize: 13, ...getFontFamily('BOLD'), color: COLORS.SECONDARY },
  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 12, color: COLORS.TEXT_PRIMARY, fontSize: 16 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40, backgroundColor: COLORS.CARD_BACKGROUND, borderRadius: 20 },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyTitle: { fontSize: 20, ...getFontFamily('BOLD'), color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
  emptyText: { fontSize: 16, color: COLORS.TEXT_SECONDARY, textAlign: 'center' },
});
export default HomeActiveCampaigns;