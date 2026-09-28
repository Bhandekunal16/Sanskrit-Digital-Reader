import React, { useState, useMemo } from 'react';
import { TranslationResultOutput, TargetLanguage } from '../lib/translation';
import { analyzeSanskritPhonology } from '../lib/phonology';
import { 
  Copy, 
  Check, 
  Volume2, 
  Sparkles, 
  Info, 
  Layers, 
  Languages, 
  BookOpen,
  ArrowRight,
  Activity,
  AlertCircle
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
  const [showPhonology, setShowPhonology] = useState(false);

  // Compute live phonology on the active translation input
  const phonology = useMemo(() => {
    if (!result || !result.sourceText) return null;
    return analyzeSanskritPhonology(result.sourceText);
  }, [result?.sourceText]);

  if (!result || !result.sourceText) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-8 text-center text-[#78716C] shadow-xs">
        <Languages className="w-8 h-8 text-[#D6CEBE] mx-auto mb-2" />
        <p className="text-sm font-medium text-[#1C1917]">No translation generated yet</p>
        <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1">
          Enter a Sanskrit sentence, multi-line verse, or words above and click "Translate" to view its dynamic Hindi, Marathi, and English translations.
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

  const getTierBadge = () => {
    switch (result.translationTier) {
      case 'exact_sentence':
        return {
          label: 'Canonical Verse Translation',
          desc: 'Exact classical literature match with human-verified translations.',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
        };
      case 'known_phrase':
        return {
          label: 'Phrase Match Translation',
          desc: 'Composed of recognized classical phrases.',
          color: 'text-blue-800 bg-blue-50 border-blue-200'
        };
      case 'partial_gloss':
        return {
          label: 'Hybrid / Lexical Gloss',
          desc: 'Combination of recognized phrases and tokenized dictionary stems.',
          color: 'text-amber-800 bg-amber-50 border-amber-200'
        };
      case 'lexical_gloss':
      default:
        return {
          label: 'Dynamic Literal / Lexical Gloss',
          desc: 'Generated dynamically from tokenized word stems & morphology engine.',
          color: 'text-[#8C4A2F] bg-[#FAF7F2] border-[#E8E1D5]'
        };
    }
  };

  const tierBadge = getTierBadge();

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden transition-all">
      
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
              Translation Result
            </span>
            <span className="text-xs text-[#A8A29E]">·</span>
            <span className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-md border ${tierBadge.color}`}>
              {tierBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPhonology(!showPhonology)}
              className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>{showPhonology ? 'Hide Phonology' : 'Show Phonology'}</span>
            </button>

            <button
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors"
            >
              {showAllLanguages ? 'Single Language View' : 'Compare 3 Languages'}
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

        {/* Source Sanskrit Row with Multi-Line support */}
        <div className="mt-4 pt-4 border-t border-[#EFE9DD]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] block mb-1">
                Source Sanskrit Input ({result.lines.length} {result.lines.length === 1 ? 'line' : 'lines'}, {result.totalWordCount} tokens)
              </span>
              <div className="font-devanagari font-bold text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line">
                {result.sourceText}
              </div>
              <div className="font-mono-code text-xs sm:text-sm text-[#8C4A2F] mt-1.5 whitespace-pre-line">
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
        
        {/* Unrecognized Words Alert if applicable */}
        {result.unknownCount > 0 && (
          <div className="p-3.5 bg-[#FFFDF5] border border-[#F0E6C8] rounded-xl text-xs text-[#855D10] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">
                Notice on Dynamic Lexical Translation
              </span>
              <p className="leading-relaxed">
                {result.unknownCount} of {result.totalWordCount} word tokens are inflected forms or outside the curated baseline dictionary. They are displayed as transliterated tokens `[token]` in the gloss without fabricated definitions.
              </p>
            </div>
          </div>
        )}

        {/* Primary Selected Language Translation Card (Preserves Lines) */}
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

            <p className={`text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line ${
              targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari font-medium'
            }`}>
              {result.translatedText}
            </p>

            <div className="text-xs text-[#78716C] mt-3 pt-2 border-t border-[#E8E1D5]/60 flex items-center justify-between">
              <span><strong>Mode:</strong> {tierBadge.desc}</span>
              {result.context && <span className="italic">{result.context}</span>}
            </div>
          </div>
        ) : (
          /* Multi-Lingual Comparative Grid */
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
              Multi-Lingual Comparative Translations (Hindi, Marathi, English)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Hindi Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                targetLanguage === 'hindi' ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-1 ring-[#8C4A2F]/20' : 'bg-[#FBF9F5] border-[#EAE3D6]'
              }`}>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-1">
                  Hindi (हिन्दी)
                </span>
                <p className="font-devanagari font-medium text-base text-[#1C1917] leading-relaxed whitespace-pre-line">
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
                <p className="font-devanagari font-medium text-base text-[#1C1917] leading-relaxed whitespace-pre-line">
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
                <p className="font-serif-editorial text-base text-[#1C1917] leading-relaxed whitespace-pre-line">
                  {result.allTranslations.english}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Live Dynamic Word-by-Word Gloss Breakdown */}
        {result.wordBreakdown && result.wordBreakdown.length > 0 && (
          <div className="pt-4 border-t border-[#F2EDE2]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E]">
                Dynamic Word-Level Lexical Gloss ({result.wordBreakdown.length} Tokens)
              </span>
              <span className="text-[11px] text-[#78716C] font-mono-code">
                Parsed from current input
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#EAE3D6] rounded-xl overflow-hidden">
                <thead className="bg-[#FAF7F2] text-[#57534E] border-b border-[#EAE3D6]">
                  <tr>
                    <th className="p-2.5 font-semibold">Sanskrit Token</th>
                    <th className="p-2.5 font-semibold">IAST</th>
                    <th className="p-2.5 font-semibold">Hindi Meaning</th>
                    <th className="p-2.5 font-semibold">Marathi Meaning</th>
                    <th className="p-2.5 font-semibold">English Meaning</th>
                    <th className="p-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE2] bg-[#FFFFFF]">
                  {result.wordBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="p-2.5 font-devanagari font-bold text-sm text-[#1C1917]">
                        {onWordClick ? (
                          <button
                            type="button"
                            onClick={() => onWordClick(row.clean || row.word)}
                            className="hover:text-[#8C4A2F] underline text-left cursor-pointer"
                            title="Inspect in Dictionary"
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
                      <td className="p-2.5">
                        {row.found ? (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                            Recognized
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono-code border border-stone-200">
                            Transliterated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Phonological Breakdown for the current input */}
        {showPhonology && phonology && (
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Live Phoneme Articulation Analysis for Current Input</span>
              </span>
              <span className="text-[11px] font-mono-code text-[#78716C]">
                {phonology.vowelCount} vowels · {phonology.consonantCount} consonants
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {phonology.phonemes.map((tok, i) => (
                <span
                  key={i}
                  className="p-1.5 bg-white border border-[#E0D8CA] rounded text-xs font-mono-code flex items-center gap-1"
                  title={`${tok.groupName}: ${tok.placeOfArticulation}`}
                >
                  <span className="font-devanagari font-bold text-[#1C1917]">{tok.grapheme}</span>
                  <span className="text-[#8C4A2F]">({tok.iast})</span>
                  <span className="text-[10px] text-[#A8A29E]">· {tok.groupName}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
