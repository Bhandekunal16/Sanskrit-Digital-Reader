import React, { useState, useMemo } from 'react';
import { SanskritEntry } from '../data/sanskritDictionary';
import { analyzeSanskritPhonology, WordPhonologicalAnalysis } from '../lib/phonology';
import { analyzeSandhi } from '../lib/sandhi';
import { analyzeSanskritToken } from '../lib/sanskrit-analysis';
import { devanagariToIast } from '../lib/transliteration';
import { 
  Volume2, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  GitFork, 
  FileText, 
  Search,
  Activity,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Compass,
  Bookmark,
  ExternalLink,
  Split,
  Binary
} from 'lucide-react';

interface WordAnalysisProps {
  entry: SanskritEntry | null;
  notFoundQuery?: string;
  suggestions?: SanskritEntry[];
  onSelectWord: (word: string) => void;
  onExploreReader?: () => void;
}

export const WordAnalysis: React.FC<WordAnalysisProps> = ({
  entry,
  notFoundQuery,
  suggestions = [],
  onSelectWord,
  onExploreReader
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Dynamic analysis for unknown queries or fallback
  const dynamicAnalysis = useMemo(() => {
    if (entry) return null;
    if (!notFoundQuery) return null;
    return analyzeSanskritToken(notFoundQuery);
  }, [entry, notFoundQuery]);

  // Dynamically compute phoneme decomposition and articulation points
  const phonologyAnalysis = useMemo<WordPhonologicalAnalysis | null>(() => {
    const textToAnalyze = entry ? entry.devanagari : notFoundQuery || '';
    if (!textToAnalyze) return null;
    return analyzeSanskritPhonology(textToAnalyze);
  }, [entry, notFoundQuery]);

  // Dynamically compute Sandhi segmentation
  const sandhiAnalysis = useMemo(() => {
    const textToAnalyze = entry ? entry.devanagari : notFoundQuery || '';
    if (!textToAnalyze) return null;
    return analyzeSandhi(textToAnalyze);
  }, [entry, notFoundQuery]);

  const handleCopy = () => {
    const textToCopy = entry 
      ? `${entry.devanagari} (${entry.iast})\nPart of Speech: ${entry.partOfSpeech}\nGrammar: ${entry.grammar}\nRoot (धातु): ${entry.root ? `${entry.root} (${entry.rootIast || ''}) - ${entry.rootMeaning || ''}` : 'N/A'}\nEnglish Meaning: ${entry.meaning}\nHindi: ${entry.meaningHindi || 'N/A'}\nMarathi: ${entry.meaningMarathi || 'N/A'}${entry.morphology ? `\nMorphology: ${entry.morphology}` : ''}${entry.example ? `\nExample: ${entry.example} (${entry.exampleMeaning || ''})` : ''}`
      : `${notFoundQuery} (${devanagariToIast(notFoundQuery || '')}) - Dynamic Morphology Analysis`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        setIsPlayingAudio(true);
        setAudioError(false);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.85;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          setAudioError(true);
          setTimeout(() => setAudioError(false), 3000);
        };
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsPlayingAudio(false);
        setAudioError(true);
        setTimeout(() => setAudioError(false), 3000);
      }
    }
  };

  // Helper to get brief quick synopsis meaning (comma separated, max 4 items)
  const getQuickSynopsis = (meaningStr: string) => {
    if (!meaningStr) return '';
    const parts = meaningStr.split(/[,;]/).map(p => p.trim()).filter(Boolean);
    return parts.slice(0, 3).join(' · ');
  };

  // Helper to extract clean word from related word string e.g. "विद्वान् (vidvān)" -> "विद्वान्"
  const parseRelatedWord = (relStr: string) => {
    const match = relStr.match(/^([^\s(]+)/);
    return match ? match[1] : relStr;
  };

  // ==========================================
  // CASE 1: Dynamic Analysis for Non-Baseline Word
  // ==========================================
  if (!entry && notFoundQuery) {
    const iast = devanagariToIast(notFoundQuery);
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* Header: Dynamic Lexical Inspector */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EFE9DD] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code">
                LEXICAL INSPECTION
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                Pāṇinian Dynamic Resolver
              </span>
            </div>
            
            {/* Dominant Sanskrit Word (Vertical Stack) */}
            <div className="pt-1">
              <h2 className="font-devanagari text-4xl sm:text-5xl font-bold text-[#1C1917] tracking-tight leading-none">
                {notFoundQuery}
              </h2>
              <div className="font-mono-code text-lg sm:text-xl text-[#8C4A2F] font-semibold mt-1.5">
                {iast}
              </div>
            </div>

            {/* Quick Grammar / Status */}
            <div className="text-xs text-[#78716C] font-mono-code">
              {dynamicAnalysis?.found 
                ? `${dynamicAnalysis.partOfSpeech || 'Word'} · ${dynamicAnalysis.grammar || 'Inflected'}` 
                : 'Elementary token / Inflected form outside curated corpus'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handlePronounce(notFoundQuery)}
              className="min-w-[44px] min-h-[44px] px-3 py-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Listen to pronunciation"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-[#8C4A2F] animate-pulse' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Listen</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="min-w-[44px] min-h-[44px] px-3 py-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Copy analysis text"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700 font-medium hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Linguistic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Morphological Lemma Card */}
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                Morphological Stem (प्रकृति-प्रत्यय)
              </span>
            </div>

            {dynamicAnalysis?.found ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#78716C]">Resolved Lemma (प्रातिपदिकम् / धातु):</span>
                  <strong className="font-devanagari text-sm text-[#1C1917]">{dynamicAnalysis.lemma}</strong>
                </div>
                <div>
                  <span className="text-[#78716C]">Grammatical Form: </span>
                  <span className="text-[#1C1917] font-medium">{dynamicAnalysis.grammar}</span>
                </div>
                {dynamicAnalysis.meanings.english && (
                  <div className="pt-1 border-t border-[#E8E1D5]">
                    <span className="text-xs font-semibold text-[#8C4A2F]">Lexical Meaning: </span>
                    <span className="text-[#1C1917]">{dynamicAnalysis.meanings.english}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#78716C] leading-relaxed">
                Word morphology analyzed dynamically using Sanskrit morphological heuristics and phonological rules.
              </p>
            )}
          </div>

          {/* Sandhi & Compound Split Card */}
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitFork className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                  Sandhi Segmentation (सन्धि-विभागः)
                </span>
              </div>
              {sandhiAnalysis?.confidence && (
                <span className="text-[10px] font-mono-code text-[#8C4A2F] bg-white px-2 py-0.5 rounded border border-[#E0D8CA]">
                  {sandhiAnalysis.confidence}
                </span>
              )}
            </div>

            {sandhiAnalysis && sandhiAnalysis.isCompound ? (
              <div className="space-y-1.5">
                <div className="font-devanagari font-bold text-base text-[#1C1917]">
                  {sandhiAnalysis.possibleSplit.join(' + ')}
                </div>
                <div className="text-xs text-[#8C4A2F] font-semibold">
                  {sandhiAnalysis.sanskritTerm} ({sandhiAnalysis.ruleName})
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {sandhiAnalysis.explanation}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#78716C] leading-relaxed">
                No compound junction detected. Analyzed as an indivisible root or simple stem.
              </p>
            )}
          </div>

        </div>

        {/* Phonological Articulation Breakdown */}
        {phonologyAnalysis && (
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1C1917]">
                  Phoneme & Articulation Breakdown (उच्चारण-स्थानम्)
                </span>
              </div>
              <span className="text-xs text-[#78716C] font-mono-code">
                {phonologyAnalysis.vowelCount} vowels · {phonologyAnalysis.consonantCount} consonants
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {phonologyAnalysis.phonemes.map((tok, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-white border border-[#E0D8CA] rounded-xl text-xs shadow-2xs space-y-1"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-devanagari font-bold text-base text-[#1C1917]">{tok.grapheme}</span>
                    <span className="font-mono-code text-[11px] text-[#8C4A2F]">({tok.iast})</span>
                  </div>
                  <div className="text-[11px] font-medium text-[#57534E] truncate">
                    {tok.placeOfArticulation}
                  </div>
                  <div className="text-[10px] text-[#8C4A2F] truncate">
                    {tok.groupName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions if any */}
        {suggestions.length > 0 && (
          <div className="pt-4 border-t border-[#EFE9DD]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#78716C] block mb-3 font-mono-code">
              Related Curated Dictionary Entries:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectWord(s.devanagari)}
                  className="min-h-[44px] px-4 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E0D8CA] rounded-xl text-xs font-devanagari font-medium text-[#1C1917] hover:border-[#8C4A2F]/40 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] flex items-center gap-1.5"
                >
                  <span>{s.devanagari}</span>
                  <span className="font-mono-code text-[#8C4A2F]">({s.iast})</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // CASE 2: Empty State
  // ==========================================
  if (!entry) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-8 sm:p-12 shadow-xs text-center">
        <div className="w-14 h-14 rounded-full bg-[#F5EFEB] text-[#8C4A2F] flex items-center justify-center mx-auto mb-4">
          <Search className="w-7 h-7" aria-hidden="true" />
        </div>
        <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917] mb-2">
          Select or Search a Sanskrit Word
        </h3>
        <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Enter a Sanskrit word in Devanagari or IAST to inspect its complete linguistic analysis: root etymology, grammatical paradigms, Sandhi segmentation, and Pāṇinian phonology.
        </p>
      </div>
    );
  }

  // ==========================================
  // CASE 3: Full Structured Lexical Entry
  // ==========================================
  const quickSynopsis = getQuickSynopsis(entry.meaning);

  return (
    <article className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden divide-y divide-[#EFE9DD]">
      
      {/* 1. WORD HEADER: Dominant Devanagari & Vertical Linguistic Hierarchy */}
      <section className="p-6 sm:p-8 bg-gradient-to-b from-[#FDFBF7] to-[#FFFFFF]">
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#8C4A2F] font-mono-code bg-[#FAF0E6] px-2.5 py-1 rounded-md border border-[#E8D7C5]">
                LEXICAL ENTRY
              </span>
              <span className="text-xs text-[#78716C] font-mono-code capitalize">
                {entry.partOfSpeech} {entry.gender ? `· ${entry.gender}` : ''}
              </span>
            </div>

            {/* Dominant Sanskrit Word (On its own line, prominent) */}
            <div className="pt-1">
              <h1 className="font-devanagari text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1C1917] tracking-tight leading-none">
                {entry.devanagari}
              </h1>
              {/* IAST Transliteration (Subordinate, clearly underneath) */}
              <div className="font-mono-code text-xl sm:text-2xl text-[#8C4A2F] font-semibold tracking-wide mt-2">
                {entry.iast}
              </div>
            </div>

            {/* Quick Grammar Tagline */}
            <div className="text-xs sm:text-sm text-[#57534E] font-medium flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
              <span className="capitalize font-semibold text-[#1C1917]">{entry.partOfSpeech}</span>
              {entry.gender && <span>· <span className="capitalize">{entry.gender}</span></span>}
              {entry.stem && <span>· <span>{entry.stem}</span></span>}
              {entry.caseOrVibhakti && <span>· <span>{entry.caseOrVibhakti}</span></span>}
              {entry.number && <span>· <span>{entry.number}</span></span>}
              {entry.tenseOrLakara && <span>· <span>{entry.tenseOrLakara}</span></span>}
              {entry.personOrPurusha && <span>· <span>{entry.personOrPurusha}</span></span>}
            </div>

            {/* Quick Synopsis (Immediate Understanding) */}
            {quickSynopsis && (
              <p className="text-base sm:text-lg text-[#8C4A2F] font-serif-editorial font-medium pt-1">
                {quickSynopsis}
              </p>
            )}

          </div>

          {/* Action Buttons (Generous spacing, >= 44px touch targets) */}
          <div className="flex items-center gap-2.5 shrink-0 self-start pt-1">
            <button
              type="button"
              onClick={() => handlePronounce(entry.devanagari)}
              className="min-w-[44px] min-h-[44px] px-4 py-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] bg-white rounded-xl border border-[#E0D8CA] transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Listen to pronunciation of Sanskrit word"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-[#8C4A2F] animate-pulse' : 'text-[#8C4A2F]'}`} aria-hidden="true" />
              <span>Listen</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="min-w-[44px] min-h-[44px] px-4 py-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] bg-white rounded-xl border border-[#E0D8CA] transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Copy IAST and complete lexical entry details"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
                  <span>Copy IAST</span>
                </>
              )}
            </button>
          </div>
        </div>

      </section>

      {/* 2. MULTILINGUAL LEXICAL MEANINGS (Structured columns, distinct from sentence translation) */}
      <section className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code">
            LEXICAL MEANINGS
          </h2>
          <span className="text-xs text-[#78716C]">
            Dictionary definitions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* English Meaning */}
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] block mb-2 font-mono-code">
                English Meaning
              </span>
              <p className="font-serif-editorial text-[#1C1917] text-base leading-relaxed">
                {entry.meaning}
              </p>
            </div>
            <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#E8E1D5]/60 font-mono-code">
              Primary Lexical Gloss
            </div>
          </div>

          {/* Hindi Meaning */}
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] block mb-2 font-mono-code">
                हिन्दी (Hindi Meaning)
              </span>
              <p className="font-devanagari text-[#1C1917] text-base leading-relaxed">
                {entry.meaningHindi || '—'}
              </p>
            </div>
            <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#E8E1D5]/60 font-devanagari">
              शब्दकोश अर्थ
            </div>
          </div>

          {/* Marathi Meaning */}
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] block mb-2 font-mono-code">
                मराठी (Marathi Meaning)
              </span>
              <p className="font-devanagari text-[#1C1917] text-base leading-relaxed">
                {entry.meaningMarathi || '—'}
              </p>
            </div>
            <div className="text-[11px] text-[#78716C] pt-2 border-t border-[#E8E1D5]/60 font-devanagari">
              शब्दार्थ विवरण
            </div>
          </div>

        </div>
      </section>

      {/* 3. GRAMMATICAL PARADIGM & ROOT DERIVATION (व्याकरणम् एवं धातु-निर्वचनम्) */}
      <section className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
            <span>GRAMMATICAL PARADIGM & MORPHOLOGY</span>
          </h2>
          <span className="text-xs text-[#78716C] font-devanagari">
            व्याकरण-प्रक्रिया
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Root (Dhātu) & Derivation Box */}
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] font-mono-code">
                Root Derivation (धातु)
              </span>
              {entry.rootClass && (
                <span className="text-[11px] font-mono-code text-[#8C4A2F] bg-white px-2 py-0.5 rounded border border-[#E0D8CA]">
                  {entry.rootClass}
                </span>
              )}
            </div>

            {entry.root ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#78716C]">Dhātu (धातुः):</span>
                  <span className="font-devanagari font-bold text-base text-[#1C1917]">
                    √{entry.root}
                  </span>
                  {entry.rootIast && (
                    <span className="font-mono-code text-sm text-[#8C4A2F]">
                      ({entry.rootIast})
                    </span>
                  )}
                </div>

                {entry.rootMeaning && (
                  <div>
                    <span className="text-[#78716C]">Root Meaning: </span>
                    <span className="text-[#1C1917] font-medium italic">"{entry.rootMeaning}"</span>
                  </div>
                )}

                {entry.morphology && (
                  <div className="pt-2 border-t border-[#E8E1D5]/70 space-y-1">
                    <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider block font-mono-code">
                      Prakṛti-Pratyaya Formula (प्रकृति-प्रत्यय):
                    </span>
                    <div className="p-2 bg-white rounded-lg border border-[#E0D8CA] font-devanagari text-xs text-[#1C1917] font-medium">
                      {entry.morphology}
                    </div>
                  </div>
                )}

                {entry.etymology && (
                  <div className="pt-1 text-[#57534E] text-xs leading-relaxed">
                    <span className="font-semibold text-[#1C1917]">Etymology / Cognates: </span>
                    {entry.etymology}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#78716C] leading-relaxed">
                Indeclinable particle (अव्यय) or uninflected Sanskrit lexical stem.
              </p>
            )}
          </div>

          {/* Inflectional Form & Grammatical Breakdown */}
          <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#57534E] font-mono-code">
                Inflection & Syntactic Role (पद-स्वरूप)
              </span>
              <span className="text-[11px] font-mono-code text-[#78716C]">
                Pāṇinian Inflection
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-[#78716C] block mb-1">Full Paradigm Description:</span>
                <div className="p-2.5 bg-white rounded-lg border border-[#E0D8CA] font-medium text-[#1C1917]">
                  {entry.grammar}
                </div>
              </div>

              {/* Related Derived Words / Cognates */}
              {entry.relatedWords && entry.relatedWords.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#57534E] uppercase tracking-wider block font-mono-code">
                    Derived Cognates & Related Words:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.relatedWords.map((rel, idx) => {
                      const cleanWord = parseRelatedWord(rel);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onSelectWord(cleanWord)}
                          className="min-h-[36px] px-3 py-1.5 bg-white hover:bg-[#F2ECE1] border border-[#E0D8CA] hover:border-[#8C4A2F]/50 rounded-lg text-xs font-devanagari text-[#1C1917] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
                          title={`Inspect ${cleanWord}`}
                        >
                          {rel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. SANDHI & COMPOUND ANALYSIS */}
      <section className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
            <span>SANDHI & COMPOUND ANALYSIS</span>
          </h2>
          <span className="text-xs text-[#78716C] font-devanagari">
            सन्धि-समास-विभागः
          </span>
        </div>

        <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
          {sandhiAnalysis && sandhiAnalysis.isCompound ? (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#78716C]">Component Segmentation:</span>
                <span className="font-devanagari font-bold text-base sm:text-lg text-[#1C1917]">
                  {sandhiAnalysis.possibleSplit.join(' + ')}
                </span>
              </div>
              <div className="text-xs text-[#8C4A2F] font-semibold">
                {sandhiAnalysis.sanskritTerm} ({sandhiAnalysis.ruleName})
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                {sandhiAnalysis.explanation}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E0D8CA] flex items-center justify-center shrink-0 text-[#8C4A2F] mt-0.5">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider font-mono-code">
                  Elementary Sanskrit Stem (प्रातिपदिकम् / धातुः)
                </h4>
                <p className="text-xs text-[#78716C] mt-0.5 leading-relaxed">
                  This lexical item is an elemental nominal base or root without secondary Sandhi fusion. It is directly inflected with nominal case markers (सुँ-औ-जस्) or verbal terminations (तिप्-तस्-झि).
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. PHONEME & ARTICULATION BREAKDOWN (उच्चारण-स्थानम्) */}
      {phonologyAnalysis && (
        <section className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
              <span>PHONEME & ARTICULATION BREAKDOWN</span>
            </h2>
            <span className="text-xs text-[#78716C] font-mono-code">
              {phonologyAnalysis.vowelCount} vowels · {phonologyAnalysis.consonantCount} consonants · {phonologyAnalysis.modifierCount} modifiers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {phonologyAnalysis.phonemes.map((tok, i) => (
              <div
                key={i}
                className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-1 hover:border-[#8C4A2F]/40 transition-colors"
              >
                <div className="flex items-baseline justify-between border-b border-[#E8E1D5] pb-1">
                  <span className="font-devanagari font-bold text-lg text-[#1C1917]">
                    {tok.grapheme}
                  </span>
                  <span className="font-mono-code text-xs text-[#8C4A2F]">
                    ({tok.iast})
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#1C1917] pt-0.5 truncate">
                  {tok.placeOfArticulation}
                </div>
                <div className="text-[10px] text-[#78716C] truncate font-devanagari">
                  {tok.groupName}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CLASSICAL LITERARY USAGE & SANSKRIT READER BRIDGE */}
      {(entry.example || entry.context) && (
        <section className="p-6 sm:p-8 bg-[#FDFBF7] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] font-mono-code flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
              <span>CLASSICAL LITERARY USAGE & CONTEXT</span>
            </h2>
            <span className="text-xs text-[#78716C] font-mono-code">
              Literary Citation
            </span>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-[#EAE3D6] rounded-xl shadow-2xs space-y-3">
            {entry.example && (
              <div className="space-y-2">
                <blockquote className="font-devanagari text-lg sm:text-xl font-bold text-[#1C1917] leading-relaxed">
                  {entry.example}
                </blockquote>
                {entry.exampleIast && (
                  <p className="font-mono-code text-xs sm:text-sm text-[#8C4A2F]">
                    {entry.exampleIast}
                  </p>
                )}
                {entry.exampleMeaning && (
                  <p className="font-serif-editorial text-sm sm:text-base text-[#57534E] leading-relaxed pt-1">
                    "{entry.exampleMeaning}"
                  </p>
                )}
              </div>
            )}

            {entry.context && !entry.example && (
              <p className="font-serif-editorial text-sm sm:text-base text-[#57534E] italic leading-relaxed">
                "{entry.context}"
              </p>
            )}

            {/* Link / CTA to Sanskrit Reader if onExploreReader provided */}
            {onExploreReader && (
              <div className="pt-3 border-t border-[#EFE9DD] flex justify-end">
                <button
                  type="button"
                  onClick={onExploreReader}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[#8C4A2F] hover:text-[#703A24] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E0D8CA] rounded-xl transition-colors cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
                >
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                  <span>Open in Sanskrit Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

    </article>
  );
};
