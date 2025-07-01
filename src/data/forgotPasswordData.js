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
