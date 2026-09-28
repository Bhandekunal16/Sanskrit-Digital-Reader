import React, { useState } from 'react';
import { SANSKRIT_PASSAGES, SanskritPassage, PassageWordToken } from '../data/passages';
import { TargetLanguage } from '../lib/translation';
import { LanguageSelector } from './LanguageSelector';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  GitFork, 
  Layers, 
  ArrowRight,
  Info,
  CheckCircle2,
  ListOrdered,
  Globe
} from 'lucide-react';

export const SanskritReader: React.FC = () => {
  const [selectedPassageId, setSelectedPassageId] = useState<string>('vidya-subhashita');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('hindi');
  const [selectedToken, setSelectedToken] = useState<PassageWordToken | null>(
    SANSKRIT_PASSAGES[0].tokens[0][0] // Default to first word 'विद्या'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnvaya, setShowAnvaya] = useState(false);

  const currentPassage = SANSKRIT_PASSAGES.find(p => p.id === selectedPassageId) || SANSKRIT_PASSAGES[0];

  const handleSelectPassage = (passage: SanskritPassage) => {
    setSelectedPassageId(passage.id);
    // Select first non-punctuation token
    const firstWord = passage.tokens[0].find(t => !t.isPunctuation) || null;
    setSelectedToken(firstWord);
  };

  const handlePronounce = (text: string, langCode: string = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getPassageTranslation = () => {
    switch (targetLanguage) {
      case 'hindi':
        return currentPassage.translationHindi;
      case 'marathi':
        return currentPassage.translationMarathi;
      case 'english':
      default:
        return currentPassage.translation;
    }
  };

  const getTokenMeaning = (token: PassageWordToken) => {
    switch (targetLanguage) {
      case 'hindi':
        return token.meaningHindi || token.meaning;
      case 'marathi':
        return token.meaningMarathi || token.meaning;
      case 'english':
      default:
        return token.meaning;
    }
  };

  const getLanguageLabel = () => {
    switch (targetLanguage) {
      case 'hindi': return 'Hindi (हिन्दी)';
      case 'marathi': return 'Marathi (मराठी)';
      case 'english': return 'English';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Passage Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
            Select Curated Text:
          </span>
        </div>

        {/* Interactive passage selector tabs */}
        <div className="flex flex-wrap gap-2">
          {SANSKRIT_PASSAGES.map((passage) => {
            const isActive = passage.id === currentPassage.id;
            return (
              <button
                key={passage.id}
                onClick={() => handleSelectPassage(passage)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2C241E] text-white shadow-xs'
                    : 'bg-[#FFFFFF] text-[#57534E] hover:bg-[#F2ECE1] border border-[#E0D8CA]'
                }`}
              >
                {passage.title.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Reader Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Top (7 cols): Sanskrit Text Display */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            
            {/* Passage Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
                  {currentPassage.title}
                </h3>
                {/* Unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-[#78716C] mt-1">
                  <span>{currentPassage.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>Meter: {currentPassage.meter}</span>
                </div>
              </div>

              <button
                onClick={() => handlePronounce(currentPassage.lines.join(' '))}
                className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5] shrink-0"
                title="Listen to full verse recitation"
                aria-label="Listen to full verse recitation"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-[#8C4A2F]' : ''}`} />
              </button>
            </div>

            {/* Interactive Sanskrit Words Grid */}
            <div className="p-6 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl my-4">
              <div className="space-y-4">
                {currentPassage.tokens.map((lineTokens, lineIdx) => (
                  <div key={lineIdx} className="flex flex-wrap items-center gap-x-2.5 gap-y-2 leading-relaxed">
                    {lineTokens.map((token, tokenIdx) => {
                      if (token.isPunctuation) {
                        return (
                          <span key={tokenIdx} className="font-devanagari text-2xl sm:text-3xl text-[#8C4A2F] font-bold px-0.5">
                            {token.word}
                          </span>
                        );
                      }

                      const isSelected = selectedToken?.word === token.word && selectedToken?.grammar === token.grammar;

                      return (
                        <button
                          key={tokenIdx}
                          type="button"
                          onClick={() => setSelectedToken(token)}
                          className={`group relative px-2.5 py-1 rounded-md font-devanagari text-2xl sm:text-3xl font-medium transition-all focus:outline-none ${
                            isSelected
                              ? 'bg-[#8C4A2F] text-white shadow-xs ring-2 ring-[#8C4A2F]/40'
                              : 'text-[#1C1917] hover:bg-[#EFE7D8] hover:text-[#8C4A2F]'
                          }`}
                        >
                          <span>{token.word}</span>
                          {/* Subtle hover underline */}
                          <span className={`absolute bottom-0 left-1 right-1 h-0.5 transition-opacity ${
                            isSelected ? 'bg-white/80' : 'bg-transparent group-hover:bg-[#8C4A2F]/40'
                          }`} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-[#A8A29E] mt-4 pt-3 border-t border-[#E8E1D5]/60 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Click on any word to inspect its morphological case, root (dhātu), and multilingual translation.</span>
              </p>
            </div>

            {/* Dynamic Passage Translation Deck with Language Selector */}
            <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{getLanguageLabel()} Translation</span>
                </span>

                {/* Reader Language Switcher */}
                <LanguageSelector
                  selectedLanguage={targetLanguage}
                  onLanguageChange={setTargetLanguage}
                  className="scale-90 origin-left sm:origin-right"
                />
              </div>

              <p className={`text-lg text-[#292524] leading-relaxed p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl ${
                targetLanguage === 'english' ? 'font-serif-editorial italic' : 'font-devanagari font-medium'
              }`}>
                "{getPassageTranslation()}"
              </p>
            </div>

          </div>

          {/* Anvaya (Prose Order) Accordion / Toggle */}
          <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
            <button
              onClick={() => setShowAnvaya(!showAnvaya)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>View Pāṇinian Prose Order (अन्वयः)</span>
              </span>
              <span className="text-[#8C4A2F]">{showAnvaya ? 'Hide' : 'Show'}</span>
            </button>

            {showAnvaya && (
              <div className="mt-3 p-3.5 bg-[#FBF9F5] border border-[#EAE3D6] rounded-lg">
                <p className="font-devanagari text-base text-[#1C1917] leading-relaxed">
                  {currentPassage.anvaya}
                </p>
                <p className="text-xs text-[#78716C] mt-2">
                  {currentPassage.explanation}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right / Side (5 cols): Word Morphological & Translation Analysis Panel */}
        <div className="lg:col-span-5 flex flex-col">
          {selectedToken ? (
            <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 shadow-xs flex-1 flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EFE9DD]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C4A2F]">
                    Linguistic Token Inspection
                  </span>
                  <button
                    onClick={() => handlePronounce(selectedToken.word)}
                    className="p-1.5 text-[#78716C] hover:text-[#8C4A2F] rounded transition-colors"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Token Display */}
                <div className="mb-4">
                  <div className="font-devanagari font-bold text-4xl text-[#1C1917]">
                    {selectedToken.word}
                  </div>
                  <div className="font-mono-code text-lg text-[#8C4A2F] font-medium mt-0.5">
                    {selectedToken.iast}
                  </div>
                </div>

                {/* Contextual Meaning in Selected Language */}
                <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-0.5">
                    Meaning ({getLanguageLabel()})
                  </span>
                  <p className={`text-lg text-[#1C1917] font-medium ${
                    targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari'
                  }`}>
                    {getTokenMeaning(selectedToken)}
                  </p>
                </div>

                {/* Grammatical breakdown */}
                <div className="space-y-3">
                  <div className="p-3 bg-[#FBF9F5] border border-[#EAE3D6] rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">
                      <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" />
                      <span>Grammatical Information</span>
                    </div>
                    <p className="text-sm text-[#1C1917] font-medium">
                      {selectedToken.grammar}
                    </p>
                  </div>

                  {selectedToken.root && (
                    <div className="p-3 bg-[#FBF9F5] border border-[#EAE3D6] rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">
                        <GitFork className="w-3.5 h-3.5 text-[#8C4A2F]" />
                        <span>Root / Dhātu (धातु)</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-devanagari font-bold text-lg text-[#1C1917]">
                          {selectedToken.root}
                        </span>
                        {selectedToken.rootIast && (
                          <span className="font-mono-code text-xs text-[#8C4A2F]">
                            ({selectedToken.rootIast})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedToken.sandhiSplit && (
                    <div className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-0.5">
                        Sandhi Resolution (पदच्छेदः)
                      </span>
                      <p className="font-mono-code text-xs text-[#1C1917] bg-white p-1.5 rounded border border-[#E5DECF]">
                        {selectedToken.sandhiSplit}
                      </p>
                    </div>
                  )}
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-[#F2EDE2] text-xs text-[#78716C]">
                Select other words in the verse to see their grammatical inflection and multilingual meanings.
              </div>

            </div>
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 shadow-xs flex-1 flex flex-col items-center justify-center text-center text-[#78716C]">
              <BookOpen className="w-8 h-8 text-[#D6CEBE] mb-2" />
              <p className="text-sm font-medium text-[#1C1917]">No word selected</p>
              <p className="text-xs max-w-xs mt-1">Click on any Sanskrit word token in the reader panel to inspect its morphological analysis.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
