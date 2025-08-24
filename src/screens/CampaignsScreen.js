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
import LinearGradient from 'react-native-linear-gradient';

import campaignService from '../services/campaignService';
import UserCampaignHeader from '../components/UserCampaign/UserCampaignHeader';
import UserCampaignFilters from '../components/UserCampaign/UserCampaignFilters';
import UserCampaignCard from '../components/UserCampaign/UserCampaignCard';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { COLORS, getCornerGradientColors } from '../constants/colorConstants';

const { width } = Dimensions.get('window');


const getLiveCampaignDetails = (campaign) => {
    if (!campaign?.startDate || !campaign?.endDate) {
        return { status: campaign?.status || 'inactive', displayTime: { text: '', label: '' } };
    }

    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    let status = 'upcoming';
    if (now >= end) status = 'expired';
    else if (now >= start) status = 'active';

    let targetDate = (status === 'upcoming') ? start : end;
    let label = (status === 'upcoming') ? 'Starts in' : 'Ends in';
    let text = '';
    
    const diff = targetDate - now;

    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days > 0) text = `${days}d ${hours}h`;
        else if (hours > 0) text = `${hours}h ${minutes}m`;
        else text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return { status, displayTime: { text, label } };
};

const CampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

 
  const [liveDetails, setLiveDetails] = useState({});

  const loadData = async () => {
    if (!refreshing) setLoading(true);
    setError(null);
    try {
        const campaignsData = await campaignService.getAllCampaigns();
        if (!campaignsData || campaignsData.length === 0) {
            setCampaigns([]);
            return;
        }

        const progressPromises = campaignsData.map(c => campaignService.getUserProgress(c._id).catch(() => null));
        const userProgressResults = await Promise.all(progressPromises);

        const initialDetails = {};
        const mergedCampaigns = campaignsData.map((campaign, index) => {
            const progress = userProgressResults[index];
            let userStatus = progress ? (progress.completed ? 'completed' : (progress.progress?.currentQuestion > 0 ? 'in-progress' : null)) : null;
            
            
            initialDetails[campaign._id] = getLiveCampaignDetails(campaign);
            
            return { ...campaign, userStatus };
        });
        
        setCampaigns(mergedCampaigns);
        setLiveDetails(initialDetails); 

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

 
  useEffect(() => {
    const interval = setInterval(() => {
        if (campaigns.length > 0) {
            const newDetails = { ...liveDetails };
            let hasChanged = false;
            campaigns.forEach(c => {
                if (c?._id) {
                    const newDetail = getLiveCampaignDetails(c);
                    
                    if (newDetail.status !== liveDetails[c._id]?.status || newDetail.displayTime.text !== liveDetails[c._id]?.displayTime.text) {
                        newDetails[c._id] = newDetail;
                        hasChanged = true;
                    }
                }
            });
            if (hasChanged) {
                setLiveDetails(newDetails);
            }
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [campaigns, liveDetails]);

  useEffect(() => {
 
    let filtered = [...campaigns];
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(c => {
        if (!c?._id) return false;
        
        const currentStatus = liveDetails[c._id]?.status || 'inactive';

        if (selectedFilter === 'completed') return c.userStatus === 'completed';
        if (selectedFilter === 'active') return currentStatus === 'active' && c.userStatus !== 'completed';
        if (selectedFilter === 'missed') return currentStatus === 'expired' && c.userStatus !== 'completed';
        if (selectedFilter === 'upcoming') return currentStatus === 'upcoming';
        
        // --- YENİ EKLENEN FİLTRE ---
        if (selectedFilter === 'not_eligible') {
          // Bu filtre için backend verisi hazır olana kadar burası boş bir liste döndürecek.
          // Gelecekte, örneğin `return c.isEligible === false;` gibi bir koşul ekleyebilirsiniz.
          return false;
        }

        return false;
      });
    }
    setFilteredCampaigns(filtered);
  }, [selectedFilter, campaigns, liveDetails]); 
  
  const handleCardPress = (campaign) => {
    if (!campaign?._id) return;
    navigation.navigate('CampaignDetail', { campaign });
  };

  
  const renderCampaignCard = ({ item }) => {
    const details = liveDetails[item._id] || getLiveCampaignDetails(item);
    return (
      <UserCampaignCard
        campaign={item}
        onPress={() => handleCardPress(item)}
        liveStatus={details.status}
        displayTime={details.displayTime}
      />
    );
  };

  const keyExtractor = (item) => item?._id || Math.random().toString();
  const renderEmptyState = () => (<View style={styles.emptyContainer}><Icon name="campaign" size={64} color={COLORS.TEXT_DISABLED} /><Text style={styles.emptyText}>No Campaigns Found</Text></View>);
  const renderSkeletonLoading = () => (<View style={styles.skeletonContainer}>{[...Array(3)].map((_, index) => (<View key={index} style={styles.skeletonCard} />))}</View>);
  const renderErrorState = () => (<View style={styles.errorContainer}><Icon name="error-outline" size={48} color={COLORS.ERROR} /><Text style={styles.errorText}>{error}</Text><TouchableOpacity style={styles.retryButton} onPress={handleRefresh}><Text style={styles.retryButtonText}>Try Again</Text></TouchableOpacity></View>);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient colors={[COLORS.BACKGROUND, COLORS.BACKGROUND]} style={styles.gradientContainer}>
          <UserCampaignHeader navigation={navigation} campaignCount={filteredCampaigns.length} />
          <UserCampaignFilters selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          
          {loading ? renderSkeletonLoading() : error ? renderErrorState() : (
            <FlatList
              data={filteredCampaigns}
              renderItem={renderCampaignCard}
              keyExtractor={keyExtractor}
              contentContainerStyle={[styles.listContainer, filteredCampaigns.length === 0 && styles.emptyListContainer]}
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
    emptyListContainer: { flex: 1, justifyContent: 'center' },
    emptyContainer: { alignItems: 'center', paddingBottom: 50 },
    emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginTop: 16 },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    errorText: { fontSize: 16, fontWeight: '600', color: COLORS.ERROR, textAlign: 'center' },
    retryButton: { backgroundColor: COLORS.PRIMARY, padding: 12, borderRadius: 12, marginTop: 16 },
    retryButtonText: { fontSize: 14, fontWeight: '600', color: '#181818' },
    skeletonContainer: { paddingHorizontal: 20, paddingTop: 10 },
    skeletonCard: { height: 220, backgroundColor: '#2A2A2A', borderRadius: 20, marginBottom: 16 },
});

export default CampaignsScreen;