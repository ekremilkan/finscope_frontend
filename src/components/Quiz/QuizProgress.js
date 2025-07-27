import React from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
            <Icon name="warning" size={16} color="#ef4444" />
            <Text style={styles.penaltyText}>{penaltyTime}s</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 16,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    fontWeight: '600',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  penaltyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  penaltyText: {
    color: '#ef4444',
    fontSize: Math.max(10, width * 0.02),
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default QuizProgress; 