export const FORGOT_PASSWORD_DATA = {
  title: 'Forgot Password',
  subtitle: 'Enter your email address and we will send you a password reset link.',
  emailPlaceholder: 'Enter your email address',
  sendButtonText: 'Send Reset Code',
  backToLoginText: 'Back to Login',
  successMessage: 'A password reset link has been sent to your email address.',
  emailSentTitle: 'Email Sent',
  emailSentSubtitle: 'Check your inbox and click the link we sent you.',
  resendText: 'Resend Email',
  resendTimer: 60, // seconds
  validation: {
    emailRequired: 'Email address is required',
    emailInvalid: 'Please enter a valid email address',
    emailNotFound: 'This email address was not found in our system'
  },
  resetSuccessMessage: 'Your password has been successfully reset.', // opsiyonel
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

export const FORGOT_PASSWORD_STEPS = {
  EMAIL_INPUT: 'email_input',
  VERIFY_CODE: 'verify_code',
  RESET_PASSWORD: 'reset_password',  
  LOADING: 'loading',
};

export const ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-in-out',
};
