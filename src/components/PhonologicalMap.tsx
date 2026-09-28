import React, { useState } from 'react';
import { 
  PHONOLOGICAL_GROUPS, 
  SANSKRIT_PHONEMES, 
  SanskritPhoneme, 
  PhonologicalGroupData 
} from '../data/phonology';
import { 
  analyzeSanskritPhonology, 
  getWordsByPhoneme, 
  WordPhonologicalAnalysis 
} from '../lib/phonology';
import { SanskritEntry } from '../data/sanskritDictionary';
import { 
  Volume2, 
  Sparkles, 
  Info, 
  Layers, 
  BookOpen, 
  ArrowRight,
  Search,
  Check
} from 'lucide-react';

interface PhonologicalMapProps {
  onSelectWord?: (word: string) => void;
  initialWord?: string;
}

export const PhonologicalMap: React.FC<PhonologicalMapProps> = ({
  onSelectWord,
  initialWord = 'धर्मः'
}) => {
  const [selectedPhoneme, setSelectedPhoneme] = useState<SanskritPhoneme>(
    SANSKRIT_PHONEMES[0] // Default to 'अ'
  );
  const [activeAnalysisText, setActiveAnalysisText] = useState<string>(initialWord);
  const [computedAnalysis, setComputedAnalysis] = useState<WordPhonologicalAnalysis>(() =>
    analyzeSanskritPhonology(initialWord)
  );

  const handlePhonemeClick = (phoneme: SanskritPhoneme) => {
    setSelectedPhoneme(phoneme);
  };

  const handlePronounce = (char: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAnalyzeText = (text: string) => {
    setActiveAnalysisText(text);
    const analysis = analyzeSanskritPhonology(text);
    setComputedAnalysis(analysis);
  };

  // Dynamically query dictionary for words containing the selected phoneme
  const matchingWords = React.useMemo(() => {
    return getWordsByPhoneme(selectedPhoneme.devanagari, 8);
  }, [selectedPhoneme]);

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] border-b border-[#EFE9DD]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                Linguistic Articulation Taxonomy
              </span>
              <span className="text-xs text-[#A8A29E]">·</span>
              <span className="text-xs font-mono-code text-[#78716C]">
                Pāṇinian Śikṣā (उच्चारण-स्थानम्)
              </span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-1">
              Sanskrit Phonological Map & Articulation Matrix
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-3xl leading-relaxed">
              Every Sanskrit phoneme is classified by its anatomical point of articulation (स्थान / Sthāna) and internal articulatory effort (आभ्यन्तर प्रयत्न / Ābhyantara Prayatna). Select any phoneme below to explore its acoustic parameters and matching lexicon entries.
            </p>
          </div>
        </div>

        {/* Live Word Articulation Breakdown Sub-Bar */}
        <div className="mt-6 pt-5 border-t border-[#EFE9DD]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#57534E] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>Real-Time Word Phoneme Segmentation (वर्ण-विभागः)</span>
            </span>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={activeAnalysisText}
                onChange={(e) => handleAnalyzeText(e.target.value)}
                placeholder="Enter Sanskrit word..."
                className="px-3 py-1 bg-[#FFFFFF] border border-[#D6CEBE] rounded-lg text-sm font-devanagari text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#8C4A2F]"
              />
              <button
                type="button"
                onClick={() => handleAnalyzeText(activeAnalysisText)}
                className="px-2.5 py-1 bg-[#8C4A2F] text-white text-xs font-medium rounded-lg hover:bg-[#723922] transition-colors"
              >
                Analyze
              </button>
            </div>
          </div>

          {/* Render Computed Phoneme Sequence */}
          {computedAnalysis.phonemes.length > 0 ? (
            <div className="flex flex-wrap items-stretch gap-2">
              {computedAnalysis.phonemes.map((token, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (token.phoneme) setSelectedPhoneme(token.phoneme);
                  }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    selectedPhoneme.devanagari === token.phoneme?.devanagari
                      ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs'
                      : 'bg-[#FBF9F5] hover:bg-[#F2ECE1] border-[#EAE3D6] text-[#1C1917]'
                  }`}
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-devanagari font-bold text-lg">
                      {token.grapheme}
                    </span>
                    <span className={`font-mono-code text-xs ${
                      selectedPhoneme.devanagari === token.phoneme?.devanagari ? 'text-white/80' : 'text-[#8C4A2F]'
                    }`}>
                      {token.iast}
                    </span>
                  </div>
                  <div className={`text-[10px] truncate max-w-[90px] ${
                    selectedPhoneme.devanagari === token.phoneme?.devanagari ? 'text-white/80' : 'text-[#78716C]'
                  }`}>
                    {token.groupName}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#A8A29E] italic">
              Type any Sanskrit word above to dynamically break it down into phonemic components.
            </p>
          )}
        </div>
      </div>

      {/* Main Grid: 5 Articulation Place Columns */}
      <div className="p-6 sm:p-8 space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PHONOLOGICAL_GROUPS.map((group: PhonologicalGroupData) => (
            <div
              key={group.id}
              className="bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                {/* Group Title */}
                <div className="border-b border-[#EFE9DD] pb-2.5 mb-3">
                  <span className="text-[10px] uppercase font-mono-code font-semibold tracking-wider text-[#8C4A2F] block">
                    {group.englishName}
                  </span>
                  <div className="font-devanagari font-bold text-lg text-[#1C1917]">
                    {group.sanskritTerm}
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-0.5">
                    {group.organ}
                  </div>
                </div>

                {/* Phonemes inside this group */}
                <div className="space-y-1.5">
                  {group.phonemes.map((phoneme: SanskritPhoneme) => {
                    const isSelected = selectedPhoneme.devanagari === phoneme.devanagari;
                    return (
                      <button
                        key={phoneme.devanagari}
                        type="button"
                        onClick={() => handlePhonemeClick(phoneme)}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs'
                            : 'bg-white hover:bg-[#F2ECE1] border-[#E8E1D5] text-[#1C1917]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-devanagari font-bold text-base">
                            {phoneme.devanagari}
                          </span>
                          <span className={`font-mono-code text-xs ${
                            isSelected ? 'text-white/80' : 'text-[#8C4A2F]'
                          }`}>
                            {phoneme.iast}
                          </span>
                        </div>
                        <span className={`text-[10px] capitalize ${
                          isSelected ? 'text-white/80' : 'text-[#A8A29E]'
                        }`}>
                          {phoneme.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EFE9DD] text-[10px] text-[#78716C] leading-snug">
                {group.description}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Phoneme Detailed Inspection Panel */}
        <div className="p-6 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            {/* Left: Phoneme Identity */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-white border border-[#E0D8CA] rounded-2xl flex items-center justify-center shadow-xs shrink-0">
                <span className="font-devanagari font-bold text-5xl text-[#8C4A2F]">
                  {selectedPhoneme.devanagari}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2.5">
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#1C1917]">
                    {selectedPhoneme.sanskritTerm}
                  </h3>
                  <span className="font-mono-code text-lg text-[#8C4A2F] font-semibold">
                    /{selectedPhoneme.iast}/
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#78716C] mt-1.5">
                  <span>Place: <strong className="text-[#1C1917]">{selectedPhoneme.placeOfArticulation}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Organ: <strong className="text-[#1C1917]">{selectedPhoneme.organ}</strong></span>
                  {selectedPhoneme.manner && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Manner: <strong className="text-[#1C1917]">{selectedPhoneme.manner}</strong></span>
                    </>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#57534E] mt-3 max-w-2xl leading-relaxed">
                  {selectedPhoneme.description}
                </p>
              </div>
            </div>

            {/* Right: Audio and Pronunciation */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => handlePronounce(selectedPhoneme.devanagari)}
                className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-[#F2ECE1] text-[#1C1917] border border-[#D6CEBE] rounded-xl text-xs font-medium transition-colors shadow-2xs"
                title="Pronounce phoneme"
              >
                <Volume2 className="w-4 h-4 text-[#8C4A2F]" />
                <span>Hear Pronunciation</span>
              </button>
            </div>

          </div>

          {/* Linked Lexicon Entries containing this Phoneme */}
          <div className="mt-6 pt-5 border-t border-[#EAE3D6]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block mb-2.5">
              Live Lexicon Entries Containing <strong className="font-devanagari text-[#8C4A2F]">"{selectedPhoneme.devanagari}"</strong>:
            </span>

            {matchingWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchingWords.map((entry: SanskritEntry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      if (onSelectWord) {
                        onSelectWord(entry.devanagari);
                      }
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-[#F0EAE0] border border-[#E0D8CA] rounded-lg text-xs transition-colors flex items-baseline gap-1.5 group"
                  >
                    <span className="font-devanagari font-bold text-sm text-[#1C1917] group-hover:text-[#8C4A2F]">
                      {entry.devanagari}
                    </span>
                    <span className="font-mono-code text-[11px] text-[#78716C]">
                      ({entry.iast})
                    </span>
                    <span className="text-[#A8A29E] text-[10px] hidden sm:inline">
                      — {entry.meaning.split(',')[0]}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A8A29E] italic">
                No matching words in the current curated baseline.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
