import React, { useState, useMemo } from 'react';
import { 
  devanagariToIast, 
  iastToDevanagari 
} from '../lib/transliteration';
import { getFeaturedWords } from '../lib/dictionary';
import { PhonologicalMap } from './PhonologicalMap';
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { 
  Copy, 
  Check, 
  ArrowRightLeft, 
  RotateCcw, 
  Sparkles, 
  Info, 
  BookOpen, 
  Volume2,
  Share2,
  ArrowRight
} from 'lucide-react';

interface TransliterationToolProps {
  onSelectWord?: (word: string) => void;
}

export const TransliterationTool: React.FC<TransliterationToolProps> = ({ onSelectWord }) => {
  const { setInputText: setWorkspaceText, inputText: workspaceText } = useSanskritWorkspace();
  const [mode, setMode] = useState<'dev2iast' | 'iast2dev'>('dev2iast');
  const [inputText, setInputText] = useState(workspaceText || 'धर्मः');
  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(false);

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

  const handleSyncToWorkspace = () => {
    const devanagariResult = mode === 'dev2iast' ? inputText : outputText;
    setWorkspaceText(devanagariResult);
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
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
        <div className="p-6 sm:p-8 bg-[#FAF7F2] border-b border-[#EFE9DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Sanskrit Transliteration Engine
              </h2>
              <span className="text-xs font-mono-code text-[#8C4A2F] border-l border-[#D6CEBE] pl-2">
                IAST Standard (ISO 15919)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 max-w-2xl">
              Deterministic rule-based phonetic converter between Devanagari script and diacritical romanization.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSyncToWorkspace}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#8C4A2F] bg-white hover:bg-[#8C4A2F] hover:text-white border border-[#E8E1D5] rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]"
              title="Apply to entire workspace"
            >
              {synced ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{synced ? 'Synced to Workspace' : 'Sync to Workspace'}</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchMode}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-xl transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#8C4A2F]" />
              <span>
                {mode === 'dev2iast' ? 'Devanagari → IAST' : 'IAST → Devanagari'}
              </span>
            </button>
          </div>
        </div>

        {/* Dual Pane Interactive Conversion Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EFE9DD]">
          
          {/* Input Pane */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#57534E]">
                {mode === 'dev2iast' ? 'Input: Devanagari Script' : 'Input: IAST Romanized'}
              </span>
              <button
                type="button"
                onClick={() => setInputText('')}
                className="min-h-[36px] px-2 py-1 text-xs text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer rounded-lg hover:bg-[#FAF7F2]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'dev2iast'
                  ? 'संस्कृत शब्द या वाक्य यहाँ लिखें... e.g. धर्मः, विद्या'
                  : 'Enter romanized Sanskrit with IAST... e.g. dharmaḥ, vidyā'
              }
              rows={6}
              className={`w-full p-4 bg-[#FBF9F5] border border-[#E8E1D5] rounded-xl text-xl text-[#1C1917] resize-y focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/30 focus:border-[#8C4A2F] transition-all leading-relaxed ${
                mode === 'dev2iast' ? 'font-devanagari font-medium' : 'font-mono-code'
              }`}
            />

            {/* Quick Benchmark Word Chips */}
            <div className="pt-2">
              <span className="text-xs text-[#78716C] block mb-2 font-medium">
                Try benchmark terms:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleWords.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSample(item.devanagari, item.iast)}
                    className="min-h-[38px] px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#1C1917] border border-[#E5DECF] rounded-lg text-xs font-medium transition-colors font-devanagari cursor-pointer"
                  >
                    {mode === 'dev2iast' ? item.devanagari : item.iast}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Pane */}
          <div className="p-6 sm:p-8 space-y-4 bg-[#FAF7F2]/30 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F]">
                  {mode === 'dev2iast' ? 'Output: Standardized IAST' : 'Output: Devanagari Script'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePronounce(mode === 'dev2iast' ? inputText : outputText)}
                    className="min-h-[40px] min-w-[40px] p-2 text-[#57534E] hover:text-[#8C4A2F] hover:bg-[#FAF7F2] rounded-lg border border-[#E8E1D5] transition-colors cursor-pointer flex items-center justify-center"
                    title="Pronounce"
                    aria-label="Pronounce transliteration"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1C1917] bg-[#FFFFFF] hover:bg-[#F2ECE1] border border-[#D6CEBE] rounded-lg transition-colors shadow-2xs cursor-pointer"
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
                className={`w-full min-h-[160px] p-4 bg-white border border-[#E8E1D5] rounded-xl text-xl text-[#1C1917] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all ${
                  mode === 'dev2iast' ? 'font-mono-code text-[#8C4A2F]' : 'font-devanagari font-bold text-[#1C1917]'
                }`}
              >
                {outputText || (
                  <span className="text-[#A8A29E] font-normal text-sm font-sans italic">
                    Transliterated text will appear here automatically...
                  </span>
                )}
              </div>
            </div>

            {/* Quick explanation footer */}
            <div className="pt-4 border-t border-[#EFE9DD] flex items-center justify-between text-xs text-[#78716C]">
              <span>ISO 15919 Standard Compliant</span>
              <span>100% Reversible</span>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Phonological Articulation Map */}
      <PhonologicalMap
        initialWord={mode === 'dev2iast' ? inputText : outputText}
        onSelectWord={onSelectWord}
      />

    </div>
  );
};
