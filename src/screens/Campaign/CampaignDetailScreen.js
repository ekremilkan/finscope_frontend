import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import campaignService from '../../services/campaignService';

const COLORS = { BACKGROUND: '#181818', PRIMARY: '#F7D648', TEXT_PRIMARY: '#FFFFFF', TEXT_SECONDARY: '#A9A9AA', CARD_BACKGROUND: '#2A2A2A', BORDER: 'rgba(247, 214, 72, 0.2)', BLACK_TEXT_ON_PRIMARY: '#181818', ERROR: '#ef4444', SUCCESS: '#10b981', WARNING: '#f59e0b', INFO: '#3b82f6', TEXT_DISABLED: '#6b7280' };
const { width, height } = Dimensions.get('window');

const CountdownTimer = ({ startDate, endDate, status, onStatusChange }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      if (!startDate || !endDate) { clearInterval(timer); return; }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now >= end) {
        setTimeLeft('Missed');
        if (status !== 'expired') onStatusChange?.('expired');
        clearInterval(timer); return;
      }
      if (now < start) {
        const difference = start - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (days > 0) {
            setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
        } else {
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      } else {
        if (status !== 'active') onStatusChange?.('active');
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate, status, onStatusChange]);
  return { timeLeft };
};

const CampaignDetailScreen = ({ navigation, route }) => {
  // ✅ DEĞİŞİKLİK 1: Ekranın ilk state'i, liste ekranından gelen güvenilir veri ile başlar.
  const [campaign, setCampaign] = useState(route.params?.campaign);
  const campaignId = campaign?._id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const horizontalScrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      // Güvenilir başlangıç verisini bir değişkene al
      const initialDataFromList = route.params?.campaign;

      const fetchFullCampaignDetails = async () => {
        if (!campaignId) {
          setError('Campaign ID not found.');
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          // Arka planda zengin içeriği çek
          const fullCampaignDataFromServer = await campaignService.getCampaignById(campaignId);

          // ✅ DEĞİŞİKLİK 2: Verileri akıllıca birleştir.
          // Detaydan gelen tüm veriyi al, ama `userStatus` olarak her zaman
          // liste ekranından gelen güvenilir veriyi kullan.
          setCampaign({
            ...fullCampaignDataFromServer,
            userStatus: initialDataFromList?.userStatus 
          });

        } catch (err) {
          setError('Failed to load full campaign details.');
          // Hata durumunda bile ilk gelen veriyi koru
          setCampaign(initialDataFromList);
        } finally {
          setLoading(false);
        }
      };

      fetchFullCampaignDetails();
    }, [campaignId, route.params?.campaign])
  );

  const { timeLeft } = CountdownTimer({
    startDate: campaign?.startDate,
    endDate: campaign?.endDate,
    status: campaign?.status,
    onStatusChange: (newStatus) => {
      setCampaign(prev => (prev ? { ...prev, status: newStatus } : null));
    },
  });

   const handleOpenVideo = async (url) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Bu link açılamıyor: ${url}`);
    }
  };

  if (!campaign) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreenContainer}>
          {loading ? <ActivityIndicator size="large" color={COLORS.PRIMARY} /> : <Text style={styles.errorText}>Campaign data is missing.</Text>}
        </View>
      </SafeAreaView>
    );
  }


  const handleStartQuiz = async () => {
    if (isJoining) return;
    setIsJoining(true);
    try {
      await campaignService.joinCampaign(campaignId);
      navigation.navigate('QuizScreen', {
        campaignId: campaignId,
        campaignTitle: campaign.title,
        reward: campaign.reward,
        startIndex: 0,
      });

    } catch (err) {
      Alert.alert('Error', err.message || 'Could not start the quiz. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleNext = () => { if (campaign.content && activeContentIndex < campaign.content.length - 1) horizontalScrollViewRef.current?.scrollTo({ x: (activeContentIndex + 1) * width, animated: true }); };
  const handlePrev = () => { if (activeContentIndex > 0) horizontalScrollViewRef.current?.scrollTo({ x: (activeContentIndex - 1) * width, animated: true }); };
  const onScroll = (event) => setActiveContentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  
  const renderDetailHeader = () => {
    const isCampaignCompleted = campaign.userStatus === 'completed';
    const isUpcoming = campaign.status === 'upcoming';
    const isExpired = new Date() > new Date(campaign.endDate);
    const isInactive = campaign.status === 'inactive';
    let headerIcon = 'bookmark-border';
    let headerIconColor = COLORS.PRIMARY;

    if (isCampaignCompleted) { headerIcon = 'check-circle'; headerIconColor = COLORS.SUCCESS; } 
    else if (isExpired) { headerIcon = 'event-busy'; headerIconColor = COLORS.ERROR; } 
    else if (isUpcoming) { headerIcon = 'schedule'; headerIconColor = COLORS.WARNING; } 
    else if (isInactive) { headerIcon = 'pause-circle-outline'; headerIconColor = COLORS.TEXT_DISABLED; }

    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{campaign.title || 'Campaign Detail'}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name={headerIcon} size={24} color={headerIconColor} />
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderHeroImage = () => {
    const imageUrl = campaign?.images?.[0];
    return ( <View>{imageUrl ? <Image source={{ uri: imageUrl }} style={styles.heroImage} /> : <View style={[styles.heroImage, { backgroundColor: COLORS.CARD_BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}><Icon name="campaign" size={48} color={COLORS.PRIMARY} /></View>}</View> );
  };
  
  const renderCampaignInfo = () => {
    const totalParticipants = campaign.currentParticipants ? Object.values(campaign.currentParticipants).reduce((sum, count) => sum + count, 0) : 0;
    return (
      <View style={styles.infoContainer}>
        <Text style={styles.mainTitle}>{campaign.title}</Text>
        <Text style={styles.descriptionText}>{campaign.description}</Text>
        {campaign.tags?.length > 0 && (<View style={styles.tagsContainer}>{campaign.tags.map((tag, index) => <View key={index} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>)}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}><Icon name="people" size={20} color={COLORS.PRIMARY} /><Text style={styles.statValue}>{totalParticipants}</Text><Text style={styles.statLabel}>Participants</Text></View>
          <View style={styles.statItem}><Icon name="quiz" size={20} color={COLORS.INFO} /><Text style={styles.statValue}>{campaign.questions?.length || 0}</Text><Text style={styles.statLabel}>Questions</Text></View>
          <View style={styles.statItem}><Icon name="monetization-on" size={20} color={COLORS.SUCCESS} /><Text style={styles.statValue}>{campaign.reward || 0}</Text><Text style={styles.statLabel}>USDT Reward</Text></View>
        </View>
      </View>
    );
  };

  const renderContentSlider = () => {
    if (!campaign.content || campaign.content.length === 0) return null;
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}><Text style={styles.areaTitle}>Campaign Content</Text><Text style={styles.progressText}>{activeContentIndex + 1} / {campaign.content.length}</Text></View>
        <ScrollView ref={horizontalScrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} style={styles.horizontalScrollView}>
          {campaign.content.map((item) => (
            <View key={item._id} style={styles.pageContainer}>
              <View style={styles.contentCard}>
                <View style={styles.cardTextContainer}><Text style={styles.itemTitle}>{item.itemTitle}</Text><Text style={styles.itemDescription}>{item.itemDescription}</Text></View>
                {(item.itemVideo || item.itemImage) && (<View style={styles.mediaContainer}>{item.itemImage && <Image source={{ uri: item.itemImage }} style={styles.itemImage} />}{item.itemVideo && (<TouchableOpacity style={styles.videoOverlay} onPress={() => handleOpenVideo(item.itemVideo)}><Icon name="play-circle-outline" size={64} color="white" style={styles.playIcon} /></TouchableOpacity>)}</View>)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFooter = () => {
    // Bu mantık artık her zaman doğru `campaign` objesi ile çalışacak
    if (campaign.userStatus === 'completed') {
      return (
        <View style={styles.footer}>
            <View style={[styles.navButton, styles.completedButton]}>
                <Icon name="check" size={24} color={COLORS.BACKGROUND} />
                <Text style={[styles.navButtonText, styles.completedButtonText]}>Completed</Text>
            </View>
        </View>
      );
    }
    
    const isExpired = new Date() > new Date(campaign.endDate);
    if (isExpired) {
        return ( <View style={styles.footer}><View style={[styles.navButton, styles.expiredButton]}><Icon name="event-busy" size={24} color={COLORS.BACKGROUND} /><Text style={[styles.navButtonText, styles.expiredButtonText]}>Missed</Text></View></View> );
    }

    switch (campaign.status) {
      case 'upcoming':
        return ( <View style={styles.footer}><View style={[styles.navButton, styles.upcomingButton]}><Icon name="schedule" size={24} color={COLORS.BACKGROUND} /><Text style={[styles.navButtonText, styles.upcomingButtonText]}>Starts in {timeLeft}</Text></View></View> );
      case 'inactive':
        return ( <View style={styles.footer}><View style={[styles.navButton, styles.inactiveButton]}><Icon name="pause" size={24} color={COLORS.BACKGROUND} /><Text style={[styles.navButtonText, styles.inactiveButtonText]}>Inactive</Text></View></View> );
      case 'active':
        const hasContent = campaign.content && campaign.content.length > 0;
        if (hasContent) {
          const isLastPage = activeContentIndex === campaign.content.length - 1;
          return (
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.navButton, { opacity: activeContentIndex === 0 || isJoining ? 0.4 : 1 }]} onPress={handlePrev} disabled={activeContentIndex === 0 || isJoining}><Icon name="chevron-left" size={24} color={COLORS.PRIMARY} /><Text style={styles.navButtonText}>Previous</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.navButton, isLastPage ? styles.startQuizButton : {}, { opacity: isJoining ? 0.7 : 1 }]} onPress={isLastPage ? handleStartQuiz : handleNext} disabled={isJoining}>{isJoining && isLastPage ? <ActivityIndicator size="small" color={COLORS.BLACK_TEXT_ON_PRIMARY} /> : (<><Text style={[styles.navButtonText, isLastPage && styles.startQuizButtonText]}>{isLastPage ? "Start Quiz" : 'Next'}</Text><Icon name={isLastPage ? "play-arrow" : "chevron-right"} size={24} color={isLastPage ? COLORS.BLACK_TEXT_ON_PRIMARY : COLORS.PRIMARY} /></>)}</TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View style={styles.footer}>
              <TouchableOpacity style={[styles.navButton, styles.startQuizButton, { flex: 1, opacity: isJoining ? 0.7 : 1 }]} onPress={handleStartQuiz} disabled={isJoining}>{isJoining ? <ActivityIndicator size="small" color={COLORS.BLACK_TEXT_ON_PRIMARY} /> : (<><Text style={[styles.navButtonText, styles.startQuizButtonText]}>Start Quiz</Text><Icon name="play-arrow" size={24} color={COLORS.BLACK_TEXT_ON_PRIMARY} /></>)}</TouchableOpacity>
            </View>
          );
        }
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
        {renderDetailHeader()}
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {renderHeroImage()}
            {renderCampaignInfo()}
            {renderContentSlider()}
        </ScrollView>
        {renderFooter()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  videoOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: 16, },
  playIcon: { textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  fullScreenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { marginTop: 16, fontSize: 16, color: COLORS.ERROR, textAlign: 'center' },
  retryButton: { backgroundColor: COLORS.PRIMARY, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  retryButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.BLACK_TEXT_ON_PRIMARY },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.CARD_BACKGROUND },
  headerButton: { padding: 8 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginHorizontal: 12 },
  heroImage: { width: '100%', height: width * 0.5, resizeMode: 'cover' },
  infoContainer: { paddingHorizontal: 20, paddingTop: 20 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY, marginBottom: 8 },
  descriptionText: { fontSize: 15, color: COLORS.TEXT_SECONDARY, lineHeight: 22, marginBottom: 20 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 8 },
  tag: { backgroundColor: 'rgba(247, 214, 72, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.BORDER },
  tagText: { color: COLORS.PRIMARY, fontSize: 12, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.CARD_BACKGROUND, borderRadius: 16, paddingVertical: 20, alignItems: 'center' },
  statItem: { alignItems: 'center', gap: 8, flex: 1 },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, textAlign: 'center' },
  statLabel: { fontSize: 12, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', marginTop: 4 },
  sliderContainer: { marginTop: 30, minHeight: height * 0.4,},
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  areaTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  progressText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, fontWeight: '600' },
  horizontalScrollView: { flex: 1 },
  pageContainer: { width: width, paddingHorizontal: 20, paddingBottom: 10 },
  contentCard: { flex: 1, borderRadius: 16, backgroundColor: COLORS.CARD_BACKGROUND, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.BORDER, justifyContent: 'space-between', },
  mediaContainer: { width: '100%', height: 150, marginTop: 16, },
  itemImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover', borderRadius: 1, },
  cardTextContainer: { padding: 20, flexShrink: 1, },
  itemTitle: { fontSize: 20, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
  itemDescription: { fontSize: 16, color: COLORS.TEXT_SECONDARY, lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingBottom: 25, backgroundColor: COLORS.BACKGROUND, borderTopWidth: 1, borderTopColor: COLORS.CARD_BACKGROUND },
  navButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 120, height: 52, borderRadius: 12, paddingHorizontal: 20, backgroundColor: COLORS.CARD_BACKGROUND, borderWidth: 1, borderColor: COLORS.BORDER },
  navButtonText: { fontSize: 16, fontWeight: '700', color: COLORS.PRIMARY, marginHorizontal: 5 },
  startQuizButton: { backgroundColor: COLORS.PRIMARY },
  startQuizButtonText: { color: COLORS.BLACK_TEXT_ON_PRIMARY },
  completedButton: { flex: 1, backgroundColor: COLORS.SUCCESS, borderColor: COLORS.SUCCESS, justifyContent: 'center'},
  completedButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  upcomingButton: { flex: 1, backgroundColor: COLORS.WARNING, borderColor: COLORS.WARNING, justifyContent: 'center'},
  upcomingButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  expiredButton: { flex: 1, backgroundColor: COLORS.ERROR, borderColor: COLORS.ERROR, justifyContent: 'center'},
  expiredButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  inactiveButton: { flex: 1, backgroundColor: COLORS.TEXT_DISABLED, borderColor: COLORS.TEXT_DISABLED, justifyContent: 'center'},
  inactiveButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
});

export default CampaignDetailScreen;