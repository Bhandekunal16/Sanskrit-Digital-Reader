import React, { useState } from 'react';
import { TranslationResultOutput, TargetLanguage } from '../lib/translation';
import { 
  Copy, 
  Check, 
  Volume2, 
  Sparkles, 
  Info, 
  Layers, 
  Languages, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface TranslationResultProps {
  result: TranslationResultOutput | null;
  targetLanguage: TargetLanguage;
  onLanguageChange: (lang: TargetLanguage) => void;
  onWordClick?: (word: string) => void;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({
  result,
  targetLanguage,
  onLanguageChange,
  onWordClick
}) => {
  const [copied, setCopied] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  if (!result || !result.sourceText) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-8 text-center text-[#78716C] shadow-xs">
        <Languages className="w-8 h-8 text-[#D6CEBE] mx-auto mb-2" />
        <p className="text-sm font-medium text-[#1C1917]">No translation generated yet</p>
        <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1">
          Enter a Sanskrit word or sentence above and click "Translate" to view its Hindi, Marathi, and English translations.
        </p>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePronounce = (text: string, langCode: string = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getLanguageName = (lang: TargetLanguage) => {
    switch (lang) {
      case 'hindi': return 'Hindi (हिन्दी)';
      case 'marathi': return 'Marathi (मराठी)';
      case 'english': return 'English';
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden transition-all">
      
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
              Translation Result
            </span>
            <span className="text-xs text-[#A8A29E]">·</span>
            {/* Demo Translation Badge */}
            <span className="text-[11px] font-mono-code text-[#78716C] bg-[#F2ECE1] px-2 py-0.5 rounded border border-[#E0D8CA]">
              Demo Translation Engine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors"
            >
              {showAllLanguages ? 'Show Single Language' : 'Compare All 3 Languages'}
            </button>

            <button
              onClick={() => handleCopy(result.translatedText)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors shadow-2xs"
              title="Copy translation"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source Sanskrit Row */}
        <div className="mt-4 pt-4 border-t border-[#EFE9DD]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] block mb-1">
                Source Sanskrit (संस्कृतम्)
              </span>
              <div className="font-devanagari font-bold text-2xl sm:text-3xl text-[#1C1917] leading-relaxed">
                {result.sourceText}
              </div>
              <div className="font-mono-code text-sm text-[#8C4A2F] mt-1">
                {result.sourceIast}
              </div>
            </div>

            <button
              onClick={() => handlePronounce(result.sourceText, 'hi-IN')}
              className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5] shrink-0"
              title="Listen to Sanskrit pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Translation Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Primary Selected Language Translation */}
        {!showAllLanguages ? (
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                {getLanguageName(targetLanguage)} Translation
              </span>
              <button
                onClick={() => handlePronounce(result.translatedText, targetLanguage === 'english' ? 'en-US' : 'hi-IN')}
                className="p-1 text-[#78716C] hover:text-[#8C4A2F] rounded"
                title="Pronounce translation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className={`text-xl sm:text-2xl text-[#1C1917] leading-relaxed ${
              targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari font-medium'
            }`}>
              {result.translatedText}
            </p>

            {result.context && (
              <p className="text-xs text-[#78716C] mt-3 pt-2 border-t border-[#E8E1D5]/60 italic">
                <strong>Context:</strong> {result.context}
              </p>
            )}
          </div>
        ) : (
          /* Multi-Lingual Comparative Grid */
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
              Multi-Lingual Translations (Hindi, Marathi, English)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Hindi Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                targetLanguage === 'hindi' ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-1 ring-[#8C4A2F]/20' : 'bg-[#FBF9F5] border-[#EAE3D6]'
              }`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-1">
                  Hindi (हिन्दी)
                </span>
                <p className="font-devanagari font-medium text-base text-[#1C1917] leading-relaxed">
                  {result.allTranslations.hindi}
                </p>
              </div>

              {/* Marathi Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                targetLanguage === 'marathi' ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-1 ring-[#8C4A2F]/20' : 'bg-[#FBF9F5] border-[#EAE3D6]'
              }`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-1">
                  Marathi (मराठी)
                </span>
                <p className="font-devanagari font-medium text-base text-[#1C1917] leading-relaxed">
                  {result.allTranslations.marathi}
                </p>
              </div>

              {/* English Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                targetLanguage === 'english' ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-1 ring-[#8C4A2F]/20' : 'bg-[#FBF9F5] border-[#EAE3D6]'
              }`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-1">
                  English
                </span>
                <p className="font-serif-editorial text-base text-[#1C1917] leading-relaxed">
                  {result.allTranslations.english}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Word-by-Word Gloss Breakdown (if available) */}
        {result.wordBreakdown && result.wordBreakdown.length > 0 && (
          <div className="pt-4 border-t border-[#F2EDE2]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block mb-3">
              Word-Level Lexical Gloss (पदच्छेद & अनुवाद)
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#EAE3D6] rounded-xl overflow-hidden">
                <thead className="bg-[#FAF7F2] text-[#57534E] border-b border-[#EAE3D6]">
                  <tr>
                    <th className="p-2.5 font-semibold">Sanskrit</th>
                    <th className="p-2.5 font-semibold">IAST</th>
                    <th className="p-2.5 font-semibold">Hindi</th>
                    <th className="p-2.5 font-semibold">Marathi</th>
                    <th className="p-2.5 font-semibold">English</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE2] bg-[#FFFFFF]">
                  {result.wordBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="p-2.5 font-devanagari font-bold text-sm text-[#1C1917]">
                        {onWordClick ? (
                          <button
                            type="button"
                            onClick={() => onWordClick(row.word)}
                            className="hover:text-[#8C4A2F] underline text-left"
                          >
                            {row.word}
                          </button>
                        ) : (
                          row.word
                        )}
                      </td>
                      <td className="p-2.5 font-mono-code text-[#8C4A2F]">{row.iast}</td>
                      <td className="p-2.5 font-devanagari text-[#44403C]">{row.hindi}</td>
                      <td className="p-2.5 font-devanagari text-[#44403C]">{row.marathi}</td>
                      <td className="p-2.5 font-serif-editorial text-[#44403C]">{row.english}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Educational Note */}
        <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl text-xs text-[#78716C] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#8C4A2F] shrink-0 mt-0.5" />
          <p>
            <strong>Cross-Lingual Access:</strong> Demonstrating how structured digital lexical graphs facilitate instantaneous multi-lingual understanding across Indo-Aryan sister languages (Hindi, Marathi) and international academic English.
          </p>
        </div>

      </div>

    </div>
  );
};
