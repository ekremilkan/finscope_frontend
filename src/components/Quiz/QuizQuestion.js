import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const QuizQuestion = ({ questionNumber, questionText }) => {
  return (
    <View style={styles.questionContainer}>
      <LinearGradient
        colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
        style={styles.questionGradient}
      >
        <Text style={styles.questionNumber}>
          Question {questionNumber}
        </Text>
        <Text style={styles.questionText}>
          {questionText}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 24,
  },
  questionGradient: {
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionNumber: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.PRIMARY,
    marginBottom: 8,
  },
  questionText: {
    fontSize: Math.max(18, width * 0.045),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    lineHeight: Math.max(26, width * 0.065),
  },
});

export default QuizQuestion; 