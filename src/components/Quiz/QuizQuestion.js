import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
};

const QuizQuestion = ({ questionNumber, questionText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{questionNumber}</Text>
        </View>
        <Text style={styles.questionText}>
          {questionText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  numberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(247, 214, 72, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginBottom: 16,
  },
  numberText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
});

export default QuizQuestion;