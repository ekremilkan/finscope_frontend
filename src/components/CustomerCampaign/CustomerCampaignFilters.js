import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CustomerCampaignFilters = ({ categories, statusFilters, selectedFilter, onFilterChange }) => {
  const allFilters = [...categories, ...statusFilters.slice(1)];

  return (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtersRow}>
          {allFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                { borderColor: filter.color },
                selectedFilter === filter.id && { backgroundColor: filter.color + '20' }
              ]}
              onPress={() => onFilterChange(filter.id)}
            >
              {filter.icon && <Icon name={filter.icon} size={16} color={filter.color} />}
              <Text style={[
                styles.filterText,
                { color: filter.color }
              ]}>
                {filter.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(20, width * 0.05),
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
  },
});

export default CustomerCampaignFilters; 