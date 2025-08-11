export const EMAIL_VERIFICATION_DATA = {
  title: 'Email Verification',
  subtitle: 'Enter the 6-digit code sent to your email address',
  codeLength: 6,
  timerDuration: 600, // 10 minutes (seconds)
  resendCooldown: 60, // 1 minute (seconds)
  maxAttempts: 3,
  messages: {
    codeExpired: 'Verification code expired. Please request a new code.',
    invalidCode: 'Invalid code. Please check and try again.',
    maxAttemptsExceeded: 'You have exceeded the maximum number of attempts. Please request a new code.',
    codeSent: 'Verification code has been sent to your email address.',
    networkError: 'Connection error. Please try again.',
    success: 'Email verified successfully!'
  },
  placeholders: {
    codeInput: 'Verification Code'
  },
  buttons: {
    verify: 'Verify',
    resendCode: 'Resend Code',
    changeEmail: 'Change Email',
    back: 'Back'
  },
  colors: {
    primary: '#F7D648',
    secondary: '#181818',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    text: '#ffffff',
    textSecondary: '#94a3b8',
    background: '#181818',
    cardBackground: 'rgba(26, 26, 26, 0.8)',
    inputBackground: 'rgba(51, 65, 85, 0.6)',
    borderColor: 'rgba(247, 214, 72, 0.3)',
    borderActive: '#F7D648',
    glassBackground: 'rgba(26, 26, 26, 0.8)',
    glassBorder: 'rgba(148, 163, 184, 0.2)'
  }
};

export const TIMER_STATES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  STOPPED: 'stopped'
};

export const VERIFICATION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  EXPIRED: 'expired'
};
