import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ActivityIndicator, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Servisler ve Utility Fonksiyonları
import campaignService from '../services/campaignService';
import { loadCampaignQuestions } from '../utils/quizUtils';

// Bileşenler
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizProgress from '../components/Quiz/QuizProgress';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizOptions from '../components/Quiz/QuizOptions';
import QuizResultModal from '../components/Quiz/QuizResultModal';
import QuizNavigation from '../components/Quiz/QuizNavigation';

const COLORS = {
  BACKGROUND: '#181818',
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9AA',
  CARD_BACKGROUND: '#2A2A2A',
};

const QuizScreen = ({ navigation, route }) => {
  const { campaignId, campaignTitle, reward, startIndex = 0 } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showResult, setShowResult] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isPenaltyActive, setIsPenaltyActive] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0);

  // ✅ DEĞİŞİKLİK 1: Harcanan süreyi tutmak için state ve ref eklendi
  const [timeSpent, setTimeSpent] = useState(0);
  const timerIntervalRef = useRef(null);

  const penaltyTimerRef = useRef(null);

  useEffect(() => {
    // ✅ DEĞİŞİKLİK 2: Quiz başladığında sayacı başlat
    timerIntervalRef.current = setInterval(() => {
      setTimeSpent(prevTime => prevTime + 1);
    }, 1000);

    const fetchQuestions = async () => {
      if (!campaignId) {
        setError('Campaign ID not found.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setCurrentQuestionIndex(startIndex); 
        const fetchedQuestions = await loadCampaignQuestions(campaignId);
        
        if (fetchedQuestions && fetchedQuestions.length > 0) {
          setQuestions(fetchedQuestions);
          setError(null);
        } else {
          setError('This campaign has no questions.');
        }
      } catch (e) { 
        console.error("Failed to load questions from API:", e);
        setError('An error occurred while loading questions.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    // Ekrandan çıkıldığında sayaçları temizle
    return () => { 
      if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [campaignId, startIndex]);

  useEffect(() => {
    if (!questions || questions.length === 0) return;
    Animated.timing(progress, {
      toValue: ((currentQuestionIndex + 1) / questions.length) * 100,
      useNativeDriver: false,
      duration: 300,
    }).start();
  }, [currentQuestionIndex, questions, progress]);

  const handleAnswerSelect = (optionIndex) => {
    if (showAnswerFeedback || isPenaltyActive) return;
    setSelectedOptionIndex(optionIndex);
  };

  const handleNextPress = () => {
    if (selectedOptionIndex === null) return;
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[selectedOptionIndex];
    const isCorrect = selectedOption && selectedOption.isTrue === true;

    setShowAnswerFeedback(true);
    if (isCorrect) {
      setTimeout(() => proceedToNextStep(), 1000);
    } else {
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setSelectedOptionIndex(null);
        startPenaltyTimer(20);
      }, 1500);
    }
  };
  
  const startPenaltyTimer = (duration) => {
    if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current);
    setIsPenaltyActive(true);
    setPenaltyTime(duration);
    penaltyTimerRef.current = setInterval(() => {
      setPenaltyTime(prev => {
        if (prev <= 1) {
          clearInterval(penaltyTimerRef.current);
          setIsPenaltyActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleQuizCompletion = async () => {
    // ✅ DEĞİŞİKLİK 3: Sayacı durdur ve backend'in beklediği tüm verileri gönder
    clearInterval(timerIntervalRef.current);
    try {
      const completionData = {
        score: 100,
        totalQuestions: questions.length,
        questionsAnswered: questions.length, // Tüm sorular cevaplandı
        totalTimeSpent: timeSpent, // Harcanan toplam süre
      };
      
      await campaignService.completeQuiz(campaignId, completionData);
      console.log(`✅ Campaign ${campaignId} başarıyla tamamlandı.`);
    } catch (err) {
      console.error("Quiz tamamlama durumu sunucuya gönderilirken hata oluştu:", err);
      Alert.alert("Error", `Could not save completion: ${err.message}`);
    }
  };

  const proceedToNextStep = async () => {
    setShowAnswerFeedback(false);
    setSelectedOptionIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      await handleQuizCompletion();
      setShowResult(true);
    }
  };

  const handleGoHome = async () => {
      try {
          await AsyncStorage.removeItem(`quiz_progress_${campaignId}`);
      } catch (e) {
          console.error("Failed to clear progress on quiz completion.", e);
      }
      navigation.navigate('MainTabs', { screen: 'Campaigns' });
  };

  const handleExit = () => {
    Alert.alert(
        "Exit Quiz",
        "Are you sure you want to exit? Your progress will be reset.",
        [
            { text: "Cancel", style: 'cancel' },
            { text: "Exit", style: 'destructive', onPress: () => navigation.goBack() }
        ]
    );
  };
  
  if (loading) return (<View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.PRIMARY} /></View>);
  if (error) return (<View style={styles.centerContainer}><Text style={styles.errorText}>{error}</Text></View>);
  if (!questions || questions.length === 0) return (<View style={styles.centerContainer}><Text style={styles.errorText}>No questions found.</Text></View>);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <QuizHeader campaignTitle={campaignTitle} reward={reward} onExit={handleExit} />
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        progressValue={progress}
        isPenaltyActive={isPenaltyActive}
        penaltyTime={penaltyTime}
      />
      <View style={styles.content}>
        <QuizQuestion 
            questionNumber={currentQuestionIndex + 1} 
            questionText={currentQuestion?.questionText}
        />
        <QuizOptions
          options={currentQuestion?.options || []}
          onAnswerSelect={handleAnswerSelect}
          disabled={showAnswerFeedback || isPenaltyActive}
          showAnswerFeedback={showAnswerFeedback}
          selectedOptionIndex={selectedOptionIndex}
          feedbackIndex={showAnswerFeedback ? selectedOptionIndex : null}
        />
      </View>
      <QuizNavigation
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        onNext={handleNextPress}
        disabled={selectedOptionIndex === null || showAnswerFeedback || isPenaltyActive}
      />
      {/* Sonuç modalına da harcanan süreyi gönderiyoruz */}
      <QuizResultModal
        visible={showResult}
        score={{ correct: questions.length, total: questions.length, percentage: 100 }}
        campaignTitle={campaignTitle}
        reward={reward}
        onHome={handleGoHome}
        timeSpent={timeSpent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.BACKGROUND },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.BACKGROUND },
    content: { flex: 1, paddingVertical: 10 },
    errorText: { color: 'white', textAlign: 'center', fontSize: 18 }
});

export default QuizScreen;