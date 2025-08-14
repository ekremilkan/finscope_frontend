import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// ✅ HATA BURADAYDI: Eksik olan import satırı eklendi.
import LinearGradient from 'react-native-linear-gradient';

import campaignService from '../services/campaignService';
import UserCampaignHeader from '../components/UserCampaign/UserCampaignHeader';
import UserCampaignFilters from '../components/UserCampaign/UserCampaignFilters';
import UserCampaignCard from '../components/UserCampaign/UserCampaignCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { COLORS, getCornerGradientColors } from '../constants/colorConstants';

const { width } = Dimensions.get('window');

const CampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const loadData = async () => {
    if (!refreshing) {
        setLoading(true);
    }
    setError(null);
    try {
      const campaignsData = await campaignService.getAllCampaigns();
      if (!campaignsData || campaignsData.length === 0) {
        setCampaigns([]);
        return;
      }

      const progressPromises = campaignsData.map(campaign =>
        campaignService.getUserProgress(campaign._id).catch(err => {
          console.log(`'${campaign.title}' için progress alınamadı, muhtemelen kullanıcı katılmamış.`);
          return null;
        })
      );
      
      const userProgressResults = await Promise.all(progressPromises);

      const mergedCampaigns = campaignsData.map((campaign, index) => {
        const progress = userProgressResults[index];
        let userStatus = null;
        if (progress) {
          userStatus = progress.completed ? 'completed' : 'in-progress';
        }
        return { ...campaign, userStatus };
      });
      
      setCampaigns(mergedCampaigns);

    } catch (err) {
      setError(err.message);
      console.error("Veri yükleme hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    let filtered = [...campaigns];
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(c => (c?.title?.toLowerCase() || '').includes(lowercasedQuery) || (c?.description?.toLowerCase() || '').includes(lowercasedQuery));
    }
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(c => {
        if (!c) return false;
        if (selectedFilter === 'completed') {
            return c.userStatus === 'completed';
        }
        if (selectedFilter === 'active') {
            const now = new Date();
            const end = new Date(c.endDate);
            return now <= end && c.status === 'active' && c.userStatus !== 'completed';
        }
        if (selectedFilter === 'missed') {
            const now = new Date();
            const end = new Date(c.endDate);
            return now > end && c.userStatus !== 'completed';
        }
        return c.status === selectedFilter;
      });
    }
    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedFilter, campaigns]);
  
  const handleCardPress = (campaign) => {
    if (!campaign?._id) return;
    navigation.navigate('CampaignDetail', { campaign });
  };

  const renderCampaignCard = ({ item }) => ( <UserCampaignCard campaign={item} onPress={() => handleCardPress(item)} /> );
  const keyExtractor = (item) => item?._id || Math.random().toString();
  const renderEmptyState = () => (<View style={styles.emptyContainer}><Icon name="campaign" size={64} color={COLORS.TEXT_DISABLED} /><Text style={styles.emptyText}>No Campaigns Found</Text></View>);
  const renderSkeletonLoading = () => (<View style={styles.skeletonContainer}>{[...Array(3)].map((_, index) => (<View key={index} style={styles.skeletonCard} />))}</View>);
  const renderErrorState = () => (<View style={styles.errorContainer}><Icon name="error-outline" size={48} color={COLORS.ERROR} /><Text style={styles.errorText}>{error}</Text><TouchableOpacity style={styles.retryButton} onPress={loadData}><Text style={styles.retryButtonText}>Try Again</Text></TouchableOpacity></View>);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Bu bileşen artık sorunsuz çalışacak */}
        <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
          <UserCampaignHeader navigation={navigation} campaignCount={filteredCampaigns.length} />
          <UserCampaignFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          {loading ? renderSkeletonLoading() : error ? renderErrorState() : (
            <FlatList
              data={filteredCampaigns}
              renderItem={renderCampaignCard}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[COLORS.PRIMARY]} tintColor={COLORS.PRIMARY} />}
              ListEmptyComponent={!loading && !error ? renderEmptyState : null}
            />
          )}
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  safeArea: { flex: 1 },
  gradientContainer: { flex: 1 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100, paddingTop: 10 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, marginTop: 50 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginTop: 16 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  errorText: { fontSize: 16, fontWeight: '600', color: COLORS.ERROR, textAlign: 'center' },
  retryButton: { backgroundColor: COLORS.PRIMARY, padding: 12, borderRadius: 12, marginTop: 16 },
  retryButtonText: { fontSize: 14, fontWeight: '600', color: '#181818' },
  skeletonContainer: { paddingHorizontal: 20, paddingTop: 10 },
  skeletonCard: { height: 220, backgroundColor: '#2A2A2A', borderRadius: 20, marginBottom: 16 },
});

export default CampaignsScreen;