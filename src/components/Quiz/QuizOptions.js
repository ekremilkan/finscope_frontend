import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';

const { width } = Dimensions.get('window');

const QuizOptions = ({ options, selectedAnswer, onAnswerSelect, disabled = false, showCorrectAnswer = false, correctAnswerIndex = null }) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = showCorrectAnswer && correctAnswerIndex === index && isSelected;
        const isWrong = showCorrectAnswer && isSelected && correctAnswerIndex !== index;
        
        return (
        <TouchableOpacity
            key={option._id || index}
          style={[
            styles.optionButton,
              isSelected && styles.selectedOption,
              disabled && styles.disabledOption,
              isCorrect && styles.correctOption,
              isWrong && styles.wrongOption
          ]}
            onPress={() => !disabled && onAnswerSelect(index)}
            activeOpacity={disabled ? 1 : 0.8}
            disabled={disabled}
        >
          <LinearGradient
            colors={getOptionGradientColors(isSelected, disabled, isCorrect, isWrong)}
            style={styles.optionGradient}
          >
            <View style={styles.optionContent}>
              <View style={[
                styles.optionCircle,
                  isSelected && styles.selectedCircle,
                  disabled && styles.disabledCircle,
                  isCorrect && styles.correctCircle,
                  isWrong && styles.wrongCircle
              ]}>
                  {isSelected && (
                    <Icon 
                      name={isCorrect ? "check" : "close"} 
                      size={16} 
                      color={COLORS.TEXT_PRIMARY} 
                    />
                )}
              </View>
              <Text style={[
                styles.optionText,
                  isSelected && styles.selectedOptionText,
                  disabled && styles.disabledOptionText,
                  isCorrect && styles.correctOptionText,
                  isWrong && styles.wrongOptionText
              ]}>
                  {option.text || option}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getOptionGradientColors = (isSelected, disabled, isCorrect, isWrong) => {
  if (disabled) {
    return [COLORS.GLASS_BACKGROUND + '80', COLORS.GLASS_BACKGROUND + '80'];
  }
  if (isCorrect) {
    return [`${COLORS.SUCCESS}20`, `${COLORS.SUCCESS}10`];
  }
  if (isWrong) {
    return [`${COLORS.ERROR}20`, `${COLORS.ERROR}10`];
  }
  if (isSelected) {
    return [`${COLORS.PRIMARY}20`, `${COLORS.PRIMARY}10`];
  }
  return [COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND];
};

const getOptionBorderColor = (isSelected, disabled, isCorrect, isWrong) => {
  if (disabled) {
    return COLORS.BORDER_DISABLED;
  }
  if (isCorrect) {
    return COLORS.SUCCESS;
  }
  if (isWrong) {
    return COLORS.ERROR;
  }
  if (isSelected) {
    return COLORS.PRIMARY;
  }
  return COLORS.BORDER_SECONDARY;
};

const styles = StyleSheet.create({
  optionsContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    gap: 12,
  },
  optionButton: {
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    borderWidth: 2,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  optionGradient: {
    borderRadius: Math.max(16, width * 0.04),
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    borderWidth: 2,
  },
  selectedOption: {
    // Gradient already applied
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BORDER_SECONDARY,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.GLASS_BACKGROUND,
  },
  selectedCircle: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  selectedOptionText: {
    ...getFontFamily('SEMIBOLD'),
  },
  disabledOption: {
    opacity: 0.7,
    shadowOpacity: 0.05,
    elevation: 1,
  },
  disabledCircle: {
    backgroundColor: COLORS.BORDER_DISABLED,
    borderColor: COLORS.BORDER_DISABLED,
  },
  disabledOptionText: {
    color: COLORS.TEXT_DISABLED,
  },
  correctOption: {
    // Gradient already applied
  },
  correctCircle: {
    backgroundColor: COLORS.SUCCESS,
    borderColor: COLORS.SUCCESS,
  },
  wrongOption: {
    // Gradient already applied
  },
  wrongCircle: {
    backgroundColor: COLORS.ERROR,
    borderColor: COLORS.ERROR,
  },
  correctOptionText: {
    color: COLORS.SUCCESS,
    ...getFontFamily('SEMIBOLD'),
  },
  wrongOptionText: {
    color: COLORS.ERROR,
    ...getFontFamily('SEMIBOLD'),
  },
});

export default QuizOptions; 