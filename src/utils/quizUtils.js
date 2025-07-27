import { Alert } from 'react-native';
import quizService from '../services/quizService';

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateScore = (questions, selectedAnswers) => {
  let correctAnswers = 0;
  questions.forEach((question, index) => {
    const selectedAnswerIndex = selectedAnswers[index];
    if (selectedAnswerIndex !== undefined) {
      const isCorrect = checkAnswer(question, selectedAnswerIndex);
      if (isCorrect) {
        correctAnswers++;
      }
    }
  });
  return {
    correct: correctAnswers,
    total: questions.length,
    percentage: Math.round((correctAnswers / questions.length) * 100)
  };
};

export const handleQuizExit = (navigation) => {
  Alert.alert(
    'Exit Quiz',
    'You will lose your progress. Are you sure you want to exit?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Exit', 
        style: 'destructive',
        onPress: () => navigation.goBack()
      }
    ]
  );
};

export const isQuizPassed = (score, passPercentage = 70) => {
  return score.percentage >= passPercentage;
};

export const getTimeWarningColor = (timeLeft, warningTime = 60) => {
  if (timeLeft <= warningTime) {
    return '#ef4444';
  }
  return '#f59e0b';
};

// New functions for enhanced quiz logic
export const checkAnswer = (question, selectedAnswerIndex) => {
  // Backend'den gelen format: options array'i, her option'da isTrue field'ı var
  if (!question.options || !Array.isArray(question.options)) {
    return false;
  }
  
  const selectedOption = question.options[selectedAnswerIndex];
  return selectedOption && selectedOption.isTrue === true;
};

export const calculatePenaltyTime = (basePenalty = 20) => {
  return basePenalty;
};

export const formatPenaltyTime = (seconds) => {
  return `${seconds}s`;
};

// API functions
export const loadCampaignQuestions = async (campaignId) => {
  try {
    console.log('🔄 Loading questions for campaign:', campaignId);
    const questions = await quizService.getCampaignQuestions(campaignId);
    return questions;
  } catch (error) {
    console.error('❌ Load questions error:', error);
    throw error;
  }
};

export const updateQuizProgress = async (campaignId, progressData) => {
  try {
    console.log('🔄 Updating quiz progress:', progressData);
    const result = await quizService.updateQuizProgress(campaignId, progressData);
    return result;
  } catch (error) {
    console.error('❌ Update progress error:', error);
    throw error;
  }
};

export const submitQuizCompletion = async (campaignId, completionData) => {
  try {
    console.log('🔄 Submitting quiz completion:', completionData);
    const result = await quizService.submitQuizCompletion(campaignId, completionData);
    return result;
  } catch (error) {
    console.error('❌ Submit completion error:', error);
    throw error;
  }
};

export const getUserQuizProgress = async (campaignId) => {
  try {
    console.log('🔄 Getting user quiz progress for campaign:', campaignId);
    const progress = await quizService.getUserQuizProgress(campaignId);
    return progress;
  } catch (error) {
    console.error('❌ Get user progress error:', error);
    throw error;
  }
};

// Quiz state management
export const getInitialQuizState = () => ({
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeSpent: 0,
  penaltyTime: 0,
  isPenaltyActive: false,
  quizCompleted: false,
  loading: true,
  error: null,
  startTime: null,
  completionTime: null
});

// Penalty management
export const startPenalty = (setPenaltyTime, setPenaltyActive, penaltyDuration = 20) => {
  setPenaltyTime(penaltyDuration);
  setPenaltyActive(true);
  
  const penaltyTimer = setInterval(() => {
    setPenaltyTime(prev => {
      if (prev <= 1) {
        setPenaltyActive(false);
        clearInterval(penaltyTimer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return penaltyTimer;
};

// Quiz completion tracking
export const trackQuizCompletion = (startTime, endTime) => {
  return Math.floor((endTime - startTime) / 1000);
};

// Quiz progress calculation
export const calculateQuizProgress = (currentQuestion, totalQuestions) => {
  return Math.round((currentQuestion / totalQuestions) * 100);
};

// Quiz validation
export const validateQuizCompletion = (questions, selectedAnswers) => {
  if (questions.length === 0) return false;
  
  const answeredQuestions = Object.keys(selectedAnswers).length;
  return answeredQuestions === questions.length;
};

// Quiz score calculation (always 100% if completed)
export const calculateQuizScore = (questions, selectedAnswers) => {
  if (questions.length === 0) return { correct: 0, total: 0, percentage: 0 };
  
  let correctAnswers = 0;
  questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });
  
  return {
    correct: correctAnswers,
    total: questions.length,
    percentage: Math.round((correctAnswers / questions.length) * 100)
  };
}; 