import { Alert } from 'react-native';

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateScore = (questions, selectedAnswers) => {
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