import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Utils
import { checkAnswer } from '../utils/quizUtils';

// Components
import QuizHeader from '../components/Quiz/QuizHeader';
import QuizProgress from '../components/Quiz/QuizProgress';
import QuizQuestion from '../components/Quiz/QuizQuestion';
import QuizOptions from '../components/Quiz/QuizOptions';
import QuizResultModal from '../components/Quiz/QuizResultModal';

// Constants
const COLORS = {
  BACKGROUND: '#181818',
  PRIMARY: '#F7D648',
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#A9A9A9',
  CARD_BACKGROUND: '#2A2A2A',
  BORDER: 'rgba(247, 214, 72, 0.2)',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
};

const QuizScreen = ({ navigation, route }) => {
  const { campaignId, campaignTitle, reward } = route.params;

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showResult, setShowResult] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState(null);
  const [isPenaltyActive, setIsPenaltyActive] = useState(false);
  const [penaltyTime, setPenaltyTime] = useState(0);

  const penaltyTimerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (showResult || loading) {
        return;
      }
      e.preventDefault();

      Alert.alert(
        "Exit Quiz", // Başlık
        "Your current progress will be lost. Are you sure you want to exit?", // Mesaj
        [
          { text: "Cancel", style: 'cancel', onPress: () => {} },
          {
            text: "Exit",
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, showResult, loading]);


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = [
          { _id: 'q1', question: 'Finansal okuryazarlıkta ilk adım nedir?', options: [{_id: 'q1o1', text: 'Bütçe yapmak', isTrue: true}, {_id: 'q1o2', text: 'Hisse senedi almak'}, {_id: 'q1o3', text: 'Kredi çekmek'},{_id: 'q1o4', text: 'Döviz almak'}] },
          { _id: 'q2', question: 'Hangisi bir "sabit gider" örneğidir?', options: [{_id: 'q2o1', text: 'Restoran harcaması'}, {_id: 'q2o2', text: 'Kira', isTrue: true}, {_id: 'q2o3', text: 'Sinema bileti'},{_id: 'q2o4', text: 'Giyim alışverişi'}] },
          { _id: 'q3', question: 'Enflasyonun tanımı nedir?', options: [{_id: 'q3o1', text: 'Paranın değer kazanması'}, {_id: 'q3o2', text: 'Fiyatlar genel düzeyinin düşmesi'}, {_id: 'q3o3', text: 'Fiyatlar genel düzeyinin sürekli artması', isTrue: true},{_id: 'q3o4', text: 'Faiz oranlarının artması'}] },
          { _id: 'q4', question: '"Ayı Piyasası" (Bear Market) ne anlama gelir?', options: [{_id: 'q4o1', text: 'Piyasaların yükseliş trendinde olması'}, {_id: 'q4o2', text: 'Piyasaların kararsız olması'}, {_id: 'q4o3', text: 'Altın fiyatlarının artması'},{_id: 'q4o4', text: 'Piyasaların düşüş trendinde olması', isTrue: true}] },
          { _id: 'q5', question: 'Portföy çeşitlendirmesi neden önemlidir?', options: [{_id: 'q5o1', text: 'Tek bir varlığa odaklanmak için'}, {_id: 'q5o2', text: 'Riski dağıtmak için', isTrue: true}, {_id: 'q5o3', text: 'Daha hızlı kar etmek için'},{_id: 'q5o4', text: 'Vergiden kaçınmak için'}] },
          { _id: 'q6', question: 'Kredi notunu en çok ne etkiler?', options: [{_id: 'q6o1', text: 'Yaş'}, {_id: 'q6o2', text: 'Aylık gelir'}, {_id: 'q6o3', text: 'Borçların düzenli ödenmesi', isTrue: true},{_id: 'q6o4', text: 'Medeni durum'}] },
          { _id: 'q7', question: 'Hangisi bir pasif gelir kaynağı değildir?', options: [{_id: 'q7o1', text: 'Maaşlı bir işte çalışmak', isTrue: true}, {_id: 'q7o2', text: 'Temettü (hisse kar payı)'}, {_id: 'q7o3', text: 'Kira geliri'},{_id: 'q7o4', text: 'Faiz geliri'}] }
        ];
        setTimeout(() => { setQuestions(fetchedQuestions); setLoading(false); }, 500);
      } catch (e) { setError('An error occurred while loading questions.'); setLoading(false); }
    };
    fetchQuestions();
    return () => { if (penaltyTimerRef.current) clearInterval(penaltyTimerRef.current); };
  }, [campaignId]);

  useEffect(() => {
    if (questions.length === 0) return;
    Animated.timing(progress, {
      toValue: ((currentQuestionIndex + 1) / questions.length) * 100,
      useNativeDriver: false,
      duration: 300,
    }).start();
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelect = (optionIndex) => {
    if (isPenaltyActive || showAnswerFeedback) return;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = checkAnswer(currentQuestion, optionIndex);
    setFeedbackIndex(optionIndex);
    setShowAnswerFeedback(true);
    if (isCorrect) {
      setTimeout(() => proceedToNextStep(), 1200);
    } else {
      setTimeout(() => {
        setShowAnswerFeedback(false);
        setFeedbackIndex(null);
        startPenaltyTimer();
      }, 1200);
    }
  };
  
  const startPenaltyTimer = () => {
    setIsPenaltyActive(true);
    setPenaltyTime(20);
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

  const proceedToNextStep = () => {
    setShowAnswerFeedback(false);
    setFeedbackIndex(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };
  
  if (loading) return (<View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.PRIMARY} /></View>);
  if (error) return (<View style={styles.centerContainer}><Text style={styles.errorText}>{error}</Text></View>);
  if (questions.length === 0) return (<View style={styles.centerContainer}><Text style={styles.errorText}>No questions found.</Text></View>);

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <QuizHeader campaignTitle={campaignTitle} reward={reward} onExit={() => navigation.goBack()} />
      <QuizProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        progressValue={progress}
        isPenaltyActive={isPenaltyActive}
        penaltyTime={penaltyTime}
      />
      <View style={styles.content}>
        <QuizQuestion questionNumber={currentQuestionIndex + 1} questionText={currentQuestion?.question} />
        <QuizOptions
          options={currentQuestion?.options || []}
          onAnswerSelect={handleAnswerSelect}
          disabled={isPenaltyActive || showAnswerFeedback}
          showAnswerFeedback={showAnswerFeedback}
          feedbackIndex={feedbackIndex}
        />
      </View>
      <QuizResultModal
        visible={showResult}
        score={{ correct: questions.length, total: questions.length, percentage: 100 }}
        campaignTitle={campaignTitle}
        reward={reward}
        onHome={() => navigation.navigate('MainTabs', { screen: 'Campaigns' })}
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