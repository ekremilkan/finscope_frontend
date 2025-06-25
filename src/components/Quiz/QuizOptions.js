import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const QuizOptions = ({ options, selectedAnswer, onAnswerSelect }) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.selectedOption
          ]}
          onPress={() => onAnswerSelect(index)}
          activeOpacity={0.8}
        >
          <View style={styles.optionContent}>
            <View style={[
              styles.optionCircle,
              selectedAnswer === index && styles.selectedCircle
            ]}>
              {selectedAnswer === index && (
                <Icon name="check" size={16} color="#ffffff" />
              )}
            </View>
            <Text style={[
              styles.optionText,
              selectedAnswer === index && styles.selectedOptionText
            ]}>
              {option}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
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
});

export default QuizOptions; 