import React from 'react';
import { QuizCategory, QuizDifficulty, QUIZ_CATEGORIES } from '../data/quizzes';
import { Sparkles, Trophy } from 'lucide-react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  category: QuizCategory | 'mixed';
  difficulty: QuizDifficulty | 'all';
  currentScore?: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  category,
  difficulty,
  currentScore = 0
}) => {
  const currentNum = Math.min(currentIndex + 1, totalQuestions);
  const percentage = totalQuestions > 0 ? Math.round((currentNum / totalQuestions) * 100) : 0;

  const categoryInfo = category !== 'mixed' 
    ? QUIZ_CATEGORIES.find(c => c.id === category)
    : null;

  return (
    <div className="w-full bg-white border border-[#E8E1D5] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Top info row */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono-code font-bold text-sm text-[#8C4A2F]">
            Question {currentNum} of {totalQuestions}
          </span>
          <span className="text-[#A8A29E]">•</span>
          <span className="font-medium text-[#57534E]">
            {categoryInfo ? categoryInfo.name : 'Mixed Assessment'}
            {categoryInfo && (
              <span className="font-devanagari text-[#8C4A2F] ml-1.5 font-bold">
                ({categoryInfo.devanagari})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {difficulty !== 'all' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono-code uppercase font-semibold bg-[#FAF8F4] border border-[#E8E1D5] text-[#78716C]">
              {difficulty}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] font-mono-code font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] text-[#8C4A2F]">
            <Trophy className="w-3 h-3 text-[#8C4A2F]" />
            <span>Score: {currentScore}</span>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#F2EDE2] h-2.5 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-[#8C4A2F] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentNum}
          aria-valuemin={1}
          aria-valuemax={totalQuestions}
          aria-label={`Question ${currentNum} of ${totalQuestions}`}
        />
      </div>

      {/* Subtle percentage helper */}
      <div className="flex justify-between items-center text-[11px] text-[#A8A29E] font-mono-code">
        <span>Progress: {percentage}%</span>
        <span>{totalQuestions - currentNum} remaining</span>
      </div>
    </div>
  );
};
