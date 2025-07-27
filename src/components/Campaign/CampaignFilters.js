import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CampaignFilters = ({ 
  selectedFilter, 
  onFilterChange, 
  sortBy, 
  sortOrder, 
  onSortChange 
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filterOptions = [
    { key: 'all', label: 'Tümü', icon: 'list' },
    { key: 'active', label: 'Aktif', icon: 'play-circle' },
    { key: 'upcoming', label: 'Yakında', icon: 'schedule' },
    { key: 'expired', label: 'Süresi Dolmuş', icon: 'block' },
  ];

  const sortOptions = [
    { key: 'createdAt', label: 'Tarih', icon: 'schedule' },
    { key: 'title', label: 'Başlık', icon: 'sort-by-alpha' },
    { key: 'reward', label: 'Ödül', icon: 'monetization-on' },
    { key: 'participants', label: 'Katılımcı', icon: 'people' },
  ];

  const handleFilterPress = (filterKey) => {
    onFilterChange(filterKey);
  };

  const handleSortPress = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(newSortBy, newSortOrder);
    setShowSortMenu(false);
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'title': return 'sort-by-alpha';
      case 'reward': return 'monetization-on';
      case 'participants': return 'people';
      default: return 'schedule';
    }
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    return option ? option.label : 'Tarih';
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              selectedFilter === option.key && styles.filterButtonActive
            ]}
            onPress={() => handleFilterPress(option.key)}
            activeOpacity={0.7}
          >
            <Icon 
              name={option.icon} 
              size={Math.max(16, Math.min(20, width * 0.04))} 
              color={selectedFilter === option.key ? '#6366f1' : '#94a3b8'} 
            />
            <Text style={[
              styles.filterButtonText,
              selectedFilter === option.key && styles.filterButtonTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
          activeOpacity={0.7}
        >
          <Icon 
            name={getSortIcon()} 
            size={Math.max(16, Math.min(20, width * 0.04))} 
            color="#6366f1" 
          />
          <Text style={styles.sortButtonText}>
            {getSortLabel()}
          </Text>
          <Icon 
            name={sortOrder === 'asc' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
            size={Math.max(16, Math.min(20, width * 0.04))} 
            color="#6366f1" 
          />
        </TouchableOpacity>

        {showSortMenu && (
          <View style={styles.sortMenu}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortMenuItem,
                  sortBy === option.key && styles.sortMenuItemActive
                ]}
                onPress={() => handleSortPress(option.key)}
                activeOpacity={0.7}
              >
                <Icon 
                  name={option.icon} 
                  size={Math.max(16, Math.min(20, width * 0.04))} 
                  color={sortBy === option.key ? '#6366f1' : '#94a3b8'} 
                />
                <Text style={[
                  styles.sortMenuItemText,
                  sortBy === option.key && styles.sortMenuItemTextActive
                ]}>
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <Icon 
                    name={sortOrder === 'asc' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                    size={Math.max(16, Math.min(20, width * 0.04))} 
                    color="#6366f1" 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingVertical: Math.max(12, width * 0.03),
  },
  filtersContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    gap: Math.max(8, width * 0.02),
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(12, width * 0.03),
    paddingVertical: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    minWidth: 80,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: Math.max(12, Math.min(16, width * 0.04)),
    color: '#94a3b8',
    marginLeft: Math.max(6, width * 0.015),
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  sortContainer: {
    position: 'relative',
    paddingHorizontal: Math.max(20, width * 0.05),
    marginTop: Math.max(12, width * 0.03),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  sortButtonText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: Math.max(8, width * 0.02),
    flex: 1,
  },
  sortMenu: {
    position: 'absolute',
    top: '100%',
    left: Math.max(20, width * 0.05),
    right: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    marginTop: Math.max(4, width * 0.01),
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  sortMenuItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  sortMenuItemText: {
    fontSize: Math.max(14, Math.min(16, width * 0.04)),
    color: '#94a3b8',
    marginLeft: Math.max(8, width * 0.02),
    flex: 1,
  },
  sortMenuItemTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
});

export default CampaignFilters; 