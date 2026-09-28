import React, { useState, useMemo } from 'react';
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
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { SanskritEntry } from '../data/sanskritDictionary';
import { 
  Volume2, 
  Sparkles, 
  Info, 
  Layers, 
  BookOpen, 
  ArrowRight,
  Search,
  Check,
  Activity,
  Compass
} from 'lucide-react';

interface PhonologicalMapProps {
  onSelectWord?: (word: string) => void;
  initialWord?: string;
}

export const PhonologicalMap: React.FC<PhonologicalMapProps> = ({
  onSelectWord,
  initialWord
}) => {
  const {
    document,
    selectedToken,
    setSelectedTokenBySurface
  } = useSanskritWorkspace();

  const [selectedPhoneme, setSelectedPhoneme] = useState<SanskritPhoneme>(
    SANSKRIT_PHONEMES[0] // Default to 'अ'
  );

  const activeText = initialWord || (selectedToken ? selectedToken.clean || selectedToken.surface : document.rawText || 'धर्मः');

  const computedAnalysis = useMemo(() => {
    return analyzeSanskritPhonology(activeText);
  }, [activeText]);

  const [activeTab, setActiveTab] = useState<'matrix' | 'workspace_phonemes'>('workspace_phonemes');

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

  // Dynamically query dictionary for words containing the selected phoneme
  const matchingWords = useMemo(() => {
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
              Every Sanskrit phoneme is classified by its anatomical point of articulation (स्थान / Sthāna) and internal articulatory effort (आभ्यन्तर प्रयत्न / Ābhyantara Prayatna).
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-xl border border-[#E8E1D5] text-xs self-start">
            <button
              type="button"
              onClick={() => setActiveTab('workspace_phonemes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'workspace_phonemes'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Current Input Phonemes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-white text-[#1C1917] font-semibold shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Complete Alphabet Matrix
            </button>
          </div>
        </div>

        {/* Live Word Articulation Breakdown Sub-Bar */}
        <div className="mt-6 pt-5 border-t border-[#EFE9DD]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#57534E] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>Real-Time Phoneme Decomposition for: <strong className="font-devanagari text-[#1C1917]">{activeText}</strong></span>
            </span>

            <div className="flex items-center gap-2 text-xs text-[#78716C] font-mono-code">
              <span>{computedAnalysis.vowelCount} vowels</span>
              <span>·</span>
              <span>{computedAnalysis.consonantCount} consonants</span>
              <span>·</span>
              <span>{computedAnalysis.uniquePlaces.length} articulation places</span>
            </div>
          </div>

          {/* Decomposed Phonemes Flow */}
          <div className="flex flex-wrap gap-2">
            {computedAnalysis.phonemes.map((token, idx) => {
              const isSelected = selectedPhoneme.devanagari === token.phoneme?.devanagari || selectedPhoneme.devanagari === token.grapheme;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (token.phoneme) handlePhonemeClick(token.phoneme);
                  }}
                  className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs'
                      : 'bg-white hover:bg-[#FAF7F2] border-[#E8E1D5] text-[#1C1917]'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-devanagari font-bold text-lg">
                        {token.grapheme}
                      </span>
                      <span className={`text-xs font-mono-code ${isSelected ? 'text-amber-200' : 'text-[#8C4A2F]'}`}>
                        {token.iast}
                      </span>
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-stone-200' : 'text-[#78716C]'}`}>
                      {token.groupName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Articulation Grid & Detail Inspector */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Top (8 cols): Phonological Groups / Current Phonemes */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'workspace_phonemes' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E]">
                  Active Articulation Points in Workspace Text ({computedAnalysis.uniquePlaces.length} Points)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PHONOLOGICAL_GROUPS.filter(g => computedAnalysis.groupsPresent.includes(g.id)).map((group) => {
                  const presentGroupPhonemes = computedAnalysis.phonemes.filter(p => p.phoneme?.group === group.id);
                  return (
                    <div key={group.id} className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-3">
                      <div className="flex items-baseline justify-between border-b border-[#E8E1D5] pb-2">
                        <div>
                          <span className="font-devanagari font-bold text-base text-[#1C1917]">
                            {group.sanskritTerm}
                          </span>
                          <span className="text-xs text-[#78716C] ml-2 font-medium">
                            {group.englishName}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono-code text-[#8C4A2F]">
                          {group.organ}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {presentGroupPhonemes.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => {
                              if (p.phoneme) handlePhonemeClick(p.phoneme);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-code transition-colors cursor-pointer ${
                              selectedPhoneme.devanagari === p.phoneme?.devanagari
                                ? 'bg-[#8C4A2F] text-white border-[#8C4A2F]'
                                : 'bg-white hover:bg-[#F2ECE1] border-[#E0D8CA] text-[#1C1917]'
                            }`}
                          >
                            <span className="font-devanagari font-bold">{p.grapheme}</span> ({p.iast})
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E] block">
                Complete Sanskrit Pāṇinian Alphabet Matrix (52 Varṇas)
              </span>

              <div className="space-y-4">
                {PHONOLOGICAL_GROUPS.map((group) => {
                  const groupPhonemes = SANSKRIT_PHONEMES.filter(p => p.group === group.id);
                  return (
                    <div key={group.id} className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-devanagari font-bold text-base text-[#1C1917]">
                            {group.sanskritTerm}
                          </span>
                          <span className="text-xs text-[#78716C] ml-2 font-medium">
                            {group.englishName}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono-code text-[#8C4A2F]">
                          {group.organ}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {groupPhonemes.map((p) => {
                          const isSelected = selectedPhoneme.devanagari === p.devanagari;
                          return (
                            <button
                              key={p.devanagari}
                              type="button"
                              onClick={() => handlePhonemeClick(p)}
                              className={`p-2 min-w-[48px] rounded-lg border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-2xs'
                                  : 'bg-white hover:bg-[#F5EFEB] border-[#E0D8CA] text-[#1C1917]'
                              }`}
                            >
                              <div className="font-devanagari font-bold text-base">
                                {p.devanagari}
                              </div>
                              <div className={`text-[11px] font-mono-code ${isSelected ? 'text-amber-200' : 'text-[#8C4A2F]'}`}>
                                {p.iast}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right / Bottom (4 cols): Selected Phoneme Inspector */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl space-y-5 sticky top-20">
            
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Varṇa Inspector</span>
              </span>

              <button
                type="button"
                onClick={() => handlePronounce(selectedPhoneme.devanagari)}
                className="p-1.5 text-[#57534E] hover:text-[#8C4A2F] hover:bg-white rounded-lg border border-[#E8E1D5] cursor-pointer"
                title="Pronounce phoneme"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Big Phoneme Display */}
            <div className="text-center py-2 bg-white rounded-xl border border-[#E8E1D5]">
              <span className="font-devanagari font-bold text-5xl text-[#1C1917] block">
                {selectedPhoneme.devanagari}
              </span>
              <span className="font-mono-code text-base text-[#8C4A2F] font-semibold mt-1 block">
                {selectedPhoneme.iast}
              </span>
              <span className="text-xs text-[#78716C] capitalize">
                {selectedPhoneme.type} · {selectedPhoneme.sanskritName}
              </span>
            </div>

            {/* Articulation Parameters */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D5]">
                <span className="font-semibold text-[#8C4A2F] block mb-0.5">
                  स्थान (Place of Articulation):
                </span>
                <span className="text-[#1C1917]">{selectedPhoneme.placeOfArticulation}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D5]">
                <span className="font-semibold text-[#8C4A2F] block mb-0.5">
                  करण / अङ्ग (Active Articulatory Organ):
                </span>
                <span className="text-[#1C1917]">{selectedPhoneme.organ}</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#E8E1D5]">
                <span className="font-semibold text-[#8C4A2F] block mb-0.5">
                  प्रयत्न (Internal Effort):
                </span>
                <span className="text-[#1C1917]">{selectedPhoneme.manner}</span>
              </div>
            </div>

            {/* Dictionary Words Containing Phoneme */}
            <div className="pt-2 border-t border-[#E8E1D5]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#57534E] block mb-2">
                Lexicon Words with "{selectedPhoneme.devanagari}":
              </span>

              <div className="space-y-1.5">
                {matchingWords.slice(0, 4).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      if (onSelectWord) onSelectWord(entry.devanagari);
                      setSelectedTokenBySurface(entry.devanagari);
                    }}
                    className="w-full p-2 bg-white hover:bg-[#F2ECE1] border border-[#E8E1D5] rounded-lg text-left transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <span className="font-devanagari font-bold text-[#1C1917] group-hover:text-[#8C4A2F]">
                        {entry.devanagari}
                      </span>
                      <span className="text-[10px] text-[#78716C] ml-1.5 font-mono-code">
                        ({entry.iast})
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-[#8C4A2F] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
