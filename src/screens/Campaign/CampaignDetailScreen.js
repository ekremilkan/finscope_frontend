//campaigncontent kısmı ve title description kısmı yoruma alındı
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import campaignService from '../../services/campaignService';

const COLORS = {
  BACKGROUND: '#181818',
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9AA',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
  BLACK_TEXT_ON_PRIMARY: '#181818',
  ERROR: '#ef4444',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
  TEXT_DISABLED: '#6b7280',
};

const { width, height } = Dimensions.get('window');

/** custom hook: sayacı yönetir ve status değişimini bildirir */
function useCountdown({ startDate, endDate, status, onStatusChange }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!startDate || !endDate) {
      setTimeLeft('');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const tick = () => {
      const now = new Date();

      if (now >= end) {
        setTimeLeft('Missed');
        if (status !== 'expired') onStatusChange?.('expired');
        return;
      }

      if (now < start) {
        const diff = start.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeLeft(
            `${hours.toString().padStart(2, '0')}:${minutes
              .toString()
              .padStart(2, '0')}`
          );
        } else {
          setTimeLeft(
            `${minutes.toString().padStart(2, '0')}:${seconds
              .toString()
              .padStart(2, '0')}`
          );
        }
      } else {
        if (status !== 'active') onStatusChange?.('active');
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate, status, onStatusChange]);

  return timeLeft;
}

