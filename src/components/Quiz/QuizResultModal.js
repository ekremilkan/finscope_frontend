import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
import { isQuizPassed, formatTime } from '../../utils/quizUtils';

const { width } = Dimensions.get('window');

const QuizResultModal = ({ 
  visible, 
  score, 
  campaignTitle, 
  reward, 
  onRetry, 
  onHome,
  passPercentage = 100,
  timeSpent = 0
}) => {
  const passed = isQuizPassed(score, passPercentage);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
          style={styles.resultModal}
        >
          <View style={styles.resultHeader}>
            <LinearGradient
              colors={[COLORS.PRIMARY + '20', COLORS.PRIMARY + '10']}
              style={styles.headerGradient}
            >
              <Icon 
                name={passed ? "celebration" : "quiz"} 
                size={48} 
                color={COLORS.PRIMARY} 
              />
            </LinearGradient>
            <Text style={styles.resultTitle}>Quiz Completed! 🎉</Text>
            <Text style={styles.resultSubtitle}>{campaignTitle}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <LinearGradient
              colors={passed ? [COLORS.SUCCESS + '20', COLORS.SUCCESS + '10'] : [COLORS.ERROR + '20', COLORS.ERROR + '10']}
              style={styles.scoreCircle}
            >
              <Text style={styles.scorePercentage}>{score.percentage}%</Text>
              <Text style={styles.scoreText}>
                {score.correct}/{score.total} Correct
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.timeContainer}>
            <LinearGradient
              colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
              style={styles.timeGradient}
            >
              <Icon name="timer" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.timeText}>Time Spent: {formatTime(timeSpent)}</Text>
            </LinearGradient>
          </View>

          <View style={styles.rewardContainer}>
            {passed ? (
              <>
                <LinearGradient
                  colors={[COLORS.SUCCESS + '20', COLORS.SUCCESS + '10']}
                  style={styles.successGradient}
                >
                  <Icon name="verified" size={48} color={COLORS.SUCCESS} />
                  <Text style={styles.successText}>Congratulations! You earned your reward</Text>
                  <Text style={styles.rewardAmount}>+{reward} USDT</Text>
                </LinearGradient>
              </>
            ) : (
              <>
                <LinearGradient
                  colors={[COLORS.ERROR + '20', COLORS.ERROR + '10']}
                  style={styles.failGradient}
                >
                  <Icon name="cancel" size={48} color={COLORS.ERROR} />
                  <Text style={styles.failText}>Failed! All questions must be answered correctly</Text>
                  <Text style={styles.tryAgainText}>You can try again</Text>
                </LinearGradient>
              </>
            )}
          </View>

          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={onHome}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.PRIMARY, COLORS.PRIMARY]}
                style={styles.homeButtonGradient}
              >
                <Icon name="home" size={20} color={COLORS.TEXT_PRIMARY} />
                <Text style={styles.resultButtonText}>Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  resultModal: {
    borderRadius: Math.max(24, width * 0.06),
    padding: Math.max(24, width * 0.06),
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerGradient: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  resultTitle: {
    fontSize: Math.max(20, width * 0.05),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: Math.max(120, width * 0.3),
    height: Math.max(120, width * 0.3),
    borderRadius: Math.max(60, width * 0.15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scorePercentage: {
    fontSize: Math.max(24, width * 0.06),
    ...getFontFamily('BOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
  scoreText: {
    fontSize: Math.max(12, width * 0.03),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  timeContainer: {
    marginBottom: 24,
  },
  timeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('MEDIUM'),
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 8,
  },
  rewardContainer: {
    marginBottom: 24,
  },
  successGradient: {
    alignItems: 'center',
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.SUCCESS,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.SUCCESS,
    textAlign: 'center',
    marginTop: 12,
  },
  rewardAmount: {
    fontSize: Math.max(20, width * 0.05),
    ...getFontFamily('BOLD'),
    color: COLORS.SUCCESS,
    marginTop: 8,
  },
  failGradient: {
    alignItems: 'center',
    padding: Math.max(20, width * 0.05),
    borderRadius: Math.max(16, width * 0.04),
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  failText: {
    fontSize: Math.max(16, width * 0.04),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.ERROR,
    textAlign: 'center',
    marginTop: 12,
  },
  tryAgainText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 8,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resultButton: {
    borderRadius: Math.max(12, width * 0.03),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.BORDER_PRIMARY,
    shadowColor: COLORS.SHADOW_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  homeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, width * 0.03),
    paddingHorizontal: Math.max(24, width * 0.06),
    borderRadius: Math.max(12, width * 0.03),
    gap: 8,
  },
  resultButtonText: {
    fontSize: Math.max(14, width * 0.035),
    ...getFontFamily('SEMIBOLD'),
    color: COLORS.TEXT_PRIMARY,
  },
});

export default QuizResultModal; 