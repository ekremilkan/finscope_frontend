import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
                    color="#ffffff" 
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
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    paddingHorizontal: Math.max(20, width * 0.05),
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    paddingVertical: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
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
    borderColor: 'rgba(148, 163, 184, 0.5)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: Math.max(16, width * 0.04),
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  disabledOption: {
    opacity: 0.7,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  disabledCircle: {
    backgroundColor: 'rgba(148, 163, 184, 0.5)',
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  disabledOptionText: {
    color: 'rgba(148, 163, 184, 0.7)',
  },
  correctOption: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    shadowColor: '#22c55e',
    shadowOpacity: 0.3,
  },
  correctCircle: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  wrongOption: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
  },
  wrongCircle: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  correctOptionText: {
    color: '#22c55e',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default QuizOptions; 