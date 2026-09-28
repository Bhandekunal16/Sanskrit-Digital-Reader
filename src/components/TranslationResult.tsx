import React, { useState, useMemo } from 'react';
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { TargetLanguage } from '../lib/translation';
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
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';

interface TranslationResultProps {
  onWordClick?: (word: string) => void;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({ onWordClick }) => {
  const {
    document,
    targetLanguage,
    setTargetLanguage,
    selectedTokenId,
    setSelectedTokenId,
    setSelectedTokenBySurface
  } = useSanskritWorkspace();

  const [copied, setCopied] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [showPhonology, setShowPhonology] = useState(false);

  if (!document || !document.rawText) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-8 text-center text-[#78716C] shadow-xs">
        <Languages className="w-8 h-8 text-[#D6CEBE] mx-auto mb-2" />
        <p className="text-sm font-medium text-[#1C1917]">No translation generated yet</p>
        <p className="text-xs text-[#78716C] max-w-sm mx-auto mt-1">
          Enter a Sanskrit sentence, multi-line verse, or words above and click "Translate & Analyze" to view its dynamic Hindi, Marathi, and English translations.
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
    switch (document.overallTier) {
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
          desc: 'Generated dynamically from tokenized word stems, sandhi, & morphology engine.',
          color: 'text-[#8C4A2F] bg-[#FAF7F2] border-[#E8E1D5]'
        };
    }
  };

  const tierBadge = getTierBadge();

