import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatTime, getTimeWarningColor } from '../../utils/quizUtils';
import { getFontFamily } from '../../constants/fontConstants';
import { COLORS } from '../../constants/colorConstants';

const { width } = Dimensions.get('window');

const QuizHeader = ({ campaignTitle, reward, timeLeft, onExit, penaltyTime }) => {
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
        <Text style={styles.rewardText}>💰 {reward} USDT Reward</Text>
      </View>

      <View style={styles.timerSection}>
        {penaltyTime !== null && penaltyTime > 0 && (
          <View style={[styles.penaltyContainer, { borderColor: '#ef4444' }]}>
            <Icon name="warning" size={20} color="#ef4444" />
            <Text style={[styles.penaltyText, { color: '#ef4444' }]}>
              {penaltyTime}s
            </Text>
          </View>
        )}
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
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
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
  logoContainer: {
    width: Math.max(28, width * 0.07),
    height: Math.max(28, width * 0.07),
    marginBottom: Math.max(6, width * 0.015),
    borderRadius: Math.max(5, width * 0.012),
    backgroundColor: 'rgba(247, 214, 72, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 214, 72, 0.2)',
  },
  logo: {
    width: Math.max(20, width * 0.05),
    height: Math.max(20, width * 0.05),
  },
  campaignTitle: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SUCCESS,
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
    ...getFontFamily('BOLD'),
    marginLeft: 4,
  },
  timerSection: {
    marginTop: 8,
  },
  penaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  penaltyText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('SEMIBOLD'),
    marginLeft: 4,
  },
});

export default QuizHeader; 