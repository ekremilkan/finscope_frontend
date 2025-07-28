import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Services
import campaignService from '../services/campaignService';

// Utils
import { filterUserCampaigns, handleJoinCampaign } from '../utils/userCampaignUtils';
import { handleApiError } from '../utils/campaignUtils';
import { navigateToCampaignDetail, getNavigationParams, setNavigationParams } from '../utils/navigationUtils';
import { showErrorAlert, createRetryHandler } from '../utils/errorHandler';

// Components
import UserCampaignHeader from '../components/UserCampaign/UserCampaignHeader';
import UserCampaignSearchBar from '../components/UserCampaign/UserCampaignSearchBar';
import UserCampaignFilters from '../components/UserCampaign/UserCampaignFilters';
import UserCampaignCard from '../components/UserCampaign/UserCampaignCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SkeletonLoader from '../components/common/SkeletonLoader';

const { width } = Dimensions.get('window');

const CampaignsScreen = ({ navigation, route }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  // Handle navigation params for quiz completion
  useEffect(() => {
    const refreshCampaigns = getNavigationParams(route, 'refreshCampaigns');
    if (refreshCampaigns) {
      console.log('🔄 Refreshing campaigns after quiz completion...');
      loadCampaigns();
      // Clear the params to prevent infinite refresh
      setNavigationParams(navigation, { 
        refreshCampaigns: undefined, 
        completedCampaignId: undefined 
      });
    }
  }, [route.params?.refreshCampaigns]);

  // Handle focus effect for tab navigation params
  useFocusEffect(
    React.useCallback(() => {
      const refreshCampaigns = route.params?.refreshCampaigns;
      if (refreshCampaigns) {
        console.log('🔄 Refreshing campaigns after quiz completion (focus effect)...');
        loadCampaigns();
        // Clear the params to prevent infinite refresh
        navigation.setParams({ 
          refreshCampaigns: undefined, 
          completedCampaignId: undefined 
        });
      }
    }, [route.params?.refreshCampaigns])
  );

  // Filter campaigns when search or filter changes
  useEffect(() => {
    const filtered = filterUserCampaigns(campaigns, searchQuery, selectedFilter);
    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedFilter, campaigns]);

  // Load campaigns from API using campaignService with retry mechanism
  const loadCampaigns = async () => {
    const retryLoadCampaigns = createRetryHandler(async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Loading campaigns from API...');
        const campaignsData = await campaignService.getAllCampaigns();
        
        if (campaignsData && campaignsData.length > 0) {
          setCampaigns(campaignsData);
          console.log('✅ Campaigns loaded successfully:', campaignsData.length);
        } else {
          console.log('⚠️ No campaigns found');
          setCampaigns([]);
        }
      } catch (error) {
        console.error('❌ Load campaigns error:', error);
        const errorInfo = handleApiError(error, 'Load Campaigns');
        setError(errorInfo.message);
        setCampaigns([]);
        throw error; // Re-throw for retry mechanism
      } finally {
        setLoading(false);
      }
    }, 3); // 3 retry attempts

    try {
      await retryLoadCampaigns();
    } catch (error) {
      // Show user-friendly error alert
      showErrorAlert(error, () => {
        console.log('🔄 User requested retry for campaigns');
        loadCampaigns();
      });
    }
  };

  // Refresh campaigns using campaignService
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing campaigns...');
      const campaignsData = await campaignService.getAllCampaigns();
      
      if (campaignsData && campaignsData.length > 0) {
        setCampaigns(campaignsData);
        setError(null);
        console.log('✅ Campaigns refreshed successfully');
      } else {
        console.log('⚠️ No campaigns found during refresh');
        setCampaigns([]);
      }
    } catch (error) {
      console.error('❌ Refresh campaigns error:', error);
      setError('Kampanyalar yenilenirken bir hata oluştu');
      setCampaigns([]);
    } finally {
      setRefreshing(false);
    }
  };

  const onJoinCampaign = async (campaignId) => {
    await handleJoinCampaign(campaigns, setCampaigns, campaignId, navigation);
  };

  const renderCampaignCard = ({ item }) => (
    <UserCampaignCard
      campaign={item}
      onJoinCampaign={onJoinCampaign}
      onPress={() => navigateToCampaignDetail(navigation, item._id)}
    />
  );

  // Safe keyExtractor function
  const keyExtractor = (item, index) => {
    if (item && item._id) {
      return item._id.toString();
    }
    return index.toString();
  };

  const renderEmptyState = () => {
    if (loading || campaigns.length > 0 || filteredCampaigns.length > 0) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Icon name="campaign" size={64} color="#94a3b8" />
        <Text style={styles.emptyText}>
          {searchQuery || selectedFilter !== 'all' 
            ? 'No campaigns found matching your search criteria'
            : 'No campaigns available yet'
          }
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery || selectedFilter !== 'all' 
            ? 'Try different search terms'
            : 'New campaigns will be added soon'
          }
        </Text>
      </View>
    );
  };

  const renderSkeletonLoading = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.skeletonContainer}>
        {[1, 2, 3].map((index) => (
          <SkeletonLoader 
            key={index}
            type="card"
            style={styles.skeletonCard}
          />
        ))}
      </View>
    );
  };

  const renderErrorState = () => {
    if (!error) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadCampaigns}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <UserCampaignHeader
        navigation={navigation}
        campaignCount={filteredCampaigns.length}
      />
      
      <UserCampaignSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <UserCampaignFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      
      {loading ? (
        renderSkeletonLoading()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={filteredCampaigns}
          renderItem={renderCampaignCard}
          keyExtractor={keyExtractor}
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
          ListEmptyComponent={!loading ? renderEmptyState : null}
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
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    marginTop: Math.max(16, width * 0.04),
  },
  retryButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
  },
  skeletonContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingBottom: 100,
  },
  skeletonCard: {
    marginBottom: 15,
  },
});

export default CampaignsScreen; 