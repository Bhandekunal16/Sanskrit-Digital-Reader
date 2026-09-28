import React, { useState, useMemo } from 'react';
import { SanskritEntry } from '../data/sanskritDictionary';
import { analyzeSanskritPhonology } from '../lib/phonology';
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
  ShieldCheck
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

  // Dynamic analysis for unknown queries
  const dynamicAnalysis = useMemo(() => {
    if (entry) return null;
    if (!notFoundQuery) return null;
    return analyzeSanskritToken(notFoundQuery);
  }, [entry, notFoundQuery]);

  // Dynamically compute phoneme decomposition and articulation points
  const phonologyAnalysis = useMemo(() => {
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
      ? `${entry.devanagari} (${entry.iast}) - ${entry.meaning}\nGrammar: ${entry.grammar}\nRoot: ${entry.root || 'N/A'}`
      : `${notFoundQuery} (${devanagariToIast(notFoundQuery || '')}) - Dynamic Morphology Analysis`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // When word is not in static baseline dictionary, show Dynamic Morphology & Phonology card
  if (!entry && notFoundQuery) {
    const iast = devanagariToIast(notFoundQuery);
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header Notice */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EFE9DD] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                Dynamic Morphological & Phonological Inspector
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Outside Curated Baseline
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <h2 className="font-devanagari text-3xl sm:text-4xl font-bold text-[#1C1917]">
                {notFoundQuery}
              </h2>
              <span className="font-mono-code text-base text-[#8C4A2F]">
                {iast}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePronounce(notFoundQuery)}
              className="min-w-[44px] min-h-[44px] p-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Pronounce word"
            >
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="min-w-[44px] min-h-[44px] p-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              aria-label="Copy analysis"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" aria-hidden="true" /> : <Copy className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Dynamic Analysis Grid (Gestalt grouping) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Sandhi & Compound Split */}
          <div className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
                <span>Sandhi Segmentation (सन्धि-विभागः)</span>
              </span>
              <span className="text-[10px] font-mono-code text-[#8C4A2F] bg-white px-2 py-0.5 rounded border border-[#E0D8CA]">
                {sandhiAnalysis?.confidence}
              </span>
            </div>

            {sandhiAnalysis && sandhiAnalysis.isCompound ? (
              <>
                <div className="font-devanagari font-bold text-base text-[#1C1917]">
                  {sandhiAnalysis.possibleSplit.join(' + ')}
                </div>
                <div className="text-xs text-[#8C4A2F] font-semibold">
                  {sandhiAnalysis.sanskritTerm} ({sandhiAnalysis.ruleName})
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {sandhiAnalysis.explanation}
                </p>
              </>
            ) : (
              <p className="text-xs text-[#78716C]">
                No compound split detected; treated as an elementary word or inflected form.
              </p>
            )}
          </div>

          {/* Morphological Stem Derivation */}
          <div className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
              <span>Morphological Stem (प्रकृति-प्रत्यय)</span>
            </span>

            {dynamicAnalysis?.found ? (
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[#78716C]">Resolved Lemma: </span>
                  <strong className="font-devanagari text-[#1C1917]">{dynamicAnalysis.lemma}</strong>
                </div>
                <div>
                  <span className="text-[#78716C]">Grammar Form: </span>
                  <span className="text-[#1C1917]">{dynamicAnalysis.grammar}</span>
                </div>
                {dynamicAnalysis.meanings.english && (
                  <div className="text-[#8C4A2F]">
                    Meaning: {dynamicAnalysis.meanings.english}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#78716C] leading-relaxed">
                Word is not an exact match in the baseline corpus. Full Pāṇinian morphological and phonological rules applied dynamically.
              </p>
            )}
          </div>

        </div>

        {/* Phonological Articulation Breakdown */}
        {phonologyAnalysis && (
          <div className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
                <span>Computed Pāṇinian Varṇa Articulation</span>
              </span>
              <span className="text-xs text-[#78716C] font-mono-code">
                {phonologyAnalysis.vowelCount} vowels · {phonologyAnalysis.consonantCount} consonants
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {phonologyAnalysis.phonemes.map((tok, i) => (
                <div
                  key={i}
                  className="p-2 bg-white border border-[#E0D8CA] rounded-lg text-xs"
                >
                  <div className="font-devanagari font-bold text-sm text-[#1C1917]">
                    {tok.grapheme} <span className="font-mono-code text-[11px] font-normal text-[#8C4A2F]">({tok.iast})</span>
                  </div>
                  <div className="text-[10px] text-[#78716C] mt-0.5">
                    {tok.groupName} · {tok.placeOfArticulation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions if any (Fitts's Law: 44px min tap targets) */}
        {suggestions.length > 0 && (
          <div className="pt-3 border-t border-[#EFE9DD]">
            <span className="text-xs text-[#78716C] font-semibold block mb-2.5">
              Related Lexicon Entries:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectWord(s.devanagari)}
                  className="min-h-[40px] px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E0D8CA] rounded-xl text-xs font-devanagari font-medium text-[#1C1917] hover:border-[#8C4A2F]/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
                >
                  {s.devanagari} ({s.iast})
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  // Not found fallback when no query
  if (!entry) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-10 shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[#F5EFEB] text-[#8C4A2F] flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917] mb-2">
          Select or Search a Sanskrit Word
        </h3>
        <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6">
          Enter a Sanskrit word in Devanagari or IAST to inspect its computational and morphological analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Top Bar: Word Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EFE9DD] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
              Lexical Entry
            </span>
            <span className="text-xs text-[#A8A29E]" aria-hidden="true">·</span>
            <span className="text-xs font-mono-code text-[#78716C] capitalize">
              {entry.partOfSpeech}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="font-devanagari text-3xl sm:text-4xl font-bold text-[#1C1917]">
              {entry.devanagari}
            </h2>
            <span className="font-mono-code text-base sm:text-lg text-[#8C4A2F]">
              {entry.iast}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handlePronounce(entry.devanagari)}
            className="min-w-[44px] min-h-[44px] p-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
            aria-label="Pronounce word"
          >
            <Volume2 className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="min-w-[44px] min-h-[44px] p-2.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
            aria-label="Copy entry details"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" aria-hidden="true" /> : <Copy className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Multilingual Meanings Banner */}
      <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block">
          Multilingual Definitions
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-xs font-semibold text-[#57534E] block">English:</span>
            <p className="font-serif-editorial text-[#1C1917] mt-0.5 leading-relaxed">{entry.meaning}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#57534E] block">Hindi (हिन्दी):</span>
            <p className="font-devanagari text-[#1C1917] mt-0.5 leading-relaxed">{entry.meaningHindi || '—'}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#57534E] block">Marathi (मराठी):</span>
            <p className="font-devanagari text-[#1C1917] mt-0.5 leading-relaxed">{entry.meaningMarathi || '—'}</p>
          </div>
        </div>
      </div>

      {/* Grammatical & Derivational Metadata Grid (Gestalt grouping) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Morphology */}
        <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
            <span>Grammatical Paradigm (व्याकरणम्)</span>
          </span>
          <p className="text-sm text-[#1C1917] leading-relaxed">{entry.grammar}</p>
          {entry.root && (
            <div className="text-xs text-[#8C4A2F] pt-1">
              <strong>Root (धातु):</strong> {entry.root} {entry.rootIast && `(${entry.rootIast})`}
            </div>
          )}
        </div>

        {/* Sandhi */}
        <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
            <span>Sandhi & Compound Analysis</span>
          </span>
          {sandhiAnalysis && sandhiAnalysis.isCompound ? (
            <div>
              <span className="font-devanagari font-bold text-sm text-[#1C1917]">
                {sandhiAnalysis.possibleSplit.join(' + ')}
              </span>
              <p className="text-xs text-[#78716C] mt-1">{sandhiAnalysis.explanation}</p>
            </div>
          ) : (
            <p className="text-xs text-[#78716C] leading-relaxed">
              Elementary Sanskrit word base (प्रातिपदिकम् / धातुः).
            </p>
          )}
        </div>

      </div>

      {/* Dynamic Phonological Decomposition Card */}
      {phonologyAnalysis && (
        <div className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#8C4A2F]" aria-hidden="true" />
              <span>Phoneme & Articulation Breakdown (उच्चारण-स्थानम्)</span>
            </span>
            <span className="text-xs text-[#78716C] font-mono-code">
              {phonologyAnalysis.vowelCount} vowels · {phonologyAnalysis.consonantCount} consonants
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {phonologyAnalysis.phonemes.map((tok, i) => (
              <div
                key={i}
                className="p-2.5 bg-white border border-[#E0D8CA] rounded-xl text-xs shadow-2xs"
              >
                <div className="font-devanagari font-bold text-sm text-[#1C1917]">
                  {tok.grapheme} <span className="font-mono-code text-[11px] font-normal text-[#8C4A2F]">({tok.iast})</span>
                </div>
                <div className="text-[10px] text-[#78716C] mt-0.5">
                  {tok.groupName} · {tok.placeOfArticulation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Literary Context / Usage Example */}
      {entry.context && (
        <div className="p-5 bg-[#FFFFFF] border border-[#EAE3D6] rounded-xl space-y-1.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Classical Context & Usage</span>
          </span>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed italic">
            "{entry.context}"
          </p>
        </div>
      )}

    </div>
  );
};
