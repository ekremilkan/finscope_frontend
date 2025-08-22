import React, { useState, useEffect } from 'react'; // GÜNCELLEME: Canlı geri sayım için useState ve useEffect eklendi
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width, height } = Dimensions.get('window');

const CampaignCard = ({ campaign, onCampaignPress }) => {
    if (!campaign) return null;
    
    // GÜNCELLEME: Geri sayım için state tanımlandı
    const [timeInfo, setTimeInfo] = useState({ text: '', color: COLORS.INFO, label: 'Remaining' });

    const ICON_COLOR = '#F7D648';
    const userStatus = campaign?.userStatus;
    const campaignStatus = campaign?.status;
    
    const isCompleted = userStatus === 'completed';
    const userJoined = userStatus === 'in-progress';
    const isActive = campaignStatus === 'active';
  
    // GÜNCELLEME: Canlı geri sayım ve durum geçişlerini yöneten useEffect hook'u
    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            let targetDate, label, isUpcomingCountdown = false;

            // Eğer kampanya "upcoming" ise ve başlangıç tarihi henüz gelmediyse, başlangıç tarihine geri sayım yap
            if (campaignStatus === 'upcoming' && new Date(campaign.startDate) > now) {
                targetDate = new Date(campaign.startDate);
                label = 'Starts In';
                isUpcomingCountdown = true;
            } else {
                // Diğer tüm durumlar için (aktif, veya başlamış upcoming) bitiş tarihini kullan
                targetDate = new Date(campaign.endDate);
                label = 'Remaining';
            }
    
            const difference = targetDate - now;
    
            if (difference <= 0) {
                // Eğer başlangıç sayacı bittiyse ve hala buradaysak, normal bitiş sayacına geç.
                // Eğer bitiş sayacı da bittiyse, 'Finished' göster.
                if (!isUpcomingCountdown) {
                    setTimeInfo({ text: 'Finished', color: COLORS.ERROR, label: 'Status' });
                }
                // (Başlangıç sayacı bittiğinde, bir sonraki saniyede bu bloktan çıkıp normal bitiş sayacına geçecek)
                return; 
            }
    
            // 1 saatin altındaysa Dakika:Saniye formatında göster
            if (difference < 3600000) {
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeInfo({
                    text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                    color: COLORS.WARNING,
                    label: label
                });
            } else { // 1 saatten fazlaysa Gün:Saat formatında göster
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                setTimeInfo({
                    text: days > 0 ? `${days}d ${hours}h` : `${hours}h`,
                    color: COLORS.INFO,
                    label: label
                });
            }
        };
    
        calculateTime(); // Bileşen yüklendiğinde hemen 1 kere çalıştır
        const interval = setInterval(calculateTime, 1000); // Her saniye güncelle
    
        // Bileşen ekrandan kaldırıldığında interval'ı temizle (hafıza sızıntısını önler)
        return () => clearInterval(interval);
    }, [campaign, campaignStatus]); // campaign veya status değiştiğinde sayacı yeniden başlat
  
    const getCardState = () => {
      const isExpired = new Date() > new Date(campaign.endDate);

      if (isCompleted) {
        return { 
          statusText: 'Completed', 
          statusColor: COLORS.SUCCESS, 
          buttonText: 'View Results',
          buttonColor: ICON_COLOR,
          iconName: 'check-circle',
          bgColor: COLORS.PRIMARY + '10'
        };
      }
      if (isExpired) {
        return { 
          statusText: 'Expired', 
          statusColor: COLORS.ERROR, 
          buttonText: 'View Details',
          buttonColor: ICON_COLOR, 
          iconName: 'error',
          bgColor: COLORS.PRIMARY + '10'
        };
      }
      if (isActive || (campaignStatus === 'upcoming' && new Date(campaign.startDate) <= new Date())) {
        if (userJoined) {
          return { 
            statusText: 'In Progress', 
            statusColor: COLORS.PRIMARY, 
            buttonText: 'Continue',
            iconName: 'play-circle-filled',
            bgColor: COLORS.PRIMARY + '10'
          };
        }
        return { 
          statusText: 'Active', 
          statusColor: COLORS.PRIMARY, 
          buttonText: 'Join Now',
          textColor: COLORS.TEXT_BLACK,
          iconName: 'campaign',
          bgColor: COLORS.PRIMARY + '10'
        };
      }
      if (campaignStatus === 'upcoming') {
        // GÜNCELLEME: Renkler ICON_COLOR ile uyumlu hale getirildi
        return { 
          statusText: 'Upcoming', 
          statusColor: ICON_COLOR, 
          buttonText: 'View Details',
          textColor: COLORS.TEXT_BLACK,
          iconName: 'schedule',
          bgColor: ICON_COLOR + '10'
        };
      }
      return { 
        statusText: 'Inactive', 
        statusColor: COLORS.TEXT_DISABLED, 
        buttonText: 'View Details',
        buttonColor: ICON_COLOR,
        iconName: 'pause-circle-filled',
        bgColor: COLORS.TEXT_DISABLED + '10'
      };
    };
  
    const cardState = getCardState();
  
    return (
      <TouchableOpacity
        style={[
          styles.campaignCard,
          { backgroundColor: cardState.bgColor }
        ]}
        activeOpacity={0.8}
        onPress={() => onCampaignPress(campaign)}
      >
        <View style={styles.cardContainer}>
          <View style={[styles.statusBadge, { backgroundColor: cardState.statusColor }]}>
            <Icon name={cardState.iconName} size={12} color="#181818" />
            <Text style={styles.statusBadgeText}>{cardState.statusText}</Text>
          </View>

          <View style={styles.headerSection}>
            <View style={[styles.iconWrapper, { backgroundColor: cardState.statusColor + '20' }]}>
              <Icon name="campaign" size={24} color={cardState.statusColor} />
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.campaignTitle} numberOfLines={2}>
                {campaign?.title || 'Untitled Campaign'}
              </Text>
              <Text style={styles.campaignSubtitle} numberOfLines={1}>
                {campaign?.description || 'Complete tasks and earn rewards'}
              </Text>
            </View>
          </View>

          <View style={styles.contentSection}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icon name="monetization-on" size={16} color={COLORS.SUCCESS} />
                </View>
                <View>
                  <Text style={styles.statValue}>{campaign?.reward || 0}</Text>
                  <Text style={styles.statLabel}>Rewards</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIconContainer}>
                  <Icon name="schedule" size={16} color={timeInfo.color} />
                </View>
                <View>
                  {/* GÜNCELLEME: Kalan süre bilgisi state'den alınıyor */}
                  <Text style={[styles.statValue, { color: timeInfo.color }]}>
                    {timeInfo.text}
                  </Text>
                  <Text style={styles.statLabel}>{timeInfo.label}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionSection}>
            {/* GÜNCELLEME: Butona onPress eylemi eklendi */}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: cardState.buttonColor || cardState.statusColor }]}
              activeOpacity={0.8}
              onPress={() => onCampaignPress(campaign)}
            >
              <Text style={styles.actionButtonText}>{cardState.buttonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
};

