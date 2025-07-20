//onboard 5 sayfa (zorunlu)
//yanlış cevap +20 saniye doğru olmadan sonraki soruya geçilmiyor 
//test sonunda doğruluk yüzdesi olmayacak
//quiz tamamlandı ekranında geçip geçmediği (limite göre quiz anıında veya öncesinde pop-up açılacak(websocket))
//try again butonu kalkacak
//süre=person
//advanced yerine kampanya status bilgisi
//search yoruma al
//

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Components
import CustomerCampaignHeader from '../components/CustomerCampaign/CustomerCampaignHeader';
import CustomerCampaignSearchBar from '../components/CustomerCampaign/CustomerCampaignSearchBar';
import CustomerCampaignFilters from '../components/CustomerCampaign/CustomerCampaignFilters';
import CustomerCampaignCard from '../components/CustomerCampaign/CustomerCampaignCard';
import CustomerCampaignCreateModal from '../components/CustomerCampaign/CustomerCampaignCreateModal';

// Data and utils
import { CUSTOMER_CAMPAIGN_DATA } from '../data/customerCampaignData';
import { CATEGORIES, CAMPAIGN_STATUSES, DIFFICULTIES } from '../constants/campaignConstants';
import { filterCampaigns } from '../utils/campaignUtils';

const { width } = Dimensions.get('window');

const CustomerCampaignsScreen = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState(CUSTOMER_CAMPAIGN_DATA);
  const [filteredCampaigns, setFilteredCampaigns] = useState(campaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const filtered = filterCampaigns(campaigns, searchQuery, selectedFilter);
    setFilteredCampaigns(filtered);
  }, [searchQuery, selectedFilter, campaigns]);

  const handleCreateCampaign = (newCampaignData) => {
    const campaign = {
      id: campaigns.length + 1,
      ...newCampaignData,
      participants: 0,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      conversionRate: 0
    };

    setCampaigns(prev => [...prev, campaign]);
    setShowCreateModal(false);
  };

  const handleDeleteCampaign = (campaignId) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  const handleToggleStatus = (campaignId) => {
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId 
        ? { ...c, status: c.status === 'active' ? 'draft' : 'active' }
        : c
    ));
  };

  const renderCampaignCard = ({ item }) => (
    <CustomerCampaignCard
      campaign={item}
      onDelete={handleDeleteCampaign}
      onToggleStatus={handleToggleStatus}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="campaign" size={64} color="#94a3b8" />
      <Text style={styles.emptyText}>No campaigns yet</Text>
      <Text style={styles.emptySubtext}>Create your first campaign</Text>
    </View>
  );

  const renderFAB = () => (
    <TouchableOpacity 
      style={styles.fab}
      onPress={() => setShowCreateModal(true)}
      activeOpacity={0.8}
    >
      <Icon name="add" size={28} color="#ffffff" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomerCampaignHeader
        navigation={navigation}
        campaignCount={filteredCampaigns.length}
        onCreatePress={() => setShowCreateModal(true)}
      />
      
      <CustomerCampaignSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <CustomerCampaignFilters
        categories={CATEGORIES}
        statusFilters={CAMPAIGN_STATUSES}
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

      <CustomerCampaignCreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaign}
        categories={CATEGORIES}
        difficulties={DIFFICULTIES}
      />

      {renderFAB()}
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
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

export default CustomerCampaignsScreen; 