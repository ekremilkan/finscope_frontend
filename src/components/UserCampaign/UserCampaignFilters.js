//not eligible tamam ancak filtre gerek
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const UserCampaignFilters = ({ selectedFilter, onFilterChange }) => {
  // Kullanıcının istediği yeni filtre seçenekleri
  const filterOptions = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'active', label: 'Active', icon: 'play-circle-outline' },
    { key: 'upcoming', label: 'Upcoming', icon: 'schedule' },
    { key: 'completed', label: 'Success', icon: 'check-circle' }, 
    { key: 'missed', label: 'Missed', icon: 'cancel' },
    { key: 'not_eligible', label: 'Not Eligible', icon: 'block' }, 
  ];

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
              selectedFilter === option.key && styles.filterButtonActive,
            ]}
            onPress={() => onFilterChange(option.key)}
            activeOpacity={0.8}
          >
            <Icon
              name={option.icon}
              size={18}
              color={selectedFilter === option.key ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
            />
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === option.key && styles.filterButtonTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    borderColor: COLORS.PRIMARY,
  },
  filterButtonText: {
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  filterButtonTextActive: {
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
  },
});

export default UserCampaignFilters;