import React, { useState } from 'react';
import { SanskritEntry } from '../data/sanskritDictionary';
import { 
  Volume2, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  GitFork, 
  FileText, 
  Sparkles,
  Search,
  ExternalLink
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

  const handleCopy = () => {
    if (!entry) return;
    const textToCopy = `${entry.devanagari} (${entry.iast}) - ${entry.meaning}\nGrammar: ${entry.grammar}\nRoot: ${entry.root || 'N/A'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePronounce = () => {
    if (!entry) return;
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.devanagari);
      utterance.lang = 'hi-IN'; // Closest native phonology available in browsers
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Not found state
  if (!entry) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-10 shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-[#F5EFEB] text-[#8C4A2F] flex items-center justify-center mx-auto mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917] mb-2">
          No entry found in the demo dictionary.
        </h3>
        <p className="text-[#78716C] text-sm max-w-md mx-auto mb-6">
          {notFoundQuery ? (
            <>
              Could not find an exact match for <strong className="text-[#1C1917]">"{notFoundQuery}"</strong> in the curated baseline lexicon.
            </>
          ) : (
            'Enter a Sanskrit word or select an example above to inspect its computational and morphological analysis.'
          )}
        </p>

        {suggestions.length > 0 && (
          <div className="pt-6 border-t border-[#F2EDE2]">
            <p className="text-xs font-semibold text-[#A8A29E] uppercase tracking-wider mb-3">
              Did you mean one of these words?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((sug) => (
                <button
                  key={sug.id}
                  onClick={() => onSelectWord(sug.devanagari)}
                  className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#1C1917] border border-[#E5DECF] rounded-lg text-sm flex items-center gap-2 transition-colors group"
                >
                  <span className="font-devanagari font-semibold text-base group-hover:text-[#8C4A2F]">
                    {sug.devanagari}
                  </span>
                  <span className="text-xs font-mono-code text-[#78716C]">
                    ({sug.iast})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden transition-all">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3.5 flex-wrap">
              <h2 className="font-devanagari font-bold text-4xl sm:text-5xl text-[#1C1917] tracking-wide">
                {entry.devanagari}
              </h2>
              <span className="font-mono-code text-xl sm:text-2xl text-[#8C4A2F] font-medium">
                {entry.iast}
              </span>
            </div>

            {/* Metadata row (Strict Zero-Pill rule: unboxed text with typographic separators) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#78716C] mt-2.5">
              <span className="capitalize font-medium text-[#1C1917]">{entry.partOfSpeech}</span>
              <span aria-hidden="true">·</span>
              <span>{entry.grammar}</span>
              {entry.rootClass && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{entry.rootClass}</span>
                </>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handlePronounce}
              className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5]"
              title="Pronounce word"
              aria-label="Pronounce word"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-[#8C4A2F]' : ''}`} />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5]"
              title="Copy analysis details"
              aria-label="Copy analysis details"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Multilingual Meanings Deck */}
        <div className="mt-5 pt-5 border-t border-[#EFE9DD] space-y-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
              English Meaning
            </span>
            <p className="font-serif-editorial text-xl sm:text-2xl text-[#1C1917] leading-relaxed">
              {entry.meaning}
            </p>
          </div>

          {(entry.meaningHindi || entry.meaningMarathi) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {entry.meaningHindi && (
                <div className="p-3 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-0.5">
                    Hindi (हिन्दी)
                  </span>
                  <p className="font-devanagari font-medium text-base text-[#1C1917]">
                    {entry.meaningHindi}
                  </p>
                </div>
              )}
              {entry.meaningMarathi && (
                <div className="p-3 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C4A2F] block mb-0.5">
                    Marathi (मराठी)
                  </span>
                  <p className="font-devanagari font-medium text-base text-[#1C1917]">
                    {entry.meaningMarathi}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Structured Linguistic Breakdown Grid */}
      <div className="p-6 sm:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Root / Dhātu Card */}
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">
              <GitFork className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>Root / Dhātu (धातु)</span>
            </div>
            {entry.root && entry.root !== '—' ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-devanagari font-bold text-xl text-[#1C1917]">
                    {entry.root}
                  </span>
                  {entry.rootIast && (
                    <span className="font-mono-code text-sm text-[#8C4A2F]">
                      ({entry.rootIast})
                    </span>
                  )}
                </div>
                {entry.rootMeaning && (
                  <p className="text-sm text-[#57534E] mt-1">
                    Meaning: <span className="italic text-[#1C1917] font-medium">{entry.rootMeaning}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#78716C]">
                Indeclinable particle or primitive nominal stem (अव्ययम् / प्रातिपदिक).
              </p>
            )}
          </div>

          {/* Grammatical Analysis Card */}
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-2">
              <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>Grammatical Categorization</span>
            </div>
            <p className="text-sm text-[#1C1917] font-medium mb-1">
              {entry.grammar}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#78716C] mt-2">
              {entry.gender && (
                <span>Gender: <strong className="text-[#1C1917] capitalize">{entry.gender}</strong></span>
              )}
              {entry.number && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Number: <strong className="text-[#1C1917] capitalize">{entry.number}</strong></span>
                </>
              )}
              {entry.caseOrVibhakti && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Case: <strong className="text-[#1C1917]">{entry.caseOrVibhakti}</strong></span>
                </>
              )}
              {entry.tenseOrLakara && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Lakāra: <strong className="text-[#1C1917]">{entry.tenseOrLakara}</strong></span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Morphological Analysis (Prakṛti + Pratyaya) */}
        <div className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block mb-1">
            Pāṇinian Morphological Decomposition (प्रकृति-प्रत्यय-विभागः)
          </span>
          <p className="font-mono-code text-sm sm:text-base text-[#1C1917] bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E5DECF] inline-block w-full">
            {entry.morphology}
          </p>
          {entry.etymology && (
            <p className="text-xs text-[#78716C] mt-2 leading-relaxed">
              <strong className="text-[#57534E]">Etymological note:</strong> {entry.etymology}
            </p>
          )}
        </div>

        {/* Example in Sanskrit Literature */}
        <div className="p-5 bg-[#FBF9F5] border-l-4 border-l-[#8C4A2F] border border-[#EAE3D6] rounded-r-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Classical Usage & Context</span>
            </span>
          </div>

          <p className="font-devanagari text-lg sm:text-xl font-medium text-[#1C1917] mb-1">
            {entry.example}
          </p>
          <p className="font-mono-code text-xs sm:text-sm text-[#78716C] mb-2">
            {entry.exampleIast}
          </p>
          <p className="font-serif-editorial text-sm sm:text-base text-[#44403C] italic">
            "{entry.exampleMeaning}"
          </p>
        </div>

        {/* Related Words */}
        {entry.relatedWords && entry.relatedWords.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#78716C] block mb-2.5">
              Related Derivatives & Cognate Vocabulary
            </span>
            <div className="flex flex-wrap gap-2">
              {entry.relatedWords.map((word, idx) => {
                const devOnly = word.split(' ')[0];
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectWord(devOnly)}
                    className="px-3 py-1 bg-[#FFFFFF] hover:bg-[#F2ECE1] text-[#1C1917] border border-[#E0D8CA] rounded-lg text-xs font-medium transition-colors"
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