// ... (HomeActiveCampaigns ve styles kısımları aynı kalabilir, değişiklik gerekmiyor)
const HomeActiveCampaigns = ({ activeCampaigns, onCampaignPress, isLoading = false, showAllCampaigns, onViewMorePress }) => {
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
            <View style={styles.emptyIconContainer}>
              <Icon name="campaign" size={48} color={COLORS.TEXT_SECONDARY} />
            </View>
            <Text style={styles.emptyTitle}>No Active Campaigns</Text>
            <Text style={styles.emptyText}>New campaigns will appear here when available</Text>
          </View>
        </View>
      );
  }
  
  const campaignsToDisplay = showAllCampaigns ? activeCampaigns : activeCampaigns.slice(0, 3);
  
  return (
    <View style={styles.campaignsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Campaigns</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Live</Text>
          </View>
        </View>
        <Text style={styles.campaignCount}>{activeCampaigns.length} Available</Text>
      </View>

      <View style={styles.campaignsList}>
        {campaignsToDisplay.map((campaign) => (
          <View key={campaign?._id} style={styles.cardWrapper}>
            <CampaignCard
              campaign={campaign}
              onCampaignPress={onCampaignPress}
            />
          </View>
        ))}
      </View>

      {!showAllCampaigns && activeCampaigns.length > 3 && (
        <TouchableOpacity style={styles.viewMoreButton} onPress={onViewMorePress} activeOpacity={0.7}>
          <Text style={styles.viewMoreText}>View More</Text>
          <Icon name="arrow-forward" size={16} color={COLORS.PRIMARY} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  campaignsSection: {
    marginBottom: Math.max(32, height * 0.04),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Math.max(20, height * 0.025),
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: Math.max(24, width * 0.06),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SUCCESS + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.SUCCESS,
  },
  liveBadgeText: {
    fontSize: 10,
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SUCCESS,
    textTransform: 'uppercase',
  },
  campaignCount: {
    fontSize: 14,
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
  },
  campaignsList: {
    gap: 8,
  },
  cardWrapper: {
    // Container for individual cards with consistent spacing
  },
  campaignCard: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginHorizontal: 2, // Prevent shadow clipping
    marginVertical: 4,
  },
  cardContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY + '50',
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    ...getFontFamily('SEMIBold'),
    color: '#181818',
    textTransform: 'uppercase',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingRight: 100, // Space for status badge
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleSection: {
    flex: 1,
    paddingTop: 2,
  },
  campaignTitle: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
    lineHeight: Math.max(22, width * 0.055),
  },
  campaignSubtitle: {
    fontSize: 14,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  contentSection: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.CARD_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
  },
  statValue: {
    fontSize: 16,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: 11,
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.BORDER_SECONDARY,
    marginHorizontal: 8,
  },
  actionSection: {
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    ...getFontFamily('SEMIBOLD'),
    color: '#181818',
  },
  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SECONDARY + '50',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.BORDER_SECONDARY + '30',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end', // Butonu sağa yaslar
    marginTop: 12,          // Üstündeki liste ile arasına boşluk koyar
    marginRight: 4,         // Ekranın sağ kenarından boşluk bırakır
    gap: 4,                 // Yazı ve ikon arasına boşluk koyar
  },
  viewMoreText: {
    color: COLORS.PRIMARY,
    ...getFontFamily('SEMIBOLD'),
    fontSize: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    ...getFontFamily('MEDIUM'),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.TEXT_SECONDARY + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeActiveCampaigns;