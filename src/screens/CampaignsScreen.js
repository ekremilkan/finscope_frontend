import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Data and Utils
import { USER_CAMPAIGN_DATA } from '../data/userCampaignData';
import { filterUserCampaigns, handleJoinCampaign } from '../utils/userCampaignUtils';

// Components
import UserCampaignHeader from '../components/UserCampaign/UserCampaignHeader';
import UserCampaignSearchBar from '../components/UserCampaign/UserCampaignSearchBar';
import UserCampaignFilters from '../components/UserCampaign/UserCampaignFilters';
import UserCampaignCard from '../components/UserCampaign/UserCampaignCard';

const { width } = Dimensions.get('window');

const CampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState(USER_CAMPAIGN_DATA);
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const filtered = filterUserCampaigns(campaigns, searchQuery, selectedFilter);
    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedFilter, campaigns]);

  const onJoinCampaign = (campaignId) => {
    handleJoinCampaign(campaigns, setCampaigns, campaignId, navigation);
  };

  const renderCampaignCard = ({ item }) => (
    <UserCampaignCard
      campaign={item}
      onJoinCampaign={onJoinCampaign}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="campaign" size={64} color="#94a3b8" />
      <Text style={styles.emptyText}>Kampanya bulunamadı</Text>
      <Text style={styles.emptySubtext}>Arama kriterlerinizi değiştirin</Text>
    </View>
  );

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
      
      <FlatList
        data={filteredCampaigns}
        renderItem={renderCampaignCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
  },
  emptyText: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.8)',
    marginTop: 8,
  },
});

export default CampaignsScreen; 