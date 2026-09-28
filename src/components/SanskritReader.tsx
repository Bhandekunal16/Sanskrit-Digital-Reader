import React, { useState, useMemo } from 'react';
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { SANSKRIT_PASSAGES, SanskritPassage } from '../data/passages';
import { TargetLanguage } from '../lib/translation';
import { LanguageSelector } from './LanguageSelector';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  GitFork, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Info, 
  CheckCircle2, 
  ListOrdered, 
  Globe, 
  ExternalLink, 
  Activity,
  RotateCcw,
  Compass,
  FileText
} from 'lucide-react';

interface SanskritReaderProps {
  onSelectWordForDictionary?: (word: string) => void;
}

export const SanskritReader: React.FC<SanskritReaderProps> = ({ onSelectWordForDictionary }) => {
  const {
    inputText,
    document,
    selectedTokenId,
    selectedToken,
    selectedLineIndex,
    setSelectedTokenId,
    setSelectedTokenBySurface,
    setSelectedLineIndex,
    targetLanguage,
    setTargetLanguage,
    loadSample
  } = useSanskritWorkspace();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnvaya, setShowAnvaya] = useState(false);
  const [readerMode, setReaderMode] = useState<'workspace' | 'curated'>('workspace');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('vidya-subhashita');

  const currentPassage = SANSKRIT_PASSAGES.find(p => p.id === selectedPassageId) || SANSKRIT_PASSAGES[0];

  const handleSelectPassage = (passage: SanskritPassage) => {
    setSelectedPassageId(passage.id);
    loadSample(passage.lines.join('\n'));
    setReaderMode('workspace');
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

  const currentLine = document.lines[selectedLineIndex] || document.lines[0];

  const handlePrevLine = () => {
    if (selectedLineIndex > 0) {
      setSelectedLineIndex(selectedLineIndex - 1);
    }
  };

  const handleNextLine = () => {
    if (selectedLineIndex < document.lines.length - 1) {
      setSelectedLineIndex(selectedLineIndex + 1);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Passage Selector Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
            Curated Classical Passages:
          </span>
        </div>

        {/* Interactive passage selector tabs */}
        <div className="flex flex-wrap gap-2">
          {SANSKRIT_PASSAGES.map((passage) => {
            const isActive = inputText === passage.lines.join('\n') || selectedPassageId === passage.id;
            return (
              <button
                key={passage.id}
                type="button"
                onClick={() => handleSelectPassage(passage)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                  Classical Reading Canvas
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                  Interactive Multi-Line Reader
                </h2>
                <p className="text-xs text-[#78716C] mt-1">
                  Click any Sanskrit token to inspect its Sandhi segmentation, grammatical case, and place of articulation.
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnvaya(!showAnvaya)}
                  className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    showAnvaya 
                      ? 'bg-[#FAF7F2] border-[#8C4A2F] text-[#8C4A2F]' 
                      : 'bg-white border-[#E0D8CA] text-[#57534E] hover:bg-[#F2ECE1]'
                  }`}
                  title="Toggle Anvaya Prose Order"
                >
                  <ListOrdered className="w-4 h-4" />
                  <span className="hidden sm:inline">Anvaya</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePronounce(document.rawText)}
                  className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E0D8CA] cursor-pointer"
                  title="Recite entire text"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Line Navigation Bar */}
            {document.lines.length > 1 && (
              <div className="mb-4 p-2.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#57534E]">Line Navigation:</span>
                  <span className="font-mono-code text-[#8C4A2F] bg-white px-2 py-0.5 rounded border border-[#E0D8CA]">
                    Line {selectedLineIndex + 1} of {document.lines.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={selectedLineIndex === 0}
                    onClick={handlePrevLine}
                    className="p-1 px-2 bg-white disabled:opacity-40 border border-[#E0D8CA] rounded hover:bg-[#F5EFEB] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedLineIndex >= document.lines.length - 1}
                    onClick={handleNextLine}
                    className="p-1 px-2 bg-white disabled:opacity-40 border border-[#E0D8CA] rounded hover:bg-[#F5EFEB] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Sanskrit Verse Display (Multi-Line Preserved) */}
            <div className="p-6 bg-[#FAF7F2]/60 rounded-xl border border-[#EAE3D6] mb-6 space-y-4">
              {document.lines.map((line, lineIdx) => {
                const isLineActive = selectedLineIndex === lineIdx;
                return (
                  <div
                    key={lineIdx}
                    onClick={() => setSelectedLineIndex(lineIdx)}
                    className={`p-3 rounded-lg transition-all cursor-pointer ${
                      isLineActive 
                        ? 'bg-white shadow-2xs border border-[#8C4A2F]/30 ring-1 ring-[#8C4A2F]/20' 
                        : 'hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 leading-loose">
                      {line.tokens.map((token) => {
                        if (token.isPunctuation) {
                          return (
                            <span
                              key={token.id}
                              className="font-devanagari font-bold text-xl sm:text-2xl text-[#8C4A2F]"
                            >
                              {token.punctuationAfter || token.surface}
                            </span>
                          );
                        }

                        const isTokenSelected = selectedTokenId === token.id || selectedTokenId === token.clean;

                        return (
                          <button
                            key={token.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTokenId(token.id);
                              setSelectedLineIndex(lineIdx);
                            }}
                            className={`px-2 py-1 rounded-md font-devanagari font-bold text-xl sm:text-2xl transition-all cursor-pointer ${
                              isTokenSelected
                                ? 'bg-[#8C4A2F] text-white shadow-xs scale-105'
                                : 'text-[#1C1917] hover:bg-[#EAE3D6] hover:text-[#8C4A2F]'
                            }`}
                          >
                            {token.surface}
                          </button>
                        );
                      })}
                    </div>

                    <div className="font-mono-code text-xs text-[#8C4A2F] mt-1">
                      {line.sourceIast}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Anvaya (Prose Order) Card if active */}
            {showAnvaya && (
              <div className="p-4 bg-[#FFFFFF] border border-[#EAE3D6] rounded-xl mb-6 space-y-2">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>अन्वयः (Pāṇinian Natural Prose Order)</span>
                </div>
                <p className="font-devanagari text-base text-[#1C1917] leading-relaxed">
                  {document.allTokens.map(t => t.surface).join(' ')}
                </p>
              </div>
            )}

          </div>

          {/* Passage Translation Section */}
          <div className="pt-6 border-t border-[#EAE3D6]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E]">
                Full Translation
              </span>
              <LanguageSelector
                selectedLanguage={targetLanguage}
                onLanguageChange={setTargetLanguage}
              />
            </div>

            <p className={`text-base sm:text-lg text-[#1C1917] leading-relaxed whitespace-pre-line ${
              targetLanguage === 'english' ? 'font-serif-editorial' : 'font-devanagari'
            }`}>
              {targetLanguage === 'hindi'
                ? document.translations.hindi
                : targetLanguage === 'marathi'
                ? document.translations.marathi
                : document.translations.english}
            </p>
          </div>

        </div>

        {/* Right / Bottom (5 cols): Token Detailed Inspector Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 shadow-xs sticky top-20 space-y-5">
            
            <div className="flex items-center justify-between border-b border-[#EFE9DD] pb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selected Token Inspector</span>
              </span>
              {selectedToken && (
                <span className="text-[10px] font-mono-code bg-[#FAF7F2] text-[#78716C] px-2 py-0.5 rounded border border-[#E8E1D5]">
                  {selectedToken.confidence}
                </span>
              )}
            </div>

            {selectedToken ? (
              <div className="space-y-4">
                
                {/* Surface and IAST Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-devanagari font-bold text-3xl text-[#1C1917]">
                      {selectedToken.surface}
                    </h3>
                    <span className="font-mono-code text-sm text-[#8C4A2F]">
                      {selectedToken.iast}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePronounce(selectedToken.clean || selectedToken.surface)}
                    className="p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-lg border border-[#E8E1D5] cursor-pointer"
                    title="Pronounce word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Multilingual Meanings */}
                <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
                    Lexical Meanings
                  </span>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#8C4A2F] min-w-[50px]">Hindi:</span>
                      <span className="font-devanagari text-[#1C1917]">
                        {selectedToken.meanings.hindi || '—'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#8C4A2F] min-w-[50px]">Marathi:</span>
                      <span className="font-devanagari text-[#1C1917]">
                        {selectedToken.meanings.marathi || '—'}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#8C4A2F] min-w-[50px]">English:</span>
                      <span className="font-serif-editorial text-[#1C1917]">
                        {selectedToken.meanings.english || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sandhi & Compound Split Card */}
                {selectedToken.sandhi && selectedToken.sandhi.isCompound && (
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-[#8C4A2F]" />
                        <span>Sandhi & Compound Split</span>
                      </span>
                      <span className="text-[10px] font-mono-code text-[#8C4A2F] bg-white px-1.5 py-0.5 rounded border border-[#E0D8CA]">
                        {selectedToken.sandhi.confidence}
                      </span>
                    </div>

                    <div className="font-devanagari font-semibold text-sm text-[#1C1917]">
                      {selectedToken.sandhi.possibleSplit.join(' + ')}
                    </div>
                    <div className="text-[11px] text-[#8C4A2F] font-medium">
                      {selectedToken.sandhi.sanskritTerm} ({selectedToken.sandhi.ruleName})
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {selectedToken.sandhi.explanation}
                    </p>
                  </div>
                )}

                {/* Grammatical and Root Analysis */}
                {selectedToken.grammar && (
                  <div className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
                      Grammatical Form (व्याकरणम्)
                    </span>
                    <p className="text-xs text-[#1C1917] leading-relaxed">
                      {selectedToken.grammar}
                    </p>
                    {selectedToken.root && (
                      <div className="text-xs text-[#8C4A2F] pt-1">
                        <strong>Root (धातु):</strong> {selectedToken.root} {selectedToken.rootIast && `(${selectedToken.rootIast})`}
                      </div>
                    )}
                  </div>
                )}

                {/* Live Phonological Breakdown for Token */}
                {selectedToken.phonology && selectedToken.phonology.phonemes.length > 0 && (
                  <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#8C4A2F]" />
                      <span>Phoneme Articulation (स्थानम्)</span>
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {selectedToken.phonology.phonemes.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-white border border-[#E0D8CA] rounded text-[10px] font-mono-code"
                          title={`${p.groupName}: ${p.placeOfArticulation}`}
                        >
                          <span className="font-devanagari font-bold">{p.grapheme}</span> ({p.iast})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-Link to Dictionary */}
                {onSelectWordForDictionary && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectWordForDictionary(selectedToken.clean || selectedToken.surface)}
                      className="w-full py-2.5 px-3 bg-[#FAF7F2] hover:bg-[#8C4A2F] text-[#8C4A2F] hover:text-white border border-[#E8E1D5] hover:border-[#8C4A2F] rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Explore "{selectedToken.clean || selectedToken.surface}" in Digital Lexicon</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#78716C]">
                Click any Sanskrit token in the reader to view its grammatical analysis.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
