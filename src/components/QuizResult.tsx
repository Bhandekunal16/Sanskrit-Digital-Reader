import React, { useState } from 'react';
import { QuizQuestion, QuizCategory, QuizDifficulty, QUIZ_CATEGORIES } from '../data/quizzes';
import { getPerformanceFeedback, isAnswerCorrect } from '../lib/quiz';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  Award,
  ChevronDown,
  ChevronUp,
  LayoutGrid
} from 'lucide-react';
import { Link } from '../lib/router';

interface QuizResultProps {
  questions: QuizQuestion[];
  userAnswers: Record<string, string[]>;
  category: QuizCategory | 'mixed';
  difficulty: QuizDifficulty | 'all';
  onRestartQuiz: () => void;
  onSelectNewQuiz: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  questions,
  userAnswers,
  category,
  difficulty,
  onRestartQuiz,
  onSelectNewQuiz
}) => {
  const [showReviewList, setShowReviewList] = useState<boolean>(true);

  // Calculate results
  let correctCount = 0;
  questions.forEach(q => {
    if (isAnswerCorrect(q, userAnswers[q.id] || [])) {
      correctCount++;
    }
  });

  const totalCount = questions.length;
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const feedback = getPerformanceFeedback(percentage);

  const categoryInfo = category !== 'mixed' 
    ? QUIZ_CATEGORIES.find(c => c.id === category)
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Primary Score & Feedback Hero Card */}
      <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-6">
        
        {/* Badge & Trophy */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] shadow-2xs mx-auto">
          <Trophy className="w-8 h-8 text-[#8C4A2F]" />
        </div>

        {/* Score & Tier Announcement */}
        <div className="space-y-2">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#8C4A2F]">
            Assessment Complete · परीक्षा समाप्तिः
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-[#1C1917]">
            {feedback.headline}
          </h2>
          <p className="font-devanagari text-base sm:text-lg text-[#8C4A2F] font-semibold">
            {feedback.devanagariMessage}
          </p>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed pt-1">
            {feedback.message}
          </p>
        </div>

        {/* Metric Gauges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4 border-t border-[#F0EAE1]">
          
          <div className="p-4 bg-[#FAF8F4] border border-[#EAE2D2] rounded-2xl">
            <span className="text-[11px] font-mono-code text-[#78716C] uppercase block mb-1">
              Score
            </span>
            <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1917]">
              {correctCount} <span className="text-sm font-normal text-[#78716C]">/ {totalCount}</span>
            </span>
          </div>

          <div className="p-4 bg-[#FAF8F4] border border-[#EAE2D2] rounded-2xl">
            <span className="text-[11px] font-mono-code text-[#78716C] uppercase block mb-1">
              Accuracy
            </span>
            <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#8C4A2F]">
              {percentage}%
            </span>
          </div>

          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
            <span className="text-[11px] font-mono-code text-emerald-800 uppercase block mb-1">
              Correct
            </span>
            <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-emerald-700">
              {correctCount}
            </span>
          </div>

          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl">
            <span className="text-[11px] font-mono-code text-rose-800 uppercase block mb-1">
              Incorrect
            </span>
            <span className="font-serif-editorial text-2xl sm:text-3xl font-bold text-rose-700">
              {totalCount - correctCount}
            </span>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <button
            type="button"
            onClick={onRestartQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8C4A2F] text-white hover:bg-[#723B25] rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.98] min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Quiz</span>
          </button>

          <button
            type="button"
            onClick={onSelectNewQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2C241E] border border-[#D5CCA8] hover:bg-[#FAF8F4] rounded-xl text-sm font-semibold transition-all shadow-2xs cursor-pointer active:scale-[0.98] min-h-[46px]"
          >
            <LayoutGrid className="w-4 h-4 text-[#8C4A2F]" />
            <span>Choose Another Category</span>
          </button>

          <Link
            href="/reader"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C241E] text-white hover:bg-[#8C4A2F] rounded-xl text-sm font-semibold transition-all shadow-xs min-h-[46px]"
          >
            <BookOpen className="w-4 h-4 text-[#E2D8C6]" />
            <span>Explore Sanskrit Reader</span>
          </Link>
        </div>

      </div>

      {/* Question-by-Question Review Accordion */}
      <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
          <div>
            <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
              Detailed Answer Breakdown (उत्तर-समीक्षा)
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Review your selections alongside linguistic explanations and correct answers:
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewList(!showReviewList)}
            className="p-2 text-[#78716C] hover:text-[#1C1917] rounded-lg border border-[#E8E1D5] bg-[#FAF8F4] transition-colors cursor-pointer"
            aria-label={showReviewList ? 'Collapse review list' : 'Expand review list'}
          >
            {showReviewList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showReviewList && (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userSelected = userAnswers[q.id] || [];
              const correct = isAnswerCorrect(q, userSelected);

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border transition-all space-y-3 ${
                    correct
                      ? 'bg-[#FAFDF9] border-emerald-200'
                      : 'bg-[#FFFBFB] border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono-code font-bold shrink-0 mt-0.5 ${
                        correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        {q.questionDevanagari && (
                          <span className="font-devanagari text-lg font-bold text-[#8C4A2F] block mb-0.5">
                            {q.questionDevanagari}
                          </span>
                        )}
                        <h4 className="font-serif-editorial text-base font-semibold text-[#1C1917]">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-mono-code font-semibold">
                      {correct ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected vs Correct Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                    <div className="p-3 bg-white rounded-lg border border-[#EAE2D2]">
                      <span className="font-mono-code text-[#78716C] uppercase block mb-1">
                        Your Answer:
                      </span>
                      {userSelected.length > 0 ? (
                        <div className="space-y-1">
                          {userSelected.map(id => {
                            const opt = q.options.find(o => o.id === id);
                            return (
                              <div key={id} className="font-medium text-[#1C1917]">
                                • {opt?.text}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[#A8A29E] italic">No answer selected</span>
                      )}
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-emerald-200">
                      <span className="font-mono-code text-emerald-700 uppercase block mb-1">
                        Correct Answer:
                      </span>
                      <div className="space-y-1">
                        {q.correctAnswers.map(id => {
                          const opt = q.options.find(o => o.id === id);
                          return (
                            <div key={id} className="font-semibold text-emerald-900">
                              ✓ {opt?.text}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="text-xs text-[#57534E] leading-relaxed pt-1">
                    <strong className="text-[#1C1917]">Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
