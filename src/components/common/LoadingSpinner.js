import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const LoadingSpinner = ({ 
  size = 'large', 
  color = '#6366f1', 
  text = 'Yükleniyor...',
  containerStyle = {},
  textStyle = {}
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator 
        size={size} 
        color={color} 
        style={styles.spinner}
      />
      {text && (
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(20, width * 0.05),
  },
  spinner: {
    marginBottom: Math.max(12, width * 0.03),
  },
  text: {
    fontSize: Math.max(14, Math.min(18, width * 0.045)),
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default LoadingSpinner; 