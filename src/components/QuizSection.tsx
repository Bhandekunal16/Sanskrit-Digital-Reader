import React, { useState, useEffect, useMemo } from 'react';
import { 
  QuizCategory, 
  QuizDifficulty, 
  QuizQuestion as QuizQuestionType, 
  QUIZ_CATEGORIES, 
  QUIZ_QUESTIONS 
} from '../data/quizzes';
import { 
  filterQuestions, 
  saveQuizAttempt, 
  getQuizHistory, 
  QuizAttemptRecord,
  clearQuizHistory
} from '../lib/quiz';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { 
  GraduationCap, 
  Sparkles, 
  BookMarked, 
  Layers, 
  ArrowRightLeft, 
  Globe, 
  ScrollText, 
  Volume2, 
  Network, 
  Split as Splits, 
  Flame, 
  Play, 
  RotateCcw, 
  Clock, 
  Award, 
  CheckCircle2,
  Trash2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  BookMarked,
  Layers,
  Splits,
  Network,
  ArrowRightLeft,
  Volume2,
  Globe,
  ScrollText
};

export const QuizSection: React.FC = () => {
  // Setup configuration state
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'mixed'>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Active Quiz State
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [isCurrentSubmitted, setIsCurrentSubmitted] = useState<boolean>(false);

  // History State
  const [history, setHistory] = useState<QuizAttemptRecord[]>([]);

  useEffect(() => {
    setHistory(getQuizHistory());
  }, [isQuizCompleted]);

  // Handle starting a new quiz
  const handleStartQuiz = () => {
    const questions = filterQuestions({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      count: questionCount,
      shuffle: true
    });

    if (questions.length === 0) {
      return;
    }

    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsCurrentSubmitted(false);
    setIsQuizCompleted(false);
    setIsQuizActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle option click on active question
  const handleSelectOption = (optionId: string) => {
    if (isCurrentSubmitted) return;

    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    setUserAnswers(prev => {
      const existing = prev[currentQ.id] || [];
      if (currentQ.type === 'multiple') {
        // Toggle selection
        if (existing.includes(optionId)) {
          return { ...prev, [currentQ.id]: existing.filter(id => id !== optionId) };
        } else {
          return { ...prev, [currentQ.id]: [...existing, optionId] };
        }
      } else {
        // Single choice or True/False
        return { ...prev, [currentQ.id]: [optionId] };
      }
    });
  };

  // Handle submitting answer for feedback
  const handleSubmitAnswer = () => {
    setIsCurrentSubmitted(true);
  };

  // Handle moving to next question or ending quiz
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsCurrentSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete quiz and record attempt
      let correctCount = 0;
      activeQuestions.forEach(q => {
        const answers = userAnswers[q.id] || [];
        const isMatch = q.correctAnswers.length === answers.length &&
          q.correctAnswers.every(id => answers.includes(id));
        if (isMatch) correctCount++;
      });

      const total = activeQuestions.length;
      const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

      const catObj = selectedCategory !== 'mixed' 
        ? QUIZ_CATEGORIES.find(c => c.id === selectedCategory)
        : null;

      saveQuizAttempt({
        category: selectedCategory,
        categoryLabel: catObj ? catObj.name : 'Mixed Knowledge',
        difficulty: selectedDifficulty,
        score: correctCount,
        total,
        percentage
      });

      setIsQuizCompleted(true);
      setIsQuizActive(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate live current score
  const liveScore = useMemo(() => {
    let count = 0;
    activeQuestions.forEach((q, idx) => {
      if (idx <= currentQuestionIndex && userAnswers[q.id]) {
        const answers = userAnswers[q.id] || [];
        const isMatch = q.correctAnswers.length === answers.length &&
          q.correctAnswers.every(id => answers.includes(id));
        if (isMatch) count++;
      }
    });
    return count;
  }, [activeQuestions, currentQuestionIndex, userAnswers]);

  // Current active question
  const currentQuestion = activeQuestions[currentQuestionIndex];

  // 1. RENDER: Completed Result Screen
  if (isQuizCompleted) {
    return (
      <div className="py-6 sm:py-8 space-y-8">
        <QuizResult
          questions={activeQuestions}
          userAnswers={userAnswers}
          category={selectedCategory}
          difficulty={selectedDifficulty}
          onRestartQuiz={handleStartQuiz}
          onSelectNewQuiz={() => {
            setIsQuizCompleted(false);
            setIsQuizActive(false);
          }}
        />
      </div>
    );
  }

  // 2. RENDER: Active Quiz Question Flow
  if (isQuizActive && currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto py-6 sm:py-8 space-y-6">
        
        {/* Top Header & Abort Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#8C4A2F]" />
            <h2 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
              Sanskrit Knowledge Quiz
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit the current quiz? Progress will not be saved.')) {
                setIsQuizActive(false);
              }
            }}
            className="text-xs text-[#78716C] hover:text-[#8C4A2F] underline cursor-pointer"
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <QuizProgress
          currentIndex={currentQuestionIndex}
          totalQuestions={activeQuestions.length}
          category={selectedCategory}
          difficulty={selectedDifficulty}
          currentScore={liveScore}
        />

        {/* Current Active Question Box */}
        <QuizQuestion
          question={currentQuestion}
          selectedAnswerIds={userAnswers[currentQuestion.id] || []}
          isSubmitted={isCurrentSubmitted}
          onSelectOption={handleSelectOption}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === activeQuestions.length - 1}
        />

      </div>
    );
  }

  // 3. RENDER: Quiz Landing & Configuration Screen
  return (
    <div className="space-y-12">
      
      {/* Editorial Page Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider font-semibold text-[#8C4A2F] mb-1.5">
          <GraduationCap className="w-4 h-4" />
          <span>Interactive Assessment & Knowledge Review</span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-tight">
          Sanskrit Language Quiz (संस्कृत-ज्ञान-परीक्षा)
        </h1>
        <p className="text-base text-[#57534E] mt-3 leading-relaxed">
          Test and reinforce your understanding of Sanskrit vocabulary, grammatical paradigms, sandhi transitions, compound analysis, phonology (Śikṣā), and classical literature.
        </p>
      </div>

      {/* Quiz Configuration Panel */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* 1. Category Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-serif-editorial text-lg font-semibold text-[#1C1917] block">
              1. Choose Topic Category (विषय-चयनम्)
            </label>
            <span className="text-xs font-mono-code text-[#78716C]">
              {QUIZ_QUESTIONS.length} Available Questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            
            {/* Mixed Option */}
            <button
              type="button"
              onClick={() => setSelectedCategory('mixed')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer min-h-[92px] ${
                selectedCategory === 'mixed'
                  ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/20 shadow-xs'
                  : 'bg-[#FAF8F4] border-[#E8E1D5] hover:bg-[#F2ECE1]'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                selectedCategory === 'mixed'
                  ? 'bg-[#8C4A2F] text-white'
                  : 'bg-white text-[#8C4A2F] border border-[#E0D7C6]'
              }`}>
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-semibold text-sm text-[#1C1917]">Mixed Assessment</h4>
                  <span className="font-devanagari text-xs text-[#8C4A2F] font-bold">(मिश्रितम्)</span>
                </div>
                <p className="text-xs text-[#78716C] mt-0.5 leading-snug">
                  Comprehensive mix across vocabulary, grammar, phonology, and texts.
                </p>
              </div>
            </button>

            {/* Individual Categories */}
            {QUIZ_CATEGORIES.map(cat => {
              const Icon = ICON_MAP[cat.iconName] || BookMarked;
              const isSelected = selectedCategory === cat.id;
              const catQuestionCount = QUIZ_QUESTIONS.filter(q => q.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer min-h-[92px] ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/20 shadow-xs'
                      : 'bg-[#FAF8F4] border-[#E8E1D5] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#8C4A2F] text-white'
                      : 'bg-white text-[#8C4A2F] border border-[#E0D7C6]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <h4 className="font-semibold text-sm text-[#1C1917]">{cat.name}</h4>
                      <span className="text-[10px] font-mono-code text-[#78716C] bg-white/80 px-1.5 py-0.5 rounded border border-[#EAE2D2]">
                        {catQuestionCount}
                      </span>
                    </div>
                    <span className="font-devanagari text-xs text-[#8C4A2F] font-bold block mb-0.5">
                      {cat.devanagari}
                    </span>
                    <p className="text-xs text-[#78716C] leading-snug line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}

          </div>
        </div>

        {/* 2. Difficulty & Question Count Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#F0EAE1]">
          
          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="font-serif-editorial text-base font-semibold text-[#1C1917] block">
              2. Difficulty Level (काठिन्य-स्तरः)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Levels', devanagari: 'सर्वे' },
                { id: 'beginner', label: 'Beginner', devanagari: 'प्राथमिक' },
                { id: 'intermediate', label: 'Medium', devanagari: 'मध्यम' },
                { id: 'advanced', label: 'Advanced', devanagari: 'प्रौढ' }
              ].map(level => {
                const isSelected = selectedDifficulty === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(level.id as QuizDifficulty | 'all')}
                    className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer min-h-[50px] ${
                      isSelected
                        ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-2xs font-semibold'
                        : 'bg-[#FAF8F4] text-[#57534E] border-[#E8E1D5] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <span className="text-xs block leading-tight">{level.label}</span>
                    <span className={`font-devanagari text-[10px] block mt-0.5 ${isSelected ? 'text-[#F5EDE4]' : 'text-[#8C4A2F]'}`}>
                      {level.devanagari}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="space-y-3">
            <label className="font-serif-editorial text-base font-semibold text-[#1C1917] block">
              3. Number of Questions (प्रश्नानां सङ्ख्या)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map(count => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 px-2 rounded-xl text-center border transition-all cursor-pointer min-h-[50px] ${
                      isSelected
                        ? 'bg-[#2C241E] text-white border-[#2C241E] shadow-2xs font-bold'
                        : 'bg-[#FAF8F4] text-[#57534E] border-[#E8E1D5] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    <span className="font-mono-code text-sm block">{count}</span>
                    <span className="text-[10px] block text-[#A8A29E]">Questions</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Start Quiz Action CTA */}
        <div className="pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#78716C] leading-relaxed">
            Instant answer evaluation · Pāṇinian morphological feedback · Local progress tracking
          </div>

          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#8C4A2F] hover:bg-[#723B25] text-white font-semibold text-base rounded-xl transition-all shadow-xs cursor-pointer active:scale-[0.98] min-h-[48px]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Begin Sanskrit Quiz</span>
          </button>
        </div>

      </div>

      {/* Recent Attempts & Performance History */}
      {history.length > 0 && (
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C4A2F]" />
              <h3 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                Your Recent Quiz Attempts
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear your local quiz history?')) {
                  clearQuizHistory();
                  setHistory([]);
                }
              }}
              className="inline-flex items-center gap-1 text-xs text-[#78716C] hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.slice(0, 6).map(record => (
              <div
                key={record.id}
                className="p-3.5 bg-[#FAF8F4] border border-[#EAE2D2] rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    {record.categoryLabel}
                  </span>
                  <span className="text-[11px] text-[#78716C] font-mono-code">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-serif-editorial font-bold text-sm text-[#8C4A2F] block">
                    {record.score} / {record.total}
                  </span>
                  <span className="text-[11px] font-mono-code text-[#57534E]">
                    {record.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
