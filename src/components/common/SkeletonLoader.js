import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonLoader = ({ 
  type = 'card', // 'card', 'list', 'text', 'custom'
  width: customWidth,
  height: customHeight,
  style = {}
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <View style={[styles.card, style]}>
            <Animated.View style={[styles.cardImage, { opacity }]} />
            <View style={styles.cardContent}>
              <Animated.View style={[styles.cardTitle, { opacity }]} />
              <Animated.View style={[styles.cardSubtitle, { opacity }]} />
              <View style={styles.cardStats}>
                <Animated.View style={[styles.cardStat, { opacity }]} />
                <Animated.View style={[styles.cardStat, { opacity }]} />
                <Animated.View style={[styles.cardStat, { opacity }]} />
              </View>
            </View>
          </View>
        );

      case 'list':
        return (
          <View style={[styles.listItem, style]}>
            <Animated.View style={[styles.listImage, { opacity }]} />
            <View style={styles.listContent}>
              <Animated.View style={[styles.listTitle, { opacity }]} />
              <Animated.View style={[styles.listSubtitle, { opacity }]} />
            </View>
            <Animated.View style={[styles.listButton, { opacity }]} />
          </View>
        );

      case 'text':
        return (
          <View style={[styles.textContainer, style]}>
            <Animated.View style={[styles.textLine, { opacity }]} />
            <Animated.View style={[styles.textLine, { width: '80%', opacity }]} />
            <Animated.View style={[styles.textLine, { width: '60%', opacity }]} />
          </View>
        );

      case 'custom':
        return (
          <Animated.View 
            style={[
              styles.customSkeleton, 
              { 
                width: customWidth || 100,
                height: customHeight || 20,
                opacity 
              },
              style
            ]} 
          />
        );

      default:
        return null;
    }
  };

  return renderSkeleton();
};

const styles = StyleSheet.create({
  // Card skeleton
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: Math.max(16, width * 0.04),
    marginBottom: Math.max(12, width * 0.03),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: Math.max(120, width * 0.3),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 12,
    marginBottom: Math.max(12, width * 0.03),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    width: '80%',
    height: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
    marginBottom: Math.max(8, width * 0.02),
  },
  cardSubtitle: {
    width: '60%',
    height: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
    marginBottom: Math.max(12, width * 0.03),
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardStat: {
    width: Math.max(60, width * 0.15),
    height: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
  },

  // List skeleton
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 12,
    padding: Math.max(16, width * 0.04),
    marginBottom: Math.max(8, width * 0.02),
  },
  listImage: {
    width: Math.max(50, width * 0.12),
    height: Math.max(50, width * 0.12),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 8,
    marginRight: Math.max(12, width * 0.03),
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    width: '70%',
    height: Math.max(18, width * 0.045),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
    marginBottom: Math.max(6, width * 0.015),
  },
  listSubtitle: {
    width: '50%',
    height: Math.max(14, width * 0.035),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
  },
  listButton: {
    width: Math.max(80, width * 0.2),
    height: Math.max(32, width * 0.08),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 16,
  },

  // Text skeleton
  textContainer: {
    padding: Math.max(16, width * 0.04),
  },
  textLine: {
    height: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
    marginBottom: Math.max(8, width * 0.02),
  },

  // Custom skeleton
  customSkeleton: {
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
    borderRadius: 4,
  },
});

export default SkeletonLoader; 