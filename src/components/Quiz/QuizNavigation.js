import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

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
        <LinearGradient
          colors={getPrevButtonColors(isFirstQuestion || disabled)}
          style={styles.navButtonGradient}
        >
          <Icon name="chevron-left" size={24} color={COLORS.TEXT_PRIMARY} />
          <Text style={styles.navButtonText}>Previous</Text>
        </LinearGradient>
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
        <LinearGradient
          colors={getNextButtonColors(!hasSelectedAnswer || disabled)}
          style={styles.navButtonGradient}
        >
          <Text style={styles.navButtonText}>
            {isLastQuestion ? 'Finish' : 'Next'}
          </Text>
          <Icon name="chevron-right" size={24} color={COLORS.TEXT_PRIMARY} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const getPrevButtonColors = (disabled) => {
  if (disabled) {
    return [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80'];
  }
  return [COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND];
};

const getNextButtonColors = (disabled) => {
  if (disabled) {
    return [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80'];
  }
  return [COLORS.PRIMARY, COLORS.PRIMARY];
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.GLASS_BACKGROUND,
  },
  navButton: {
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
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(12, width * 0.03),
    minWidth: Math.max(100, width * 0.25),
    justifyContent: 'center',
  },
  prevButton: {
    // Gradient already applied
  },
  nextButton: {
    // Gradient already applied
  },
  disabledButton: {
    // Gradient already applied
  },
  navButtonText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
    marginHorizontal: 4,
  },
});

export default QuizNavigation; 