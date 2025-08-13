import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// --- TEMA RENKLERİ ---
const COLORS = {
  BACKGROUND: '#181818',
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
  BLACK_TEXT_ON_PRIMARY: '#181818',
};

const { width, height } = Dimensions.get('window');

// --- Ana Ekran Bileşeni ---
const CampaignDetailScreen = ({ navigation, route }) => {
  // const { campaignId } = route.params;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const horizontalScrollViewRef = useRef(null);

  useEffect(() => {
    const loadCampaignDetails = async () => {
      try {
        setLoading(true);
        // --- BAŞLANGIÇ: VERİTABANI ODAKLI SAHTE VERİ ---
        const mockCampaign = {
          _id: '686a80ad4df8b694b1e90140',
          title: 'Stratejik Varlık Yönetimi',
          description: 'Varlıklarınızı en verimli şekilde nasıl yöneteceğinizi ve portföyünüzü nasıl optimize edeceğinizi öğrenin.',
          image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=870',
          content: [
            { itemImage: 'https://images.unsplash.com/photo-1554224155-8d044b408226?q=80&w=870', itemTitle: 'Giriş: Varlık Yönetimi Nedir?', itemDescription: 'Varlık yönetimi, bir bireyin veya kurumun sahip olduğu değerli varlıkların sistematik bir şekilde yönetilmesi sürecidir...' },
            { itemImage: '', itemTitle: 'Risk ve Getiri Dengesi', itemDescription: 'Her yatırımın bir riski ve potansiyel bir getirisi vardır...' },
            { itemImage: 'https://images.unsplash.com/photo-1642792691530-056778438b9b?q=80&w=870', itemTitle: 'Teknolojinin Rolü: Robo-Danışmanlar', itemDescription: 'Yapay zeka ve algoritmalarla desteklenen robo-danışmanlar, yatırım dünyasını değiştiriyor...' }
          ],
          reward: 75,
          maxParticipants: { A: 1000, B: 500, C: 200, D: 0 },
          currentParticipants: { A: 450, B: 120, C: 30, D: 0 },
          questions: 12,
          estimatedDuration: 20,
          tags: ['Portföy', 'Varlık Yönetimi', 'Finans', 'Risk'],
          ui_labels: {
              header_default_title: "Kampanya Detayı",
              est_duration_label: "Tahmini Süre",
              questions_label: "Soru",
              participants_label: "Katılımcı",
              content_header: "Kampanya İçeriği",
              duration_unit: "dk",
              reward_unit: "USDT",
          }
        };
        // --- SON: SAHTE VERİ ---
        setTimeout(() => {
          setCampaign(mockCampaign);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('An error occurred while loading campaign details.');
        setLoading(false);
      }
    };
    loadCampaignDetails();
  }, []);

  const handleNext = () => { if (campaign && activeContentIndex < campaign.content.length - 1) { horizontalScrollViewRef.current?.scrollTo({ x: (activeContentIndex + 1) * width, animated: true }); }};
  const handlePrev = () => { if (activeContentIndex > 0) { horizontalScrollViewRef.current?.scrollTo({ x: (activeContentIndex - 1) * width, animated: true }); }};
  
  // --- DÜZELTİLEN FONKSİYON ---
  const handleStartQuiz = () => {
    if (!campaign) return; // Güvenlik kontrolü
    
    // Quiz ekranına yönlendirme ve gerekli parametreleri gönderme
    navigation.navigate('QuizScreen', {
        campaignId: campaign._id,
        campaignTitle: campaign.title,
    });
  };

  const onScroll = (event) => { setActiveContentIndex(Math.round(event.nativeEvent.contentOffset.x / width)); };
  const getTotalParticipants = (p) => p ? Object.values(p).reduce((s, v) => s + v, 0) : 0;

  // --- RENDER FONKSİYONLARI ---
  // (Render fonksiyonları bir önceki cevaptaki ile aynı, değişiklik yok)

  const renderDetailHeader = () => (
    <View style={styles.header}><TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><Icon name="arrow-back" size={24} color={COLORS.PRIMARY} /></TouchableOpacity><Text style={styles.headerTitle} numberOfLines={1}>{campaign?.title || campaign?.ui_labels?.header_default_title}</Text><TouchableOpacity style={styles.headerButton}><Icon name="bookmark-border" size={24} color={COLORS.PRIMARY} /></TouchableOpacity></View>
  );

  const renderHeroImage = () => campaign?.image ? <Image source={{ uri: campaign.image }} style={styles.heroImage} /> : null;

  const renderCampaignInfo = () => {
    const labels = campaign?.ui_labels || {};
    const totalCurrent = getTotalParticipants(campaign?.currentParticipants);
    const totalMax = getTotalParticipants(campaign?.maxParticipants);

    return (
      <View style={styles.infoContainer}>
        <Text style={styles.mainTitle}>{campaign?.title}</Text>
        <Text style={styles.descriptionText}>{campaign?.description}</Text>
        <View style={styles.tagsContainer}>
            {campaign?.tags?.map((tag, index) => (
                <View key={index} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}><Icon name="timer" size={20} color={COLORS.PRIMARY} /><Text style={styles.statValue}>{`${campaign?.estimatedDuration || 0} ${labels.duration_unit || 'min'}`}</Text><Text style={styles.statLabel}>{labels.est_duration_label || 'Est. Duration'}</Text></View>
          <View style={styles.statItem}><Icon name="quiz" size={20} color={COLORS.PRIMARY} /><Text style={styles.statValue}>{campaign?.questions || 0}</Text><Text style={styles.statLabel}>{labels.questions_label || 'Questions'}</Text></View>
          <View style={styles.statItem}><Icon name="people" size={20} color={COLORS.PRIMARY} /><Text style={styles.statValue}>{`${totalCurrent}/${totalMax}`}</Text><Text style={styles.statLabel}>{labels.participants_label || 'Participants'}</Text></View>
        </View>
      </View>
    );
  };

  const renderContentSlider = () => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.areaTitle}>{campaign?.ui_labels?.content_header || 'Content'}</Text>
        <Text style={styles.progressText}>{`${activeContentIndex + 1} / ${campaign?.content?.length || 0}`}</Text>
      </View>
      <ScrollView ref={horizontalScrollViewRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} style={styles.horizontalScrollView}>
        {campaign?.content?.map((item, index) => (
          <View key={index} style={styles.pageContainer}>
            <View style={styles.contentCard}>
              {item.itemImage && <Image source={{ uri: item.itemImage }} style={styles.itemImage} />}
              <ScrollView nestedScrollEnabled contentContainerStyle={styles.cardTextContainer}>
                <Text style={styles.itemTitle}>{item.itemTitle}</Text>
                <Text style={styles.itemDescription}>{item.itemDescription}</Text>
              </ScrollView>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderFooter = () => {
    const isLastPage = campaign && activeContentIndex === campaign.content.length - 1;
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.navButton, { opacity: activeContentIndex === 0 ? 0.4 : 1 }]} onPress={handlePrev} disabled={activeContentIndex === 0}>
          <Icon name="chevron-left" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, isLastPage ? styles.startQuizButton : {}]} onPress={isLastPage ? handleStartQuiz : handleNext}>
          <Text style={[styles.navButtonText, isLastPage && styles.startQuizButtonText]}>{isLastPage ? "Start Quiz" : 'Next'}</Text>
          <Icon name={isLastPage ? "play-arrow" : "chevron-right"} size={24} color={isLastPage ? COLORS.BLACK_TEXT_ON_PRIMARY : COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>
    );
  };
  
  if (loading) return (<View style={styles.fullScreenContainer}><ActivityIndicator size="large" color={COLORS.PRIMARY} /><Text style={styles.loadingText}>Loading Campaign...</Text></View>);
  if (error) return (<View style={styles.fullScreenContainer}><Icon name="error-outline" size={48} color={'#ef4444'} /><Text style={styles.errorText}>{error}</Text></View>);
  if (!campaign) return (<View style={styles.fullScreenContainer}><Text style={styles.errorText}>Campaign not found.</Text></View>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }}>
        {renderDetailHeader()}
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {renderHeroImage()}
          {renderCampaignInfo()}
          {renderContentSlider()}
        </ScrollView>
        {renderFooter()}
      </View>
    </SafeAreaView>
  );
};

