import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const QuizQuestion = ({ questionNumber, questionText }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionNumber}>
        Question {questionNumber}
      </Text>
      <Text style={styles.questionText}>
        {questionText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 24,
  },
  questionNumber: {
    fontSize: Math.max(14, width * 0.035),
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: Math.max(26, width * 0.065),
  },
});

export default QuizQuestion; 