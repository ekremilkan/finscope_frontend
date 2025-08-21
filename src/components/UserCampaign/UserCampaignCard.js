import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProgressPercentage } from '../../utils/userCampaignUtils';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

// Geri sayım sayacı
const CountdownTimer = ({ startDate, endDate, status }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!startDate || !endDate) { setTimeLeft('Invalid Date'); return; }
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now > end) { setTimeLeft('Missed'); return; }
      if (status === 'upcoming') {
        const difference = start - now;
        if (difference <= 0) { setTimeLeft('Started'); return; }
        if (difference < 60 * 60 * 1000) {
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          if (days > 0) {
            setTimeLeft(`${days}d ${hours}h`);
          } else {
            const totalHours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            setTimeLeft(`${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
          }
        }
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate, status]);
  return { timeLeft };
};


const UserCampaignCard = ({ campaign, onPress }) => {
  if (!campaign) return null;

  // --- Veri ve Durum Değişkenleri ---
  const toDisplayValue = (value, fallback = 0) => (typeof value === 'object' && value !== null) ? fallback : (value || fallback);
  const totalCurrentParticipants = toDisplayValue(campaign.participants);
  const totalMaxParticipants = toDisplayValue(campaign.maxParticipants, 1);
  const campaignStatus = campaign?.status || 'inactive';
  const userStatus = campaign?.userStatus;

  const isCompleted = userStatus === 'completed';
  const userJoined = userStatus === 'in-progress';
  const isActive = campaignStatus === 'active';
  
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  const isExpired = now > endDate;

  const { timeLeft } = CountdownTimer({
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    status: campaignStatus
  });

  const handlePressAction = () => { if (onPress) { onPress(); } };

  // --- Tüm Durum ve Buton Mantığı ---
  const getCardState = () => {
    // 1. ÖNCELİK: Kullanıcı tamamladıysa.
    if (isCompleted) {
      return {
        statusText: 'Success',
        statusColor: COLORS.SUCCESS,
        buttonText: 'View',
        buttonIcon: 'visibility',
        isButtonDisabled: false,
      };
    }

    // 2. ÖNCELİK: Kampanya süresi bittiyse (ve tamamlanmadıysa).
    if (isExpired) {
      return {
        statusText: 'Missed',
        statusColor: COLORS.ERROR,
        buttonText: 'View Details',
        buttonIcon: 'visibility',
        isButtonDisabled: false,
      };
    }
    
    // 3. ÖNCELİK: Kampanya aktifse.
    if (isActive) {
      // ✅ DEĞİŞİKLİK: Eğer kullanıcı katılmış ama bitirmemişse buton "Continue" olur.
      if (userJoined) {
        return {
          statusText: 'Active',
          statusColor: COLORS.PRIMARY,
          buttonText: 'Continue',
          buttonIcon: 'play-arrow',
          isButtonDisabled: false,
        };
      }
      // Eğer aktif ama kullanıcı henüz katılmamışsa buton "View Details" olur.
      return {
        statusText: 'Active',
        statusColor: COLORS.PRIMARY,
        buttonText: 'View Details',
        buttonIcon: 'chevron-right',
        isButtonDisabled: false,
      };
    }

    // 4. ÖNCELİK: Kampanya yaklaşıyorsa.
    if (campaignStatus === 'upcoming') {
      return {
        statusText: 'Upcoming',
        statusColor: COLORS.WARNING,
        buttonText: 'View',
        buttonIcon: 'visibility',
        isButtonDisabled: false,
      };
    }

    // Diğer tüm durumlar (inactive vb.)
    return {
      statusText: 'Inactive',
      statusColor: COLORS.TEXT_DISABLED,
      buttonText: 'View Details',
      buttonIcon: 'visibility',
      isButtonDisabled: true,
    };
  };

  const cardState = getCardState();
  const progressPercentage = getProgressPercentage(totalCurrentParticipants, totalMaxParticipants);

  return (
    <TouchableOpacity
      style={[styles.campaignCard, cardState.isButtonDisabled && styles.campaignCardDisabled]}
      activeOpacity={0.8}
      onPress={handlePressAction}
      disabled={cardState.isButtonDisabled}
    >
      <View style={styles.campaignHeader}>
        <View style={styles.campaignTitleRow}>
          <Text style={styles.campaignTitle} numberOfLines={1}>{campaign?.title || 'Untitled Campaign'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: cardState.statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: cardState.statusColor }]}>{cardState.statusText}</Text>
          </View>
        </View>
        <Text style={styles.campaignDescription} numberOfLines={2}>{campaign?.description || 'No description available.'}</Text>
      </View>
      <View style={styles.campaignStats}>
        {/* <View style={styles.statItem}><Icon name="people" size={16} color={COLORS.PRIMARY} /><Text style={styles.statText}>{totalCurrentParticipants}/{totalMaxParticipants}</Text></View>
        <View style={styles.statItem}><Icon name="quiz" size={16} color={COLORS.INFO} /><Text style={styles.statText}>{toDisplayValue(campaign.questions)} questions</Text></View> */}
        <View style={styles.statItem}><Icon name="monetization-on" size={16} color={COLORS.SUCCESS} /><Text style={styles.statText}>{toDisplayValue(campaign.reward)} USDT</Text></View>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Participation: {progressPercentage}%</Text>
        <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${progressPercentage}%` }]} /></View>
      </View>
      <View style={styles.campaignFooter}>
        <View style={styles.footerInfo}>
          {cardState.statusText === 'Upcoming' ? (
            <View style={styles.countdownContainer}><Icon name="schedule" size={16} color={COLORS.WARNING} /><Text style={styles.countdownText}>Starts in {timeLeft}</Text></View>
          ) : (
            <View style={styles.countdownContainer}>
               <Icon name={cardState.statusText === 'Success' ? 'check-circle' : cardState.statusText === 'Missed' ? 'event-busy' : 'fiber-manual-record'} size={16} color={cardState.statusColor} />
               <Text style={[styles.statusText, { color: cardState.statusColor, fontSize: 14 }]}>{cardState.statusText}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            { backgroundColor: cardState.isButtonDisabled ? COLORS.TEXT_DISABLED : cardState.statusColor === COLORS.SUCCESS ? COLORS.SUCCESS : COLORS.PRIMARY }
          ]}
          onPress={handlePressAction}
          disabled={cardState.isButtonDisabled}
        >
          <Icon name={cardState.buttonIcon} size={16} color={cardState.isButtonDisabled ? COLORS.TEXT_DISABLED : "#181818"} />
          <Text style={[ styles.joinButtonText, {color: cardState.isButtonDisabled ? COLORS.TEXT_DISABLED : '#181818'} ]}>
            {cardState.buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  campaignCard: { backgroundColor: COLORS.CARD_BACKGROUND, borderRadius: 8, padding: Math.max(16, width * .04), marginBottom: 16, borderWidth: 1, borderColor: 'rgba(247, 214, 72, 0.1)' },
  campaignCardDisabled: { opacity: .7 },
  campaignHeader: { marginBottom: 16 },
  campaignTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  campaignTitle: { fontSize: Math.max(16, width * .04), ...getFontFamily('SEMIBOLD'), color: COLORS.TEXT_PRIMARY, flex: 1, marginRight: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, minWidth: 70, alignItems: 'center' },
  statusText: { fontSize: Math.max(12, width * .03), ...getFontFamily('SEMIBOLD') },
  campaignDescription: { fontSize: Math.max(14, width * .035), color: COLORS.TEXT_SECONDARY, lineHeight: Math.max(20, width * .05), ...getFontFamily('REGULAR') },
  campaignStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: Math.max(12, width * .03), color: COLORS.TEXT_SECONDARY, ...getFontFamily('MEDIUM') },
  progressContainer: { marginBottom: 16 },
  progressLabel: { fontSize: Math.max(12, width * .03), color: COLORS.TEXT_SECONDARY, marginBottom: 8, ...getFontFamily('MEDIUM') },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.PRIMARY, borderRadius: 3 },
  campaignFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(247, 214, 72, 0.1)' },
  footerInfo: { flex: 1, justifyContent: 'center' },
  countdownContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countdownText: { fontSize: 14, ...getFontFamily('BOLD'), color: COLORS.WARNING },
  joinButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, gap: 6 },
  joinButtonText: { fontSize: Math.max(14, width * .035), ...getFontFamily },
});

export default UserCampaignCard;