import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { EMAIL_VERIFICATION_DATA, TIMER_STATES } from '../../data/emailVerificationData';
import { formatTime } from '../../utils/emailVerificationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const EmailVerificationTimer = ({ 
  timeRemaining, 
  timerState = TIMER_STATES.ACTIVE,
  onTimerExpired 
}) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerState === TIMER_STATES.ACTIVE && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        // Timer logic is handled by parent component
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (timeRemaining <= 0 && timerState === TIMER_STATES.ACTIVE && onTimerExpired) {
        onTimerExpired();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeRemaining, timerState, onTimerExpired]);

  const getTimerStyle = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return [styles.timerContainer, styles.timerExpired];
    }
    if (timeRemaining <= 30) {
      return [styles.timerContainer, styles.timerWarning];
    }
    return [styles.timerContainer, styles.timerActive];
  };

  const getIconName = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return 'time-outline';
    }
    return 'timer-outline';
  };

  const getIconColor = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return EMAIL_VERIFICATION_DATA.colors.error;
    }
    if (timeRemaining <= 30) {
      return EMAIL_VERIFICATION_DATA.colors.warning;
    }
    return EMAIL_VERIFICATION_DATA.colors.primary;
  };

  const getTimerText = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return 'Time Expired';
    }
    return formatTime(timeRemaining);
  };

  const getTimerMessage = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return 'Verification code invalid';
    }
    if (timeRemaining <= 30) {
      return 'Code will expire soon';
    }
    return 'Time remaining';
  };

  return (
    <View style={getTimerStyle()}>
      <View style={styles.timerIcon}>
        <Ionicons 
          name={getIconName()} 
          size={Math.max(24, width * 0.06)} 
          color={getIconColor()} 
        />
      </View>
      
      <View style={styles.timerContent}>
        <Text style={[styles.timerText, { color: getIconColor() }]}>
          {getTimerText()}
        </Text>
        
        <Text style={styles.timerMessage}>
          {getTimerMessage()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EMAIL_VERIFICATION_DATA.colors.cardBackground,
    borderRadius: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    marginHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(8, width * 0.02),
    borderWidth: 1,
  },
  timerActive: {
    borderColor: `${EMAIL_VERIFICATION_DATA.colors.primary}40`,
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.primary}10`,
  },
  timerWarning: {
    borderColor: `${EMAIL_VERIFICATION_DATA.colors.warning}40`,
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.warning}10`,
  },
  timerExpired: {
    borderColor: `${EMAIL_VERIFICATION_DATA.colors.error}40`,
    backgroundColor: `${EMAIL_VERIFICATION_DATA.colors.error}10`,
  },
  timerIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(12, width * 0.03),
  },
  timerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  timerText: {
    fontSize: Math.max(18, Math.min(22, width * 0.055)),
    fontWeight: 'bold',
    marginBottom: Math.max(2, width * 0.005),
  },
  timerMessage: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    color: EMAIL_VERIFICATION_DATA.colors.textSecondary,
    opacity: 0.8,
  },
});

export default EmailVerificationTimer;