import React, { useState } from 'react';
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { TargetLanguage } from '../lib/translation';
import { 
  Copy, 
  Check, 
  Volume2, 
  Sparkles, 
  Layers, 
  Languages, 
  Activity, 
  AlertCircle, 
  ShieldCheck, 
  GitFork,
  BookOpen,
  ArrowRight
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
  } = useSanskritWorkspace();

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'comparative'>('single');
  const [activeSection, setActiveSection] = useState<'translation' | 'gloss' | 'phonology'>('translation');

  if (!document || !document.rawText) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-8 sm:p-12 text-center text-[#78716C] shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center mx-auto mb-3">
          <Languages className="w-6 h-6 text-[#8C4A2F]" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-[#1C1917]">No translation generated yet</h3>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto mt-1 leading-relaxed">
          Enter a Sanskrit sentence or multi-line verse above and click <strong>Translate & Analyze</strong> to view dynamic Hindi, Marathi, and English translations.
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
      setIsPlayingAudio(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
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
          desc: 'Exact classical literature match with verified translations.',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-300'
        };
      case 'known_phrase':
        return {
          label: 'Phrase Match Translation',
          desc: 'Composed of recognized classical phrases.',
          color: 'text-blue-800 bg-blue-50 border-blue-300'
        };
      case 'partial_gloss':
        return {
          label: 'Hybrid / Lexical Gloss',
          desc: 'Combination of recognized phrases and tokenized dictionary stems.',
          color: 'text-amber-800 bg-amber-50 border-amber-300'
        };
      case 'lexical_gloss':
      default:
        return {
          label: 'Dynamic Lexical Gloss',
          desc: 'Constructed dynamically from tokenized word stems & morphology engine.',
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
      
      {/* 1. Header Bar: Status, Tier, & Primary Quick Actions */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
              Semantic Translation Result
            </span>
            <span className="text-xs text-[#A8A29E]" aria-hidden="true">·</span>
            <span className={`text-[11px] font-mono-code px-2.5 py-1 rounded-md border font-medium ${tierBadge.color}`}>
              {tierBadge.label}
            </span>
          </div>

          {/* Quick Action Bar (Fitts's Law: 44px minimum tap area) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'single' ? 'comparative' : 'single')}
              className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
              <span>{viewMode === 'single' ? 'Compare 3 Languages' : 'Single Language View'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy(activeTranslationText)}
              className="min-h-[44px] px-3.5 py-2 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-xl transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] flex items-center gap-1.5 cursor-pointer"
              aria-label="Copy translation to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#78716C]" aria-hidden="true" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Source Sanskrit Row */}
        <div className="mt-4 pt-4 border-t border-[#EFE9DD]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] block mb-1">
                Source Sanskrit Input ({document.lines.length} {document.lines.length === 1 ? 'line' : 'lines'} · {document.totalWords} tokens)
              </span>
              <div className="font-devanagari font-bold text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line">
                {document.rawText}
              </div>
              <div className="font-mono-code text-xs sm:text-sm text-[#8C4A2F] mt-1.5 whitespace-pre-line leading-relaxed">
                {document.lines.map(l => l.sourceIast).filter(Boolean).join('\n')}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handlePronounce(document.rawText, 'hi-IN')}
              className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl transition-colors border shrink-0 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] ${
                isPlayingAudio
                  ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs'
                  : 'bg-white text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] border-[#E8E1D5]'
              }`}
              aria-label="Listen to Sanskrit recitation"
              title="Listen to Sanskrit pronunciation"
            >
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Progressive Disclosure Section Switcher (Hick's Law) */}
      <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-[#EFE9DD] bg-[#FAF7F2] flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSection('translation')}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] ${
            activeSection === 'translation'
              ? 'bg-[#2C241E] text-white shadow-xs'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E0D8CA]'
          }`}
        >
          <Languages className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Full Translation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('gloss')}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] ${
            activeSection === 'gloss'
              ? 'bg-[#2C241E] text-white shadow-xs'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E0D8CA]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Token Lexical Gloss ({document.allTokens.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('phonology')}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] ${
            activeSection === 'phonology'
              ? 'bg-[#2C241E] text-white shadow-xs'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E0D8CA]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Phonetic Articulation</span>
        </button>
      </div>

      {/* 3. Section Content */}
      <div className="p-5 sm:p-8 space-y-6">
        
        {/* Unrecognized Words Alert if applicable */}
        {document.unknownCount > 0 && (
          <div className="p-4 bg-[#FFFDF5] border border-[#F0E6C8] rounded-xl text-xs text-[#855D10] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
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

        {/* SECTION A: Translation View */}
        {activeSection === 'translation' && (
          <div>
            {viewMode === 'single' ? (
              <div className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                    {getLanguageName(targetLanguage)} Translation
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePronounce(activeTranslationText, targetLanguage === 'english' ? 'en-US' : 'hi-IN')}
                    className="min-w-[40px] min-h-[40px] p-2 text-[#78716C] hover:text-[#8C4A2F] hover:bg-white rounded-lg border border-[#EAE3D6] transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Listen to translation pronunciation"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <p className={`text-xl sm:text-2xl text-[#1C1917] leading-relaxed whitespace-pre-line ${
                  targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari font-medium'
                }`}>
                  {activeTranslationText}
                </p>

                <div className="text-xs text-[#78716C] pt-3 border-t border-[#E8E1D5]/60 flex items-center justify-between flex-wrap gap-2">
                  <span><strong>Mode:</strong> {tierBadge.desc}</span>
                  {document.context && <span className="italic">{document.context}</span>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
                  Multi-Lingual Comparative Grid (Hindi, Marathi, English)
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
          </div>
        )}

        {/* SECTION B: Token Lexical Gloss Table */}
        {activeSection === 'gloss' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
                  Word-by-Word Lexical Analysis ({document.allTokens.length} Tokens)
                </span>
                <span className="text-[11px] text-[#78716C]">
                  Click any Sanskrit token to inspect its morphology, Sandhi, and place of articulation.
                </span>
              </div>
              <span className="text-[11px] text-[#78716C] font-mono-code bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EAE3D6]">
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
                    <th className="p-3 font-semibold min-w-[120px]">Status</th>
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
                            className="min-h-[36px] hover:text-[#8C4A2F] text-left flex items-center gap-1.5 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] rounded-md px-1"
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

        {/* SECTION C: Phonological Articulation Breakdown */}
        {activeSection === 'phonology' && (
          <div className="p-5 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
                <span>Pāṇinian Phoneme Articulation Analysis for Current Workspace</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {document.allTokens.map((tok) => {
                if (!tok.phonology) return null;
                return (
                  <div key={tok.id} className="p-3 bg-white border border-[#E0D8CA] rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-baseline justify-between border-b border-[#F2ECE1] pb-1.5">
                      <span className="text-base font-devanagari font-bold text-[#1C1917]">
                        {tok.surface}
                      </span>
                      <span className="text-xs font-mono-code text-[#8C4A2F]">
                        {tok.iast}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tok.phonology.phonemes.map((p, pIdx) => (
                        <span key={pIdx} className="px-2 py-1 bg-[#FAF7F2] border border-[#EAE3D6] rounded-md text-[11px] font-mono-code">
                          <span className="font-devanagari font-bold">{p.grapheme}</span> <span className="text-[#8C4A2F]">{p.iast}</span> ({p.groupName})
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
