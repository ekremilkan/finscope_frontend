import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const QuizPenaltyModal = ({ 
  visible, 
  penaltyTime, 
  onPenaltyComplete 
}) => {
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Start scale animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8
      }).start();
    } else {
      // Reset animation
      scaleAnim.setValue(0);
    }
  }, [visible]);

  // Auto-close when penalty time reaches 0
  useEffect(() => {
    if (visible && penaltyTime <= 0) {
      onPenaltyComplete();
    }
  }, [visible, penaltyTime, onPenaltyComplete]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.penaltyModal,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.penaltyIcon}>
            <Icon name="warning" size={64} color="#ef4444" />
          </View>
          
          <Text style={styles.penaltyTitle}>Wrong Answer!</Text>
          <Text style={styles.penaltySubtitle}>
            You need to wait before trying again
          </Text>
          
          <View style={styles.countdownContainer}>
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{penaltyTime}</Text>
              <Text style={styles.countdownLabel}>seconds</Text>
            </View>
          </View>
          
          <View style={styles.penaltyInfo}>
            <Icon name="info" size={20} color="#f59e0b" />
            <Text style={styles.penaltyInfoText}>
              Take your time to read the question carefully
            </Text>
          </View>
        </Animated.View>
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
  penaltyModal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 24,
    padding: Math.max(32, width * 0.08),
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    alignItems: 'center',
  },
  penaltyIcon: {
    marginBottom: 24,
  },
  penaltyTitle: {
    fontSize: Math.max(24, width * 0.06),
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  penaltySubtitle: {
    fontSize: Math.max(16, width * 0.04),
    color: 'rgba(148, 163, 184, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  countdownCircle: {
    width: Math.max(120, width * 0.3),
    height: Math.max(120, width * 0.3),
    borderRadius: Math.max(60, width * 0.15),
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 3,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: Math.max(36, width * 0.09),
    fontWeight: '700',
    color: '#ef4444',
  },
  countdownLabel: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(148, 163, 184, 0.8)',
    marginTop: 4,
  },
  penaltyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  penaltyInfoText: {
    fontSize: Math.max(14, width * 0.035),
    color: '#f59e0b',
    marginLeft: 8,
    flex: 1,
    textAlign: 'center',
  },
});

export default QuizPenaltyModal; 