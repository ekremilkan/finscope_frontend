import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isQuizPassed } from '../../utils/quizUtils';

const { width } = Dimensions.get('window');

const QuizResultModal = ({ 
  visible, 
  score, 
  campaignTitle, 
  reward, 
  onRetry, 
  onHome,
  passPercentage = 70
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
        <View style={styles.resultModal}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Quiz Completed! 🎉</Text>
            <Text style={styles.resultSubtitle}>{campaignTitle}</Text>
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scorePercentage}>{score.percentage}%</Text>
              <Text style={styles.scoreText}>
                {score.correct}/{score.total} Correct
              </Text>
            </View>
          </View>

          <View style={styles.rewardContainer}>
            {passed ? (
              <>
                <Icon name="verified" size={48} color="#10b981" />
                <Text style={styles.successText}>Congratulations! You earned your reward</Text>
                <Text style={styles.rewardAmount}>+{reward} USDT</Text>
              </>
            ) : (
              <>
                <Icon name="cancel" size={48} color="#ef4444" />
                <Text style={styles.failText}>Failed! At least {passPercentage}% score required</Text>
                <Text style={styles.tryAgainText}>You can try again</Text>
              </>
            )}
          </View>

          <View style={styles.resultButtons}>
            {!passed && (
              <TouchableOpacity
                style={[styles.resultButton, styles.retryButton]}
                onPress={onRetry}
              >
                <Icon name="refresh" size={20} color="#ffffff" />
                <Text style={styles.resultButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.resultButton, styles.homeButton]}
              onPress={onHome}
            >
              <Icon name="home" size={20} color="#ffffff" />
              <Text style={styles.resultButtonText}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 24,
    padding: Math.max(24, width * 0.06),
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.8)',
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
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 3,
    borderColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: Math.max(24, width * 0.06),
    fontWeight: '700',
    color: '#ffffff',
  },
  scoreText: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    marginTop: 4,
  },
  rewardContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    marginTop: 12,
  },
  rewardAmount: {
    fontSize: Math.max(20, width * 0.05),
    fontWeight: '700',
    color: '#10b981',
    marginTop: 8,
  },
  failText: {
    fontSize: Math.max(16, width * 0.04),
    fontWeight: '600',
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 12,
  },
  tryAgainText: {
    fontSize: Math.max(14, width * 0.035),
    color: 'rgba(148, 163, 184, 0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, width * 0.03),
    borderRadius: 12,
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#f59e0b',
  },
  homeButton: {
    backgroundColor: '#6366f1',
  },
  resultButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default QuizResultModal; 