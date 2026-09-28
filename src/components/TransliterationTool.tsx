import React, { useState, useMemo } from 'react';
import { 
  devanagariToIast, 
  iastToDevanagari 
} from '../lib/transliteration';
import { getFeaturedWords } from '../lib/dictionary';
import { PhonologicalMap } from './PhonologicalMap';
import { 
  Copy, 
  Check, 
  ArrowRightLeft, 
  RotateCcw, 
  Sparkles, 
  Info, 
  BookOpen, 
  Volume2 
} from 'lucide-react';

interface TransliterationToolProps {
  onSelectWord?: (word: string) => void;
}

export const TransliterationTool: React.FC<TransliterationToolProps> = ({ onSelectWord }) => {
  const [mode, setMode] = useState<'dev2iast' | 'iast2dev'>('dev2iast');
  const [inputText, setInputText] = useState('धर्मः');
  const [copied, setCopied] = useState(false);
  const [showChart, setShowChart] = useState(true);

  const sampleWords = useMemo(() => getFeaturedWords(8), []);

  // Perform active transliteration
  const outputText = useMemo(() => {
    if (mode === 'dev2iast') {
      return devanagariToIast(inputText);
    } else {
      return iastToDevanagari(inputText);
    }
  }, [mode, inputText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchMode = () => {
    setMode((prev) => (prev === 'dev2iast' ? 'iast2dev' : 'dev2iast'));
    setInputText(outputText || 'dharmaḥ');
  };

  const handlePronounce = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectSample = (dev: string, iast: string) => {
    if (mode === 'dev2iast') {
      setInputText(dev);
    } else {
      setInputText(iast);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Tool Container */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-6 bg-[#FAF7F2] border-b border-[#EFE9DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
                Sanskrit Transliteration Engine
              </h2>
              {/* Clean editorial label - NO PILL BADGE */}
              <span className="text-xs font-mono-code text-[#8C4A2F] border-l border-[#D6CEBE] pl-2">
                IAST Standard (ISO 15919)
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-1">
              Deterministic rule-based phonetic converter between Devanagari script and diacritical romanization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwitchMode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#8C4A2F]" />
              <span>
                {mode === 'dev2iast' ? 'Devanagari → IAST' : 'IAST → Devanagari'}
              </span>
            </button>
            <button
              onClick={() => setInputText('')}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#F2ECE1] rounded-lg transition-colors border border-[#E8E1D5]"
              title="Clear input"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input / Output Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EFE9DD]">
          
          {/* Source Input Column */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#57534E]">
                  {mode === 'dev2iast' ? 'Source Script (Devanagari / देवनागरी)' : 'Source Romanization (IAST)'}
                </label>
                <span className="text-xs text-[#A8A29E] font-mono-code">
                  {inputText.length} characters
                </span>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'dev2iast' ? 'Enter Sanskrit text in Devanagari, e.g. धर्मः रक्षति रक्षितः' : 'Enter IAST, e.g. dharmaḥ rakṣati rakṣitaḥ'}
                rows={5}
                className={`w-full p-4 bg-[#FBF9F5] border border-[#E8E1D5] rounded-xl text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/30 focus:border-[#8C4A2F] transition-all text-[#1C1917] ${
                  mode === 'dev2iast' ? 'font-devanagari text-xl sm:text-2xl' : 'font-mono-code text-base'
                }`}
              />
            </div>

            {/* Quick Sample Words from Shared Dictionary */}
            <div className="mt-4 pt-4 border-t border-[#F2EDE2]">
              <span className="text-xs text-[#78716C] block mb-2 font-medium">
                Try standard benchmark words:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleWords.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample.devanagari, sample.iast)}
                    className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#F0EAE0] border border-[#E5DECF] rounded text-xs transition-colors text-[#1C1917] font-medium"
                  >
                    <span className="font-devanagari">{sample.devanagari}</span>
                    <span className="text-[#A8A29E] ml-1 font-mono-code">→ {sample.iast}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Output Column */}
          <div className="p-6 bg-[#FAF7F2]/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                  {mode === 'dev2iast' ? 'Transliterated Output (IAST)' : 'Converted Script (Devanagari)'}
                </label>

                <div className="flex items-center gap-1.5">
                  {mode === 'iast2dev' && outputText && (
                    <button
                      onClick={() => handlePronounce(outputText)}
                      className="p-1 text-[#78716C] hover:text-[#8C4A2F] rounded transition-colors"
                      title="Pronounce output"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded transition-colors shadow-2xs"
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

              <div
                className={`w-full min-h-[148px] p-4 bg-[#FFFFFF] border border-[#E8E1D5] rounded-xl text-[#1C1917] select-all overflow-y-auto ${
                  mode === 'dev2iast'
                    ? 'font-mono-code text-lg sm:text-xl text-[#8C4A2F] font-medium'
                    : 'font-devanagari text-2xl sm:text-3xl text-[#1C1917]'
                }`}
              >
                {outputText || (
                  <span className="text-[#A8A29E] font-sans text-sm italic font-normal">
                    Transliteration will appear here automatically...
                  </span>
                )}
              </div>
            </div>

            {/* Phonetic Note */}
            <div className="mt-4 pt-4 border-t border-[#F2EDE2] text-xs text-[#78716C] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#8C4A2F] shrink-0 mt-0.5" />
              <p>
                <strong>Scientific Transliteration:</strong> IAST accurately captures vowel length (ā, ī, ū, ṝ), retroflex stops (ṭ, ḍ, ṇ), palatals (c, j, ñ), sibilants (ś, ṣ, s), anusvāra (ṃ), and visarga (ḥ) without phonetic ambiguity.
              </p>
            </div>

          </div>

        </div>

        {/* Engine Toggle Banner */}
        <div className="px-6 py-3 bg-[#F5EFEB] border-t border-[#EAE3D6] text-xs text-[#78716C] flex items-center justify-between">
          <span>
            <strong>Interactive Phonological Map:</strong> Linked to the central Sanskrit linguistic data model.
          </span>
          <button
            onClick={() => setShowChart(!showChart)}
            className="text-[#8C4A2F] hover:underline font-medium text-xs ml-2 whitespace-nowrap"
          >
            {showChart ? 'Hide Phonological Map' : 'Show Sanskrit Phonological Map'}
          </button>
        </div>

      </div>

      {/* Dynamic Phonological Map Module */}
      {showChart && (
        <PhonologicalMap
          initialWord={mode === 'dev2iast' ? inputText : outputText || 'धर्मः'}
          onSelectWord={(word) => {
            if (onSelectWord) {
              onSelectWord(word);
            } else {
              setInputText(mode === 'dev2iast' ? word : devanagariToIast(word));
            }
          }}
        />
      )}

    </div>
  );
};

