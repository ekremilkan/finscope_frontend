import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';

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
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.cardGradient}
            >
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
            </LinearGradient>
          </View>
        );

      case 'list':
        return (
          <View style={[styles.listItem, style]}>
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.listGradient}
            >
              <Animated.View style={[styles.listImage, { opacity }]} />
              <View style={styles.listContent}>
                <Animated.View style={[styles.listTitle, { opacity }]} />
                <Animated.View style={[styles.listSubtitle, { opacity }]} />
              </View>
              <Animated.View style={[styles.listButton, { opacity }]} />
            </LinearGradient>
          </View>
        );

      case 'text':
        return (
          <View style={[styles.textContainer, style]}>
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.textGradient}
            >
              <Animated.View style={[styles.textLine, { opacity }]} />
              <Animated.View style={[styles.textLine, { width: '80%', opacity }]} />
              <Animated.View style={[styles.textLine, { width: '60%', opacity }]} />
            </LinearGradient>
          </View>
        );

      case 'custom':
        return (
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={[
              styles.customSkeleton, 
              { 
                width: customWidth || 100,
                height: customHeight || 20,
              },
              style
            ]}
          >
            <Animated.View style={{ opacity }} />
          </LinearGradient>
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
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Math.max(12, width * 0.03),
  },
  cardGradient: {
    borderRadius: Math.max(16, width * 0.04),
    padding: Math.max(16, width * 0.04),
  },
  cardImage: {
    width: '100%',
    height: Math.max(120, width * 0.3),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(12, width * 0.03),
    marginBottom: Math.max(12, width * 0.03),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    width: '80%',
    height: Math.max(20, width * 0.05),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
    marginBottom: Math.max(8, width * 0.02),
  },
  cardSubtitle: {
    width: '60%',
    height: Math.max(16, width * 0.04),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
    marginBottom: Math.max(12, width * 0.03),
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardStat: {
    width: Math.max(60, width * 0.15),
    height: Math.max(16, width * 0.04),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
  },

  // List skeleton
  listItem: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: Math.max(8, width * 0.02),
  },
  listGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Math.max(12, width * 0.03),
    padding: Math.max(16, width * 0.04),
  },
  listImage: {
    width: Math.max(50, width * 0.12),
    height: Math.max(50, width * 0.12),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(8, width * 0.02),
    marginRight: Math.max(12, width * 0.03),
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    width: '70%',
    height: Math.max(18, width * 0.045),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
    marginBottom: Math.max(6, width * 0.015),
  },
  listSubtitle: {
    width: '50%',
    height: Math.max(14, width * 0.035),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
  },
  listButton: {
    width: Math.max(80, width * 0.2),
    height: Math.max(32, width * 0.08),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(16, width * 0.04),
  },

  // Text skeleton
  textContainer: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textGradient: {
    padding: Math.max(16, width * 0.04),
    borderRadius: Math.max(12, width * 0.03),
  },
  textLine: {
    height: Math.max(16, width * 0.04),
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
    marginBottom: Math.max(8, width * 0.02),
  },

  // Custom skeleton
  customSkeleton: {
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: Math.max(4, width * 0.01),
  },
});

export default SkeletonLoader; 