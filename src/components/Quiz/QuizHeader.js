import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTime, getTimeWarningColor } from '../../utils/quizUtils';

const { width } = Dimensions.get('window');

const QuizHeader = ({ campaignTitle, reward, timeLeft, onExit }) => {
  const timerColor = getTimeWarningColor(timeLeft);

  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onExit}
      >
        <Icon name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.campaignTitle} numberOfLines={1}>
          {campaignTitle}
        </Text>
        <Text style={styles.rewardText}>💰 {reward} USDT Ödül</Text>
      </View>

      <View style={[styles.timerContainer, { borderColor: `${timerColor}30` }]}>
        <Icon name="timer" size={20} color={timerColor} />
        <Text style={[styles.timerText, { color: timerColor }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, width * 0.04),
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: Math.max(12, width * 0.03),
    color: '#10b981',
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  timerText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default QuizHeader; 