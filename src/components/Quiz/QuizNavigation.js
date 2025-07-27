import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const QuizNavigation = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  hasSelectedAnswer, 
  onPrevious, 
  onNext,
  disabled = false
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[
          styles.navButton, 
          styles.prevButton,
          disabled && styles.disabledButton
        ]}
        onPress={onPrevious}
        disabled={isFirstQuestion || disabled}
        activeOpacity={0.8}
      >
        <Icon name="chevron-left" size={24} color="#ffffff" />
        <Text style={styles.navButtonText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.navButton, 
          styles.nextButton,
          (!hasSelectedAnswer || disabled) && styles.disabledButton
        ]}
        onPress={onNext}
        disabled={!hasSelectedAnswer || disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.navButtonText}>
          {isLastQuestion ? 'Finish' : 'Next'}
        </Text>
        <Icon name="chevron-right" size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    minWidth: Math.max(100, width * 0.25),
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  nextButton: {
    backgroundColor: '#6366f1',
  },
  disabledButton: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
    marginHorizontal: 4,
  },
});

export default QuizNavigation; 