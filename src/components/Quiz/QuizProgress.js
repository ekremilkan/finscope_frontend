import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const QuizProgress = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  progressValue, 
  isPenaltyActive = false,
  penaltyTime = 0 
}) => {
  return (
    <View style={styles.progressContainer}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.progressGradient}
      >
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {totalQuestions}
          </Text>
          
          {isPenaltyActive && (
            <View style={styles.penaltyIndicator}>
              <LinearGradient
                colors={[`${COLORS.ERROR}20`, `${COLORS.ERROR}10`]}
                style={styles.penaltyGradient}
              >
                <Icon name="warning" size={16} color={COLORS.ERROR} />
                <Text style={styles.penaltyText}>{penaltyTime}s</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 16,
    alignItems: 'center',
  },
  progressGradient: {
    width: '100%',
    padding: Math.max(16, width * 0.04),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.BORDER_SECONDARY,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  penaltyIndicator: {
    borderRadius: Math.max(8, width * 0.02),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  penaltyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Math.max(8, width * 0.02),
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  penaltyText: {
    color: COLORS.ERROR,
    fontSize: Math.max(10, width * 0.02),
    ...getFontFamily('SEMIBOLD'),
    marginLeft: 4,
  },
});

export default QuizProgress; 