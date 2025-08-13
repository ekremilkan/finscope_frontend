import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  CARD_BACKGROUND: '#2A2A2A',
  ERROR: '#ef4444',
};

const QuizProgress = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  progressValue,
  isPenaltyActive,
  penaltyTime,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
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
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>PROGRESS</Text>
        
        {isPenaltyActive ? (
          <View style={styles.penaltyContainer}>
            <Icon name="timer-off" size={14} color={COLORS.ERROR} />
            <Text style={styles.penaltyText}>{penaltyTime}s PENALTY</Text>
          </View>
        ) : (
          <Text style={styles.infoCounter}>
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 16 },
  progressTrack: { height: 10, backgroundColor: COLORS.CARD_BACKGROUND, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.PRIMARY, borderRadius: 5 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  infoLabel: { color: COLORS.TEXT_SECONDARY, fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  infoCounter: { color: COLORS.TEXT_PRIMARY, fontSize: 14, fontWeight: '700' },
  penaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  penaltyText: {
    color: COLORS.ERROR,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});

export default QuizProgress;