const CampaignDetailScreen = ({ navigation, route }) => {
  const initialCampaign = route?.params?.campaign ?? null;
  const campaignId = initialCampaign?._id;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const horizontalScrollViewRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const content = useMemo(() => campaign?.content ?? [], [campaign]);

  // Pan gesture için handler
  const onPanGestureEvent = useCallback((event) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      const threshold = width * 0.25; // %25 threshold
      
      if (Math.abs(translationX) > threshold) {
        if (translationX > 0) {
          // Sağa kaydırma - önceki sayfa
          if (activeContentIndex > 0) {
            handlePrev();
          }
        } else {
          // Sola kaydırma - sonraki sayfa
          if (activeContentIndex < content.length - 1) {
            handleNext();
          }
        }
      }
    }
  }, [activeContentIndex, content.length]);

  const fetchCampaignData = useCallback(
    async (isRefresh = false) => {
      if (!campaignId) {
        setError('Campaign ID not found.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (!isRefresh) setLoading(true);
      setError(null);

      try {
        const [campaignData, userProgress] = await Promise.all([
          campaignService.getCampaignById(campaignId),
          campaignService.getUserProgress(campaignId).catch(() => null),
        ]);

        const userStatus = userProgress
          ? userProgress.completed
            ? 'completed'
            : 'in-progress'
          : null;

        setCampaign({
          ...campaignData,
          userStatus,
        });
      } catch (err) {
        setError('Failed to load campaign details.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [campaignId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchCampaignData();
    }, [fetchCampaignData])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCampaignData(true);
  }, [fetchCampaignData]);

  const timeLeft = useCountdown({
    startDate: campaign?.startDate,
    endDate: campaign?.endDate,
    status: campaign?.status,
    onStatusChange: (newStatus) => {
      setCampaign((prev) => (prev ? { ...prev, status: newStatus } : null));
    },
  });

  const handleOpenVideo = async (url) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setModalContent({
          title: 'Hata',
          message: `Bu link açılamıyor: ${url}`,
        });
        setIsModalVisible(true);
      }
    } catch (e) {
      setModalContent({
        title: 'Hata',
        message: 'Link açılırken bir sorun oluştu.',
      });
      setIsModalVisible(true);
    }
  };

  const handleStartQuiz = async () => {
    if (isJoining || !campaignId) return;
    setIsJoining(true);
    try {
      await campaignService.joinCampaign(campaignId);
      navigation.navigate('QuizScreen', {
        campaignId,
        campaignTitle: campaign?.title ?? '',
        reward: campaign?.reward,
        startIndex: 0,
      });
    } catch (err) {
      setModalContent({
        title: 'Hata',
        message: err?.message || 'Quiz başlatılamadı. Lütfen tekrar deneyin.',
      });
      setIsModalVisible(true);
    } finally {
      setIsJoining(false);
    }
  };

  // Pan gesture handler
  const handlePanStateChange = useCallback((event) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      const threshold = width * 0.2; // %20 threshold
      
      if (Math.abs(translationX) > threshold) {
        if (translationX > 0 && activeContentIndex > 0) {
          // Sağa kaydırma - önceki sayfa
          handlePrev();
        } else if (translationX < 0 && activeContentIndex < content.length - 1) {
          // Sola kaydırma - sonraki sayfa
          handleNext();
        }
      }
    }
  }, [activeContentIndex, content.length]);

  const renderCustomModal = () => (
    <Modal
      transparent
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {!!modalContent.title && (
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
          )}
          {!!modalContent.message && (
            <Text style={styles.modalMessage}>{modalContent.message}</Text>
          )}
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreenContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !campaign) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.fullScreenContainer}>
          <Icon name="error-outline" size={48} color={COLORS.PRIMARY} />
          <Text style={styles.errorText}>
            {error || 'Campaign could not be loaded.'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack?.()}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleNext = () => {
    if (!horizontalScrollViewRef.current) return;
    if (content.length > 0 && activeContentIndex < content.length - 1) {
      horizontalScrollViewRef.current.scrollTo({
        x: (activeContentIndex + 1) * width,
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (!horizontalScrollViewRef.current) return;
    if (activeContentIndex > 0) {
      horizontalScrollViewRef.current.scrollTo({
        x: (activeContentIndex - 1) * width,
        animated: true,
      });
    }
  };

  const renderDetailHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack?.()}
      >
        <Icon name="arrow-back" size={24} color={COLORS.PRIMARY} />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {campaign.title || 'Campaign Detail'}
      </Text>
      <View style={styles.headerButton} />
    </View>
  );

  const renderHeroImage = () => {
    const imageUrl = campaign?.images?.[0];
    if (!imageUrl) return null;
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.heroImage}
        onError={() => {}}
      />
    );
  };

  const renderCampaignInfo = () => (
    <View style={styles.infoContainer}>
      {/* <Text style={styles.mainTitle}>{campaign.title}</Text>
      {!!campaign.description && (
        <Text style={styles.descriptionText}>{campaign.description}</Text>
      )} */}
      {Array.isArray(campaign.tags) && campaign.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {campaign.tags.slice(0, 3).map((tag, index) => (
            <View key={`${tag}-${index}`} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderContentSlider = () => {
    if (!content.length) return null;
    
    const onMomentumEnd = (e) => {
        const page = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveContentIndex(page);
    };

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          {/* <Text style={styles.areaTitle}>Campaign Content</Text> */}
          <Text style={styles.progressText}>
            {activeContentIndex + 1} / {content.length}
          </Text>
        </View>

        <ScrollView
          ref={horizontalScrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumEnd}
          scrollEventThrottle={16}
          style={styles.horizontalScrollView}
        >
          {content.map((item, index) => {
            const key = item?._id ?? `content-${index}`;
            
            return (
              <View key={key} style={styles.pageContainer}>
                <PanGestureHandler
                  onGestureEvent={onPanGestureEvent}
                  onHandlerStateChange={handlePanStateChange}
                  activeOffsetX={[-10, 10]}
                  failOffsetY={[-5, 5]}
                >
                  <View style={styles.contentCard}>
                    <View style={styles.cardTextContainer}>
                      {!!item?.itemTitle && (
                        <Text style={styles.itemTitle}>{item.itemTitle}</Text>
                      )}
                      {!!item?.itemDescription && (
                        <Text style={styles.itemDescription}>
                          {item.itemDescription}
                        </Text>
                      )}
                    </View>

                    {(item?.itemVideo || item?.itemImage) && (
                      <View style={styles.mediaContainer}>
                        {!!item?.itemImage && (
                          <Image
                            source={{ uri: item.itemImage }}
                            style={styles.itemImage}
                          />
                        )}
                        {!!item?.itemVideo && (
                          <TouchableOpacity
                            style={styles.videoOverlay}
                            onPress={() => handleOpenVideo(item.itemVideo)}
                          >
                            <Icon
                              name="play-circle-outline"
                              size={64}
                              color="white"
                              style={styles.playIcon}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                </PanGestureHandler>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderFooter = () => {
    if (campaign.userStatus === 'completed') {
      return (
        <View style={styles.footer}>
          <View style={[styles.navButton, styles.completedButton]}>
            <Icon name="check" size={24} color={COLORS.BACKGROUND} />
            <Text style={[styles.navButtonText, styles.completedButtonText]}>
              Completed
            </Text>
          </View>
        </View>
      );
    }

    const isExpired =
      campaign?.endDate ? new Date() > new Date(campaign.endDate) : false;

    if (isExpired || campaign.status === 'expired') {
      return (
        <View style={styles.footer}>
          <View style={[styles.navButton, styles.expiredButton]}>
            <Icon name="event-busy" size={24} color={COLORS.BACKGROUND} />
            <Text style={[styles.navButtonText, styles.expiredButtonText]}>
              Missed
            </Text>
          </View>
        </View>
      );
    }

    switch (campaign.status) {
      case 'upcoming':
        return (
          <View style={styles.footer}>
            <View style={[styles.navButton, styles.upcomingButton]}>
              <Icon name="schedule" size={24} color={COLORS.BACKGROUND} />
              <Text
                style={[styles.navButtonText, styles.upcomingButtonText]}
                numberOfLines={1}
              >
                {timeLeft ? `Starts in ${timeLeft}` : 'Upcoming'}
              </Text>
            </View>
          </View>
        );

      case 'inactive':
        return (
          <View style={styles.footer}>
            <View style={[styles.navButton, styles.inactiveButton]}>
              <Icon name="pause" size={24} color={COLORS.BACKGROUND} />
              <Text style={[styles.navButtonText, styles.inactiveButtonText]}>
                Inactive
              </Text>
            </View>
          </View>
        );

      case 'active': {
        const hasContent = content.length > 0;
        if (hasContent) {
          const isLastPage = activeContentIndex === content.length - 1;

          const nextButtonContent =
            isJoining && isLastPage ? (
              <ActivityIndicator
                size="small"
                color={COLORS.BLACK_TEXT_ON_PRIMARY}
              />
            ) : (
              <>
                <Text
                  style={[
                    styles.navButtonText,
                    isLastPage && styles.startQuizButtonText,
                  ]}
                >
                  {isLastPage ? 'Start Quiz' : 'Next'}
                </Text>
                <Icon
                  name={isLastPage ? 'play-arrow' : 'chevron-right'}
                  size={24}
                  color={
                    isLastPage ? COLORS.BLACK_TEXT_ON_PRIMARY : COLORS.PRIMARY
                  }
                />
              </>
            );

          return (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  { opacity: activeContentIndex === 0 || isJoining ? 0.4 : 1 },
                ]}
                onPress={handlePrev}
                disabled={activeContentIndex === 0 || isJoining}
              >
                <Icon name="chevron-left" size={24} color={COLORS.PRIMARY} />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  isLastPage ? styles.startQuizButton : {},
                  { opacity: isJoining ? 0.7 : 1 },
                ]}
                onPress={isLastPage ? handleStartQuiz : handleNext}
                disabled={isJoining}
              >
                {nextButtonContent}
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.startQuizButton,
                { flex: 1, opacity: isJoining ? 0.7 : 1 },
              ]}
              onPress={handleStartQuiz}
              disabled={isJoining}
            >
              {isJoining ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.BLACK_TEXT_ON_PRIMARY}
                />
              ) : (
                <>
                  <Text
                    style={[styles.navButtonText, styles.startQuizButtonText]}
                  >
                    Start Quiz
                  </Text>
                  <Icon
                    name="play-arrow"
                    size={24}
                    color={COLORS.BLACK_TEXT_ON_PRIMARY}
                  />
                </>
              )}
            </TouchableOpacity>
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

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
        >
          {renderHeroImage()}
          {renderCampaignInfo()}
          {renderContentSlider()}
        </ScrollView>

        {renderFooter()}
        {renderCustomModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.ERROR,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BLACK_TEXT_ON_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.CARD_BACKGROUND,
  },
  headerButton: { padding: 8, width: 40, alignItems: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginHorizontal: 12,
  },
  heroImage: { width: '100%', height: width * 0.5, resizeMode: 'cover' },
  infoContainer: { paddingHorizontal: 20, paddingTop: 15 },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  tagText: { color: COLORS.PRIMARY, fontSize: 12, fontWeight: '600' },
  sliderContainer: { marginTop: 20, minHeight: height * 0.4 },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  areaTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  progressText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, fontWeight: '600' },
  horizontalScrollView: { flex: 1 },
  pageContainer: { width, paddingHorizontal: 20, paddingBottom: 10 },
  contentCard: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: COLORS.CARD_BACKGROUND,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    justifyContent: 'space-between',
  },
  mediaContainer: { width: '100%', height: 150, marginTop: 16 },
  itemImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  playIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardTextContainer: { padding: 20, flexShrink: 1 },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  itemDescription: { fontSize: 16, color: COLORS.TEXT_SECONDARY, lineHeight: 24 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 20,
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.CARD_BACKGROUND,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    height: 52,
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginHorizontal: 5,
  },
  startQuizButton: { backgroundColor: COLORS.PRIMARY },
  startQuizButtonText: { color: COLORS.BLACK_TEXT_ON_PRIMARY },
  completedButton: {
    flex: 1,
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
    justifyContent: 'center',
  },
  completedButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  upcomingButton: {
    flex: 1,
    backgroundColor: COLORS.WARNING,
    borderColor: COLORS.WARNING,
    justifyContent: 'center',
  },
  upcomingButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  expiredButton: {
    flex: 1,
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
    justifyContent: 'center',
  },
  expiredButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  inactiveButton: {
    flex: 1,
    backgroundColor: COLORS.TEXT_DISABLED,
    borderColor: COLORS.TEXT_DISABLED,
    justifyContent: 'center',
  },
  inactiveButtonText: { color: COLORS.BACKGROUND, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  modalButtonText: {
    color: COLORS.BLACK_TEXT_ON_PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CampaignDetailScreen;