  const activeTranslationText = 
    targetLanguage === 'hindi' 
      ? document.translations.hindi 
      : targetLanguage === 'marathi' 
      ? document.translations.marathi 
      : document.translations.english;

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden transition-all">
      
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
              Translation & Semantic Analysis
            </span>
            <span className="text-xs text-[#A8A29E]">·</span>
            <span className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-md border ${tierBadge.color}`}>
              {tierBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowPhonology(!showPhonology)}
              className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>{showPhonology ? 'Hide Phonology' : 'Show Phonology'}</span>
            </button>

            <button
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="text-xs font-medium text-[#57534E] hover:text-[#1C1917] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors cursor-pointer"
            >
              {showAllLanguages ? 'Single Language View' : 'Compare 3 Languages'}
            </button>

            <button
              onClick={() => handleCopy(activeTranslationText)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors shadow-2xs cursor-pointer"
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
                Source Sanskrit Input ({document.lines.length} {document.lines.length === 1 ? 'line' : 'lines'}, {document.totalWords} tokens)
              </span>
              <div className="font-devanagari font-bold text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line">
                {document.rawText}
              </div>
              <div className="font-mono-code text-xs sm:text-sm text-[#8C4A2F] mt-1.5 whitespace-pre-line">
                {document.lines.map(l => l.sourceIast).filter(Boolean).join('\n')}
              </div>
            </div>

            <button
              onClick={() => handlePronounce(document.rawText, 'hi-IN')}
              className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5] shrink-0 cursor-pointer"
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
        {document.unknownCount > 0 && (
          <div className="p-3.5 bg-[#FFFDF5] border border-[#F0E6C8] rounded-xl text-xs text-[#855D10] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">
                Notice on Dynamic Lexical Translation
              </span>
              <p className="leading-relaxed">
                {document.unknownCount} of {document.totalWords} word tokens are inflected forms or outside the curated baseline dictionary. They are displayed with accurate IAST transliteration and marked as <em>Not found in lexicon</em> without fabricated definitions.
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
                onClick={() => handlePronounce(activeTranslationText, targetLanguage === 'english' ? 'en-US' : 'hi-IN')}
                className="p-1 text-[#78716C] hover:text-[#8C4A2F] rounded cursor-pointer"
                title="Pronounce translation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className={`text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line ${
              targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari font-medium'
            }`}>
              {activeTranslationText}
            </p>

            <div className="text-xs text-[#78716C] mt-3 pt-2 border-t border-[#E8E1D5]/60 flex items-center justify-between flex-wrap gap-2">
              <span><strong>Mode:</strong> {tierBadge.desc}</span>
              {document.context && <span className="italic">{document.context}</span>}
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
                  {document.translations.hindi}
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
                  {document.translations.marathi}
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
                  {document.translations.english}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Live Dynamic Word-by-Word Gloss Breakdown */}
        {document.allTokens && document.allTokens.length > 0 && (
          <div className="pt-4 border-t border-[#F2EDE2]">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
                  Dynamic Word-Level Lexical Gloss ({document.allTokens.length} Tokens)
                </span>
                <span className="text-[11px] text-[#78716C]">
                  Click any Sanskrit word to select and inspect its root, phonology, and Sandhi split.
                </span>
              </div>
              <span className="text-[11px] text-[#78716C] font-mono-code bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3D6]">
                {document.recognizedCount} recognized · {document.unknownCount} outside baseline
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#EAE3D6]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#57534E] border-b border-[#EAE3D6]">
                  <tr>
                    <th className="p-3 font-semibold min-w-[120px]">Sanskrit Token</th>
                    <th className="p-3 font-semibold min-w-[100px]">IAST</th>
                    <th className="p-3 font-semibold min-w-[140px]">Hindi Meaning</th>
                    <th className="p-3 font-semibold min-w-[140px]">Marathi Meaning</th>
                    <th className="p-3 font-semibold min-w-[160px]">English Meaning</th>
                    <th className="p-3 font-semibold min-w-[120px]">Source / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE2] bg-[#FFFFFF]">
                  {document.allTokens.map((token) => {
                    const isSelected = selectedTokenId === token.id || selectedTokenId === token.clean;
                    return (
                      <tr 
                        key={token.id} 
                        className={`transition-colors ${
                          isSelected ? 'bg-[#FAF7F2] ring-1 ring-inset ring-[#8C4A2F]' : 'hover:bg-[#FAF7F2]/60'
                        }`}
                      >
                        <td className="p-3 font-devanagari font-bold text-sm text-[#1C1917]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTokenId(token.id);
                              if (onWordClick) onWordClick(token.clean || token.surface);
                            }}
                            className="hover:text-[#8C4A2F] text-left flex items-center gap-1.5 cursor-pointer group"
                            title="Inspect word morphology and phonology"
                          >
                            <span>{token.surface}</span>
                            <span className="text-[10px] text-[#8C4A2F] opacity-0 group-hover:opacity-100 transition-opacity font-mono-code">
                              inspect
                            </span>
                          </button>
                        </td>
                        <td className="p-3 font-mono-code text-[#8C4A2F]">{token.iast || '—'}</td>
                        <td className="p-3 font-devanagari text-[#44403C]">
                          {token.meanings.hindi || <span className="text-stone-400 font-mono-code">—</span>}
                        </td>
                        <td className="p-3 font-devanagari text-[#44403C]">
                          {token.meanings.marathi || <span className="text-stone-400 font-mono-code">—</span>}
                        </td>
                        <td className="p-3 font-serif-editorial text-[#44403C]">
                          {token.meanings.english || <span className="text-stone-400 font-mono-code">—</span>}
                        </td>
                        <td className="p-3">
                          {token.source === 'dictionary' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Dictionary</span>
                            </span>
                          )}
                          {token.source === 'phrase-dataset' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                              <span>Phrase Dataset</span>
                            </span>
                          )}
                          {token.source === 'sandhi_split' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-medium border border-purple-200">
                              <span>Sandhi Split</span>
                            </span>
                          )}
                          {token.source === 'morphological-gloss' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                              <span>Stem Match</span>
                            </span>
                          )}
                          {token.source === 'unavailable' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono-code border border-stone-200">
                              <span>Not found</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Phonological Breakdown for the current input */}
        {showPhonology && (
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Live Phoneme Articulation Analysis for Current Workspace</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {document.allTokens.map((tok) => {
                if (!tok.phonology) return null;
                return (
                  <div key={tok.id} className="p-2 bg-white border border-[#E0D8CA] rounded-lg space-y-1">
                    <span className="text-xs font-devanagari font-bold text-[#1C1917] block">
                      {tok.surface} ({tok.iast})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tok.phonology.phonemes.map((p, pIdx) => (
                        <span key={pIdx} className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded text-[10px] font-mono-code">
                          {p.grapheme} <span className="text-[#8C4A2F]">{p.iast}</span> ({p.groupName})
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
