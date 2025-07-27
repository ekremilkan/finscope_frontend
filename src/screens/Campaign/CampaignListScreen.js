import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Services
import campaignService from '../../services/campaignService';

// Utils
import { 
  refreshCampaigns, 
  searchCampaigns, 
  filterAndSortCampaigns,
  handleApiError 
} from '../../utils/campaignUtils';

// Components
import CampaignCard from '../../components/Campaign/CampaignCard';
import CampaignHeader from '../../components/Campaign/CampaignHeader';
import CampaignSearchBar from '../../components/Campaign/CampaignSearchBar';
import CampaignFilters from '../../components/Campaign/CampaignFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const { width } = Dimensions.get('window');

const CampaignListScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  // Filter and sort campaigns when filters change
  useEffect(() => {
    const filtered = filterAndSortCampaigns(
      campaigns, 
      { search: searchQuery, status: selectedFilter },
      sortBy,
      sortOrder
    );
    setFilteredCampaigns(filtered);
  }, [campaigns, searchQuery, selectedFilter, sortBy, sortOrder]);

  // Load campaigns from API
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const campaignsData = await campaignService.getAllCampaigns();
      setCampaigns(campaignsData);
      
      console.log('✅ Campaigns loaded successfully:', campaignsData.length);
    } catch (error) {
      console.error('❌ Load campaigns error:', error);
      setError('Kampanyalar yüklenirken bir hata oluştu');
      handleApiError(error, []);
    } finally {
      setLoading(false);
    }
  };

  // Refresh campaigns
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshCampaigns(campaignService, setCampaigns, setLoading, setError);
    setRefreshing(false);
  };

  // Handle campaign join
  const handleJoinCampaign = async (campaign) => {
    try {
      const success = await campaignService.joinCampaign(campaign.id);
      
      if (success) {
        // Update local state
        setCampaigns(prev => prev.map(c => 
          c.id === campaign.id 
            ? { ...c, userJoined: true, participants: c.participants + 1 }
            : c
        ));
        
        Alert.alert(
          'Başarılı', 
          'Kampanyaya başarıyla katıldınız!',
          [
            {
              text: 'Kampanya Detayına Git',
              onPress: () => navigation.navigate('CampaignDetail', { campaignId: campaign.id })
            },
            {
              text: 'Quiz\'e Başla',
              onPress: () => navigation.navigate('QuizScreen', {
                campaignId: campaign.id,
                campaignTitle: campaign.title,
                reward: campaign.reward
              })
            }
          ]
        );
      }
    } catch (error) {
      console.error('Join campaign error:', error);
      Alert.alert('Hata', 'Kampanyaya katılırken bir hata oluştu');
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // Handle sort change
  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Render campaign card
  const renderCampaignCard = useCallback(({ item }) => (
    <CampaignCard
      campaign={item}
      onJoinCampaign={handleJoinCampaign}
      onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
    />
  ), [navigation]);

  // Render empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="campaign" size={64} color="#94a3b8" />
        <Text style={styles.emptyText}>
          {searchQuery || selectedFilter !== 'all' 
            ? 'Arama kriterlerinize uygun kampanya bulunamadı'
            : 'Henüz kampanya bulunmuyor'
          }
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery || selectedFilter !== 'all' 
            ? 'Farklı arama terimleri deneyin'
            : 'Yakında yeni kampanyalar eklenecek'
          }
        </Text>
      </View>
    );
  };

  // Render loading state
  const renderLoadingState = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Kampanyalar yükleniyor...</Text>
      </View>
    );
  };

  // Render error state
  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>Lütfen tekrar deneyin</Text>
      </View>
    );
  };

  // Render list footer
  const renderListFooter = () => {
    if (filteredCampaigns.length === 0) return null;
    
    return (
      <View style={styles.listFooter}>
        <Text style={styles.footerText}>
          {filteredCampaigns.length} kampanya gösteriliyor
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CampaignHeader
        navigation={navigation}
        campaignCount={filteredCampaigns.length}
        totalCount={campaigns.length}
      />
      
      <CampaignSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        placeholder="Kampanya ara..."
      />
      
      <CampaignFilters
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      
      {loading && !refreshing ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={filteredCampaigns}
          renderItem={renderCampaignCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderListFooter}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  listContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: Math.max(16, width * 0.04),
    color: '#94a3b8',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  listFooter: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#94a3b8',
  },
});

export default CampaignListScreen; 