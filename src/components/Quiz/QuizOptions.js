import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
};

const QuizOptions = ({ 
  options, 
  onAnswerSelect, 
  disabled, 
  showAnswerFeedback, 
  selectedOptionIndex, // Sadece seçimi göstermek için
  feedbackIndex, // Geri bildirim için (doğru/yanlış)
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => {
        const isSelected = selectedOptionIndex === index;
        const isCorrectAnswer = option.isTrue === true;
        const isFeedbackTarget = feedbackIndex === index;

        let borderColor = COLORS.BORDER;
        let iconName = null;
        let iconColor = borderColor;

        if (showAnswerFeedback && isFeedbackTarget) {
          // Geri bildirim aktif ve bu şık kontrol edilen şık ise
          borderColor = isCorrectAnswer ? COLORS.SUCCESS : COLORS.ERROR;
          iconName = isCorrectAnswer ? 'check' : 'close';
          iconColor = borderColor;
        } else if (isSelected) {
          // Sadece seçili ama henüz kontrol edilmemişse
          borderColor = COLORS.PRIMARY;
        }
        
        return (
          <TouchableOpacity
            key={option._id || index}
            style={[styles.optionButton, { borderColor }]}
            onPress={() => onAnswerSelect(index)}
            disabled={disabled}
            activeOpacity={0.8}
          >
            <Text style={styles.optionText}>{option.text}</Text>
            <View style={[styles.optionCircle, { borderColor }]}>
              {iconName && <Icon name={iconName} size={18} color={iconColor} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: { paddingHorizontal: 20, gap: 12, marginTop: 20 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginRight: 10,
    fontWeight: '500',
  },
  optionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuizOptions;