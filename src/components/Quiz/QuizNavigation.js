import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
  BLACK_TEXT_ON_PRIMARY: '#181818',
};

const QuizNavigation = ({ isLastQuestion, onNext, disabled }) => {
  return (
    <View style={styles.navigationContainer}>
      <TouchableOpacity
        style={[
          styles.nextButton,
          disabled && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.nextButtonText, disabled && styles.disabledText]}>
          {isLastQuestion ? 'Finish' : 'Next'}
        </Text>
        <Icon 
          name={isLastQuestion ? "check-circle" : "arrow-forward"} 
          size={22} 
          color={disabled ? COLORS.TEXT_SECONDARY : COLORS.BLACK_TEXT_ON_PRIMARY} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    padding: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: COLORS.CARD_BACKGROUND,
    backgroundColor: COLORS.BACKGROUND
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
  },
  disabledButton: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.BLACK_TEXT_ON_PRIMARY,
    marginRight: 8,
  },
  disabledText: {
    color: COLORS.TEXT_SECONDARY,
  }
});

export default QuizNavigation;