// --- STİLLER ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  fullScreenContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND },
  loadingText: { marginTop: 16, fontSize: 16, color: COLORS.TEXT_SECONDARY },
  errorText: { marginTop: 16, fontSize: 16, color: '#ef4444', textAlign: 'center' },
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
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: COLORS.CARD_BACKGROUND, borderRadius: 16, paddingVertical: 20 },
  statItem: { alignItems: 'center', gap: 8, flex: 1 },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.TEXT_PRIMARY, textAlign: 'center' },
  statLabel: { fontSize: 12, color: COLORS.TEXT_SECONDARY, textTransform: 'uppercase', marginTop: 4 },
  sliderContainer: { marginTop: 20, height: height * 0.5 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  areaTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.TEXT_PRIMARY },
  progressText: { fontSize: 14, color: COLORS.TEXT_SECONDARY, fontWeight: '600' },
  horizontalScrollView: { flex: 1 },
  pageContainer: { width: width, paddingHorizontal: 20, paddingBottom: 10 },
  contentCard: { flex: 1, borderRadius: 16, backgroundColor: COLORS.CARD_BACKGROUND, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.BORDER },
  itemImage: { width: '100%', height: 150, resizeMode: 'cover' },
  cardTextContainer: { flexGrow: 1, padding: 20 },
  itemTitle: { fontSize: 20, fontWeight: '700', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
  itemDescription: { fontSize: 16, color: COLORS.TEXT_SECONDARY, lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingBottom: 25, backgroundColor: COLORS.BACKGROUND, borderTopWidth: 1, borderTopColor: COLORS.CARD_BACKGROUND },
  navButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 12, paddingHorizontal: 20, backgroundColor: COLORS.CARD_BACKGROUND, borderWidth: 1, borderColor: COLORS.BORDER },
  navButtonText: { fontSize: 16, fontWeight: '700', color: COLORS.PRIMARY, marginHorizontal: 5 },
  startQuizButton: { backgroundColor: COLORS.PRIMARY },
  startQuizButtonText: { color: COLORS.BLACK_TEXT_ON_PRIMARY },
});

export default CampaignDetailScreen;