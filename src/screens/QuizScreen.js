import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Data and Utils
import { QUIZ_CONFIG } from '../data/quizData';
import { 
  calculateScore, 
  handleQuizExit, 
  loadCampaignQuestions,
  updateQuizProgress,
  submitQuizCompletion,
  getUserQuizProgress,
  getInitialQuizState,
  checkAnswer,
  startPenalty,
  formatTime,
  trackQuizCompletion,
  calculateQuizProgress,
  validateQuizCompletion,
  calculateQuizScore
} from '../utils/quizUtils';
import { handleQuizCompletion } from '../utils/navigationUtils';

// Components
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizProgress from '../components/Quiz/QuizProgress';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizOptions from '../components/Quiz/QuizOptions';
import QuizNavigation from '../components/Quiz/QuizNavigation';
import QuizResultModal from '../components/Quiz/QuizResultModal';
// import QuizPenaltyModal from '../components/Quiz/QuizPenaltyModal'; // Removed penalty modal

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation, route }) => {
  const { campaignId, campaignTitle, reward } = route.params;

  // Quiz state
  const [quizState, setQuizState] = useState(getInitialQuizState());
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.timeLimit);
  const [showResult, setShowResult] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  
  // Penalty state
  const [penaltyTime, setPenaltyTime] = useState(0);
  const [isPenaltyActive, setIsPenaltyActive] = useState(false);
  // const [showPenaltyModal, setShowPenaltyModal] = useState(false); // Removed penalty modal state
  
  // Answer feedback state
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  
  // Timer refs
  const penaltyTimerRef = useRef(null);
  const quizTimerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, [campaignId]);

  // Quiz timer
  useEffect(() => {
    if (quizState.loading || quizState.quizCompleted || isPenaltyActive) return;

    // Timer temporarily disabled
    /*
    quizTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    */

    return () => {
      if (quizTimerRef.current) {
        clearInterval(quizTimerRef.current);
      }
    };
  }, [quizState.loading, quizState.quizCompleted, isPenaltyActive]);

  // Progress bar animation
  useEffect(() => {
    if (quizState.questions.length === 0) return;
    
    Animated.timing(progress, {
      toValue: ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  const loadQuestions = async () => {
    try {
      setQuizState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('🔄 Loading questions for campaign:', campaignId);
      const questions = await loadCampaignQuestions(campaignId);
      
      const startTime = Date.now();
      startTimeRef.current = startTime; // Set start time ref
      
      setQuizState(prev => ({
        ...prev,
        questions,
        loading: false,
        startTime: startTime
      }));
      
      console.log('✅ Questions loaded successfully:', questions.length);
    } catch (error) {
      console.error('❌ Load questions error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        campaignId: campaignId
      });
      
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load questions. Please try again.'
      }));
      
      Alert.alert(
        'Error',
        `Failed to load questions: ${error.message}`,
        [
          {
            text: 'Go Back',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const handleAnswerSelect = async (optionIndex) => {
    if (isPenaltyActive) return; // Prevent selection during penalty
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = checkAnswer(currentQuestion, optionIndex);
    
    // Update selected answers
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: {
        ...prev.selectedAnswers,
        [quizState.currentQuestionIndex]: optionIndex
      }
    }));

    // Find correct answer index
    const correctIndex = currentQuestion.options.findIndex(option => option.isTrue === true);
    setCorrectAnswerIndex(correctIndex);
    setShowCorrectAnswer(true);

    if (isCorrect) {
      // Correct answer - proceed to next question after short delay
      console.log('✅ Correct answer!');
      
      // Wait 1 second to show correct answer, then proceed
      setTimeout(async () => {
        setShowCorrectAnswer(false);
        setCorrectAnswerIndex(null);
        await handleNextQuestion();
      }, 1000);
    } else {
      // Wrong answer - start penalty
      console.log('❌ Wrong answer! Starting penalty...');
      startPenaltyTimer();
    }
  };

  const startPenaltyTimer = () => {
    setIsPenaltyActive(true);
    setPenaltyTime(20); // 20 second penalty
    
    console.log('⏰ Starting 20 second penalty timer...');
    
    penaltyTimerRef.current = setInterval(() => {
      setPenaltyTime(prev => {
        console.log('⏰ Penalty time remaining:', prev - 1);
        if (prev <= 1) {
          console.log('✅ Penalty timer completed');
          setIsPenaltyActive(false);
          setShowCorrectAnswer(false); // Hide correct answer
          setCorrectAnswerIndex(null);
          if (penaltyTimerRef.current) {
            clearInterval(penaltyTimerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePenaltyComplete = () => {
    console.log('✅ Penalty completed manually');
    setIsPenaltyActive(false);
    setPenaltyTime(0);
    setShowCorrectAnswer(false);
    setCorrectAnswerIndex(null);
    if (penaltyTimerRef.current) {
      clearInterval(penaltyTimerRef.current);
    }
  };

  const handleNextQuestion = async () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      // Update progress
      try {
        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        const selectedAnswerIndex = quizState.selectedAnswers[quizState.currentQuestionIndex];
        
        // Check if answer is selected
        if (selectedAnswerIndex === undefined) {
          console.log('⚠️ No answer selected for current question, skipping progress update');
          setQuizState(prev => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }));
          return;
        }
        
        const isCorrect = checkAnswer(currentQuestion, selectedAnswerIndex);
        
        // Calculate actual time spent (since timer is disabled)
        const actualTimeSpent = quizState.startTime ? 
          Math.floor((Date.now() - quizState.startTime) / 1000) : 0;
        
        console.log('🔄 Updating progress with data:', {
          questionId: currentQuestion._id,
          selectedAnswer: selectedAnswerIndex,
          isCorrect: isCorrect,
          timeSpent: actualTimeSpent
        });
        
        await updateQuizProgress(campaignId, {
          questionId: currentQuestion._id,
          selectedAnswer: selectedAnswerIndex,
          isCorrect: isCorrect,
          timeSpent: actualTimeSpent,
          completed: false
        });
      } catch (error) {
        console.error('❌ Update progress error:', error);
      }
      
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Quiz completed
      await handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleQuizComplete = async () => {
    try {
      // Stop timers
      if (quizTimerRef.current) {
        clearInterval(quizTimerRef.current);
      }
      if (penaltyTimerRef.current) {
        clearInterval(penaltyTimerRef.current);
      }
      
      const completionTime = Date.now();
      const totalTimeSpent = startTimeRef.current ? 
        trackQuizCompletion(startTimeRef.current, completionTime) : 0;
      
      setQuizState(prev => ({
        ...prev,
        quizCompleted: true,
        completionTime: totalTimeSpent
      }));
      
      // Submit completion to backend
      const completionData = {
        totalTimeSpent,
        score: 100, // All questions must be answered correctly
        questionsAnswered: quizState.questions.length,
        totalQuestions: quizState.questions.length
      };
      
      console.log('🔄 Submitting quiz completion:', completionData);
      await submitQuizCompletion(campaignId, completionData);
      
      setShowResult(true);
    } catch (error) {
      console.error('❌ Submit completion error:', error);
      Alert.alert('Error', 'Failed to submit quiz completion');
    }
  };

  const handleRestartQuiz = () => {
    setQuizState(getInitialQuizState());
    setTimeLeft(QUIZ_CONFIG.timeLimit);
    setShowResult(false);
    setPenaltyTime(0);
    setIsPenaltyActive(false);
    // setShowPenaltyModal(false);
    progress.setValue(0);
    startTimeRef.current = null;
    loadQuestions();
  };

  const onExit = () => {
    handleQuizExit(navigation);
  };

  // Calculate score (should always be 100% if completed)
  const score = quizState.quizCompleted ? 
    { correct: quizState.questions.length, total: quizState.questions.length, percentage: 100 } :
    calculateScore(quizState.questions, quizState.selectedAnswers);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const hasSelectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex] !== undefined;

  // Loading state
  if (quizState.loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (quizState.error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{quizState.error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadQuestions}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <QuizHeader
        campaignTitle={campaignTitle}
        reward={reward}
        timeLeft={timeLeft}
        onExit={onExit}
        penaltyTime={isPenaltyActive ? penaltyTime : null}
      />
      
      <QuizProgress
        currentQuestionIndex={quizState.currentQuestionIndex}
        totalQuestions={quizState.questions.length}
        progressValue={progress}
        isPenaltyActive={isPenaltyActive}
        penaltyTime={penaltyTime}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <QuizQuestion
          questionNumber={quizState.currentQuestionIndex + 1}
          questionText={currentQuestion?.questionText || currentQuestion?.question}
        />
        
        <QuizOptions
          options={currentQuestion?.options || []}
          selectedAnswer={quizState.selectedAnswers[quizState.currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
          disabled={isPenaltyActive}
          showCorrectAnswer={showCorrectAnswer}
          correctAnswerIndex={correctAnswerIndex}
        />
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <QuizNavigation
        currentQuestionIndex={quizState.currentQuestionIndex}
        totalQuestions={quizState.questions.length}
        hasSelectedAnswer={hasSelectedAnswer}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        disabled={isPenaltyActive}
      />

      <QuizResultModal
        visible={showResult}
        score={score}
        campaignTitle={campaignTitle}
        reward={reward}
        onRetry={handleRestartQuiz}
        onHome={() => {
          // Navigate back to campaign list with updated state
          navigation.navigate('Campaigns', {
            refreshCampaigns: true,
            completedCampaignId: campaignId
          });
        }}
        passPercentage={100} // All questions must be correct
        timeSpent={quizState.completionTime}
      />

      {/* Removed QuizPenaltyModal */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0f1c',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizScreen; 