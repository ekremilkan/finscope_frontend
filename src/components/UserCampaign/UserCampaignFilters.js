import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CATEGORIES } from '../../constants/campaignConstants';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

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
                selectedFilter === category.id && styles.categoryButtonSelected
              ]}
              onPress={() => onFilterChange(category.id)}
            >
              <Icon 
                name={category.icon} 
                size={16} 
                color={selectedFilter === category.id ? COLORS.SECONDARY : COLORS.PRIMARY} 
              />
              <Text style={[
                styles.categoryText,
                selectedFilter === category.id && styles.categoryTextSelected
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
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.CARD_BACKGROUND,
    gap: 6,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.3,
  },
  categoryText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  categoryTextSelected: {
    color: COLORS.SECONDARY,
  },
});

export default UserCampaignFilters; 