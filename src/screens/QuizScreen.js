import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data and Utils
import { QUIZ_QUESTIONS, QUIZ_CONFIG } from '../data/quizData';
import { calculateScore, handleQuizExit } from '../utils/quizUtils';

// Components
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizProgress from '../components/Quiz/QuizProgress';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizOptions from '../components/Quiz/QuizOptions';
import QuizNavigation from '../components/Quiz/QuizNavigation';
import QuizResultModal from '../components/Quiz/QuizResultModal';

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation, route }) => {
  const { campaign, campaignId, campaignTitle, reward } = route.params;

  const [questions] = useState(QUIZ_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.defaultTime);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && !quizCompleted) {
        setTimeLeft(prev => prev - 1);
      } else if (timeLeft === 0) {
        handleQuizComplete();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizCompleted]);

  useEffect(() => {
    // Progress bar animasyonu
    Animated.timing(progress, {
      toValue: ((currentQuestionIndex + 1) / questions.length) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setShowResult(true);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(QUIZ_CONFIG.defaultTime);
    setShowResult(false);
    setQuizCompleted(false);
    progress.setValue(0);
  };

  const onExit = () => {
    handleQuizExit(navigation);
  };

  const score = calculateScore(questions, selectedAnswers);
  const currentQuestion = questions[currentQuestionIndex];
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <QuizHeader
        campaignTitle={campaignTitle}
        reward={reward}
        timeLeft={timeLeft}
        onExit={onExit}
      />
      
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        progressValue={progress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuizQuestion
          questionNumber={currentQuestionIndex + 1}
          questionText={currentQuestion.question}
        />
        
        <QuizOptions
          options={currentQuestion.options}
          selectedAnswer={selectedAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <QuizNavigation
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        hasSelectedAnswer={hasSelectedAnswer}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
      />

      <QuizResultModal
        visible={showResult}
        score={score}
        campaignTitle={campaignTitle}
        reward={reward}
        onRetry={handleRestartQuiz}
        onHome={() => navigation.goBack()}
        passPercentage={QUIZ_CONFIG.passPercentage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  content: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default QuizScreen; 