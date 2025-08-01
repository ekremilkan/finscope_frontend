import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { EMAIL_VERIFICATION_DATA, TIMER_STATES } from '../../data/emailVerificationData';
import { COLORS } from '../../constants/colorConstants';
import { getFontFamily } from '../../constants/fontConstants';
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
      return COLORS.ERROR;
    }
    if (timeRemaining <= 30) {
      return COLORS.WARNING;
    }
    return COLORS.PRIMARY;
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

  const getGradientColors = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return [`${COLORS.ERROR}20`, `${COLORS.ERROR}10`];
    }
    if (timeRemaining <= 30) {
      return [`${COLORS.WARNING}20`, `${COLORS.WARNING}10`];
    }
    return [`${COLORS.PRIMARY}20`, `${COLORS.PRIMARY}10`];
  };

  const getBorderColor = () => {
    if (timerState === TIMER_STATES.EXPIRED || timeRemaining <= 0) {
      return COLORS.ERROR;
    }
    if (timeRemaining <= 30) {
      return COLORS.WARNING;
    }
    return COLORS.PRIMARY;
  };

  return (
    <View style={getTimerStyle()}>
      <LinearGradient
        colors={getGradientColors()}
        style={[styles.timerGradient, { borderColor: getBorderColor() }]}
      >
        <View style={styles.timerIcon}>
          <LinearGradient
            colors={[COLORS.GLASS_BACKGROUND, COLORS.GLASS_BACKGROUND]}
            style={styles.iconGradient}
          >
            <Ionicons 
              name={getIconName()} 
              size={Math.max(24, width * 0.06)} 
              color={getIconColor()} 
            />
          </LinearGradient>
        </View>
        
        <View style={styles.timerContent}>
          <Text style={[styles.timerText, { color: getIconColor() }]}>
            {getTimerText()}
          </Text>
          
          <Text style={styles.timerMessage}>
            {getTimerMessage()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  timerContainer: {
    marginHorizontal: Math.max(16, width * 0.04),
    marginVertical: Math.max(8, width * 0.02),
    borderRadius: Math.max(16, width * 0.04),
    overflow: 'hidden',
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Math.max(16, width * 0.04),
    paddingHorizontal: Math.max(16, width * 0.04),
    paddingVertical: Math.max(12, width * 0.03),
    borderWidth: 1,
  },
  timerActive: {
    // Gradient already applied
  },
  timerWarning: {
    // Gradient already applied
  },
  timerExpired: {
    // Gradient already applied
  },
  timerIcon: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    overflow: 'hidden',
    marginRight: Math.max(12, width * 0.03),
    borderWidth: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    shadowColor: COLORS.SHADOW_SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  timerText: {
    fontSize: Math.max(18, Math.min(22, width * 0.055)),
    ...getFontFamily('BOLD'),
    marginBottom: Math.max(2, width * 0.005),
  },
  timerMessage: {
    fontSize: Math.max(12, Math.min(14, width * 0.035)),
    ...getFontFamily('REGULAR'),
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.8,
  },
});

export default EmailVerificationTimer;