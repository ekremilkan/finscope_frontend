import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CampaignSearchBar = ({ searchQuery, onSearchChange, placeholder = "Ara..." }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <Icon 
          name="search" 
          size={Math.max(18, Math.min(24, width * 0.05))} 
          color={isFocused ? "#6366f1" : "#94a3b8"} 
          style={styles.searchIcon}
        />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Icon 
              name="close" 
              size={Math.max(16, Math.min(20, width * 0.04))} 
              color="#94a3b8" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainerFocused: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
  },
  searchIcon: {
    marginRight: Math.max(12, width * 0.03),
  },
  searchInput: {
    flex: 1,
    fontSize: Math.max(16, Math.min(18, width * 0.045)),
    color: '#ffffff',
    paddingVertical: 0,
  },
  clearButton: {
    padding: Math.max(4, width * 0.01),
    marginLeft: Math.max(8, width * 0.02),
  },
});

export default CampaignSearchBar; 