import { Alert } from 'react-native';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  API: 'API',
  VALIDATION: 'VALIDATION',
  AUTH: 'AUTH',
  UNKNOWN: 'UNKNOWN'
};

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: {
    title: 'Network Error',
    message: 'Please check your internet connection and try again.',
    retryText: 'Retry'
  },
  [ERROR_TYPES.API]: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again.',
    retryText: 'Retry'
  },
  [ERROR_TYPES.VALIDATION]: {
    title: 'Invalid Data',
    message: 'Please check your input and try again.',
    retryText: 'OK'
  },
  [ERROR_TYPES.AUTH]: {
    title: 'Authentication Error',
    message: 'Please log in again to continue.',
    retryText: 'Login'
  },
  [ERROR_TYPES.UNKNOWN]: {
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Please try again.',
    retryText: 'Retry'
  }
};

// Error classification
export const classifyError = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;
  
  // Network errors
  if (error.code === 'NETWORK_ERROR' || 
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout')) {
    return ERROR_TYPES.NETWORK;
  }
  
  // API errors
  if (error.response) {
    const status = error.response.status;
    
    if (status === 401 || status === 403) {
      return ERROR_TYPES.AUTH;
    }
    
    if (status >= 400 && status < 500) {
      return ERROR_TYPES.VALIDATION;
    }
    
    if (status >= 500) {
      return ERROR_TYPES.API;
    }
  }
  
  return ERROR_TYPES.UNKNOWN;
};

// Show error alert
export const showErrorAlert = (error, onRetry = null) => {
  const errorType = classifyError(error);
  const errorConfig = ERROR_MESSAGES[errorType];
  
  const buttons = [
    {
      text: errorConfig.retryText,
      onPress: onRetry || (() => {})
    }
  ];
  
  Alert.alert(
    errorConfig.title,
    errorConfig.message,
    buttons,
    { cancelable: true }
  );
};

// Handle API errors
export const handleApiError = (error, context = '') => {
  console.error(`❌ API Error${context ? ` (${context})` : ''}:`, error);
  
  const errorType = classifyError(error);
  
  // Log detailed error for debugging
  if (__DEV__) {
    console.group('🔍 Error Details');
    console.log('Error Type:', errorType);
    console.log('Error Object:', error);
    console.log('Response:', error.response);
    console.log('Request:', error.request);
    console.groupEnd();
  }
  
  return {
    type: errorType,
    message: ERROR_MESSAGES[errorType].message,
    title: ERROR_MESSAGES[errorType].title,
    retryText: ERROR_MESSAGES[errorType].retryText
  };
};

// Retry mechanism
export const createRetryHandler = (operation, maxRetries = 3) => {
  let retryCount = 0;
  
  return async (...args) => {
    while (retryCount < maxRetries) {
      try {
        return await operation(...args);
      } catch (error) {
        retryCount++;
        console.log(`🔄 Retry attempt ${retryCount}/${maxRetries}`);
        
        if (retryCount >= maxRetries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
      }
    }
  };
};

// Network status check
export const checkNetworkStatus = async () => {
  try {
    // Simple network check
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      timeout: 5000 
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Error boundary helper
export const withErrorBoundary = (Component, fallback = null) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('🚨 Error Boundary Caught Error:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return fallback || (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Something went wrong. Please restart the app.</Text>
          </View>
        );
      }
      
      return <Component {...this.props} />;
    }
  };
}; 