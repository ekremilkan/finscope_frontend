import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = 'medium',
  color = '#6366f1',
  showProgress = false,
  progress = 0,
  type = 'spinner' // 'spinner', 'dots', 'pulse'
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dotValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  // Spinner animation
  useEffect(() => {
    if (type === 'spinner') {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    }
  }, [type]);

  // Pulse animation
  useEffect(() => {
    if (type === 'pulse') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [type]);

  // Dots animation
  useEffect(() => {
    if (type === 'dots') {
      const dotAnimations = dotValues.map((dotValue, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(dotValue, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dotValue, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      });

      dotAnimations.forEach(animation => animation.start());
      return () => dotAnimations.forEach(animation => animation.stop());
    }
  }, [type]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 40;
      default: return 30;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return Math.max(12, width * 0.03);
      case 'large': return Math.max(18, width * 0.045);
      default: return Math.max(14, width * 0.035);
    }
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <View style={styles.dotsContainer}>
            {dotValues.map((dotValue, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: color,
                    opacity: dotValue,
                    transform: [{
                      scale: dotValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      })
                    }]
                  }
                ]}
              />
            ))}
          </View>
        );
      
      case 'pulse':
        return (
          <Animated.View
            style={[
              styles.pulseContainer,
              {
                opacity: pulseValue,
                transform: [{
                  scale: pulseValue.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1.2],
                  })
                }]
              }
            ]}
          >
            <Icon name="sync" size={getSize()} color={color} />
          </Animated.View>
        );
      
      default:
        return (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Icon name="sync" size={getSize()} color={color} />
          </Animated.View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderSpinner()}
      
      {text && (
        <Text style={[styles.text, { fontSize: getTextSize(), color }]}>
          {text}
        </Text>
      )}
      
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: color 
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Math.max(20, width * 0.05),
  },
  text: {
    marginTop: Math.max(12, width * 0.03),
    fontWeight: '500',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginTop: Math.max(16, width * 0.04),
    alignItems: 'center',
  },
  progressBar: {
    width: Math.max(200, width * 0.5),
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    marginTop: Math.max(8, width * 0.02),
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '600',
  },
});

export default LoadingSpinner; 