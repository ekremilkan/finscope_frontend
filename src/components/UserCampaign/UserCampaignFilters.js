import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CATEGORIES } from '../../constants/campaignConstants';

const { width } = Dimensions.get('window');

const UserCampaignFilters = ({ selectedFilter, onFilterChange }) => {
  return (
    <View style={styles.categoriesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.categoriesRow}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                { borderColor: category.color },
                selectedFilter === category.id && { backgroundColor: category.color + '20' }
              ]}
              onPress={() => onFilterChange(category.id)}
            >
              <Icon name={category.icon} size={16} color={category.color} />
              <Text style={[
                styles.categoryText,
                { color: category.color }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(20, width * 0.05),
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
  },
});

export default UserCampaignFilters; 