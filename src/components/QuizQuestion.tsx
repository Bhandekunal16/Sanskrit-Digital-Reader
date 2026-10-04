import React, { useState, useEffect } from 'react';
import { QuizQuestion as QuizQuestionType, QuizOption } from '../data/quizzes';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  CheckSquare, 
  Square, 
  Circle, 
  Disc,
  Lightbulb,
  BookOpen,
  Info
} from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswerIds: string[];
  isSubmitted: boolean;
  onSelectOption: (optionId: string) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswerIds,
  isSubmitted,
  onSelectOption,
  onSubmitAnswer,
  onNextQuestion,
  isLastQuestion
}) => {
  const [showHint, setShowHint] = useState(false);

  // Reset hint visibility whenever question changes
  useEffect(() => {
    setShowHint(false);
  }, [question.id]);

  const isMultiple = question.type === 'multiple';
  const hasSelected = selectedAnswerIds.length > 0;

  // Determine overall question correctness
  const isCorrect = isSubmitted && 
    question.correctAnswers.length === selectedAnswerIds.length &&
    question.correctAnswers.every(id => selectedAnswerIds.includes(id));

  return (
    <div className="w-full bg-white border border-[#E8E1D5] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      
      {/* Question Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F0EAE1]">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-mono-code font-semibold bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6]">
            {question.category.toUpperCase()}
          </span>
          <span className="text-xs text-[#78716C] font-mono-code">
            {isMultiple 
              ? 'Select all correct answers' 
              : question.type === 'true-false'
                ? 'True or False'
                : 'Single choice'}
          </span>
        </div>

        {/* Hint Trigger Button */}
        {question.hint && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-[#78716C] hover:text-[#8C4A2F] bg-[#FAF8F4] hover:bg-[#F2ECE1] border border-[#EAE2D2] transition-colors cursor-pointer"
            aria-expanded={showHint}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${showHint ? 'text-amber-500 fill-amber-500' : 'text-[#78716C]'}`} />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>
        )}
      </div>

      {/* Expandable Hint Box */}
      {showHint && question.hint && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 animate-fadeIn">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Linguistic Hint (सङ्केतः):</span>
            <p className="leading-relaxed">{question.hint}</p>
          </div>
        </div>
      )}

      {/* Context Verse / Passage (if present) */}
      {question.questionContext && (
        <div className="p-4 sm:p-5 bg-[#FAF8F4] border border-[#EAE2D2] rounded-xl text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono-code text-[#8C4A2F] uppercase tracking-wider font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Passage Reference</span>
          </div>
          <p className="font-devanagari text-lg sm:text-xl font-bold text-[#1C1917] leading-relaxed">
            {question.questionContext}
          </p>
        </div>
      )}

      {/* Question Prompt */}
      <div className="space-y-2">
        {question.questionDevanagari && (
          <div className="font-devanagari text-2xl sm:text-3xl font-bold text-[#8C4A2F]">
            {question.questionDevanagari}
          </div>
        )}
        <h3 className="font-serif-editorial text-lg sm:text-2xl font-semibold text-[#1C1917] leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Answer Options Grid / Stack */}
      <div className="space-y-3" role="radiogroup" aria-label="Question choices">
        {question.options.map((option: QuizOption, index: number) => {
          const isSelected = selectedAnswerIds.includes(option.id);
          const isCorrectAnswer = question.correctAnswers.includes(option.id);

          let optionStyle = 'bg-[#FAF8F4] border-[#E8E1D5] hover:bg-[#F2ECE1] text-[#1C1917]';
          let icon = isMultiple ? (
            isSelected ? <CheckSquare className="w-5 h-5 text-[#8C4A2F]" /> : <Square className="w-5 h-5 text-[#A8A29E]" />
          ) : (
            isSelected ? <Disc className="w-5 h-5 text-[#8C4A2F]" /> : <Circle className="w-5 h-5 text-[#A8A29E]" />
          );

          if (!isSubmitted) {
            if (isSelected) {
              optionStyle = 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/20 text-[#1C1917] shadow-2xs';
            }
          } else {
            // Post-submission evaluation styles
            if (isCorrectAnswer) {
              optionStyle = 'bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20';
              icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = 'bg-rose-50/90 border-rose-500 text-rose-950 ring-2 ring-rose-500/20';
              icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
            } else {
              optionStyle = 'bg-[#FAF8F4]/60 border-[#E8E1D5] text-[#78716C] opacity-75';
            }
          }

          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...

          return (
            <button
              key={option.id}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelectOption(option.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-3 min-h-[56px] ${optionStyle} ${
                isSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.995]'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-white border border-[#E0D7C6] flex items-center justify-center font-mono-code text-xs font-bold text-[#57534E] shrink-0 shadow-2xs">
                  {optionLetter}
                </span>

                <div className="min-w-0">
                  <span className="text-sm sm:text-base font-medium leading-normal block">
                    {option.text}
                  </span>
                  {option.devanagari && (
                    <span className="font-devanagari font-bold text-base text-[#8C4A2F] block mt-0.5">
                      {option.devanagari}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {icon}
              </div>
            </button>
          );
        })}
      </div>

      {/* Post-submission Feedback & Grammatical Explanation */}
      {isSubmitted && (
        <div className={`p-5 rounded-xl border animate-fadeIn space-y-3 ${
          isCorrect 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-rose-50/80 border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <h4 className="font-serif-editorial text-base sm:text-lg font-bold">
              {isCorrect ? 'Correct! (सम्यक् उत्तरम्)' : 'Incorrect (अशुद्धम्)'}
            </h4>
          </div>

          <div className="text-xs sm:text-sm leading-relaxed space-y-1.5 pl-7 text-[#2C241E]">
            <p><strong>Explanation:</strong> {question.explanation}</p>
            {question.explanationDevanagari && (
              <p className="font-devanagari text-xs text-[#8C4A2F]">
                {question.explanationDevanagari}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Footer (Submit / Next) */}
      <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-[#78716C] font-mono-code">
          {isSubmitted ? (
            <span>Answer locked. Click below to continue.</span>
          ) : (
            <span>{isMultiple ? 'Choose all applicable options before submitting.' : 'Select an option to proceed.'}</span>
          )}
        </div>

        <div>
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!hasSelected}
              onClick={onSubmitAnswer}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all min-h-[44px] ${
                hasSelected
                  ? 'bg-[#8C4A2F] text-white hover:bg-[#723B25] shadow-xs cursor-pointer active:scale-[0.98]'
                  : 'bg-[#EAE2D2] text-[#A8A29E] cursor-not-allowed'
              }`}
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNextQuestion}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#2C241E] hover:bg-[#8C4A2F] text-white font-medium text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98] min-h-[44px]"
            >
              <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4 text-[#E2D8C6]" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
