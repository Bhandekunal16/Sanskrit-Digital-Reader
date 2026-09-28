import React, { useState, useMemo } from 'react';
import { useSanskritWorkspace } from '../lib/sanskrit-context';
import { LanguageSelector } from './LanguageSelector';
import { TranslationResult } from './TranslationResult';
import { 
  CornerDownLeft, 
  RotateCcw, 
  Cpu, 
  Sparkles,
  Loader2,
  BookOpen
} from 'lucide-react';

interface TranslationToolProps {
  onWordClick?: (word: string) => void;
}

export const TranslationTool: React.FC<TranslationToolProps> = ({ onWordClick }) => {
  const {
    inputText,
    setInputText,
    targetLanguage,
    setTargetLanguage,
    loadSample,
    resetWorkspace,
    isProcessing,
    setSelectedTokenBySurface
  } = useSanskritWorkspace();

  const [localText, setLocalText] = useState(inputText);

  // Sync local text when global workspace changes
  React.useEffect(() => {
    setLocalText(inputText);
  }, [inputText]);

  const sampleSentences = useMemo(() => {
    return [
      {
        id: 'vidya-subhashita',
        label: 'विद्या ददाति विनयम् (२ पंक्तियाँ)',
        text: 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।\nपात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम्॥'
      },
      {
        id: 'asato-ma',
        label: 'असतो मा सद्गमय (३ पंक्तियाँ)',
        text: 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥'
      },
      {
        id: 'ramah-vanam',
        label: 'रामः वनं गच्छति (सरल संस्कृत)',
        text: 'रामः वनं गच्छति।\nसीता तेन सह गच्छति।'
      },
      {
        id: 'satyameva',
        label: 'सत्यमेव जयते',
        text: 'सत्यमेव जयते नानृतम्।'
      },
      {
        id: 'gita-karma',
        label: 'कर्मण्येवाधिकारस्ते...',
        text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।'
      },
      {
        id: 'vasudhaiva',
        label: 'वसुधैव कुटुम्बकम्',
        text: 'अयं निजः परो वेति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥'
      }
    ];
  }, []);

  const handleApply = (textToApply: string = localText) => {
    setInputText(textToApply);
  };

  const handleSelectSample = (sampleText: string) => {
    setLocalText(sampleText);
    loadSample(sampleText);
  };

  const handleClear = () => {
    setLocalText('');
    resetWorkspace();
  };

  const handleWordClick = (word: string) => {
    setSelectedTokenBySurface(word);
    if (onWordClick) {
      onWordClick(word);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Sanskrit Translation Input Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-[#EFE9DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
                Sanskrit Multilingual Translation Engine
              </h2>
              <span className="text-xs font-mono-code text-[#8C4A2F] border-l border-[#D6CEBE] pl-2">
                Unified Workspace Pipeline
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#78716C] mt-1 leading-relaxed">
              Translates arbitrary Sanskrit verses and individual words into Hindi, Marathi, and English. Updates synchronized workspace state across reader, phonology, and dictionary.
            </p>
          </div>

          {/* Language Selector (Fitts's Law: 44px touch targets) */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#57534E] hidden sm:inline">
              Translate To:
            </span>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
            />
          </div>
        </div>

        {/* Input Textarea Workspace */}
        <div className="p-5 sm:p-8 space-y-4">
          
          <div className="flex items-center justify-between mb-1">
            <label 
              htmlFor="sanskrit-translation-input"
              className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5"
            >
              <span>Sanskrit Input (संस्कृत वाक्य / श्लोक)</span>
            </label>
            <span className="text-xs text-[#A8A29E] font-mono-code">
              {localText.length} chars · {localText.split('\n').filter(Boolean).length || 0} lines
            </span>
          </div>

          <div className="relative">
            <textarea
              id="sanskrit-translation-input"
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              onBlur={() => handleApply(localText)}
              placeholder="संस्कृत वाक्य यहाँ लिखें (Single line or multi-line verses)...&#10;e.g.&#10;असतो मा सद्गमय ।&#10;तमसो मा ज्योतिर्गमय ।"
              rows={5}
              className="w-full p-4 bg-[#FBF9F5] border border-[#E8E1D5] rounded-xl text-lg sm:text-xl font-devanagari text-[#1C1917] resize-y focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]/40 focus-visible:border-[#8C4A2F] transition-all leading-relaxed"
            />

            {/* Action Buttons (Fitts's Law: 44px min-height) */}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2.5">
              
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[44px] px-3.5 py-2 flex items-center gap-1.5 text-xs font-medium text-[#78716C] hover:text-[#1C1917] transition-colors rounded-xl hover:bg-[#F2ECE1] border border-[#E8E1D5] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
                aria-label="Clear translation input"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Clear Input</span>
              </button>

              <button
                type="button"
                disabled={isProcessing || !localText.trim()}
                onClick={() => handleApply(localText)}
                className="min-h-[44px] px-6 py-2.5 bg-[#8C4A2F] hover:bg-[#723922] disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Translate & Analyze</span>
                    <CornerDownLeft className="w-4 h-4 opacity-80" aria-hidden="true" />
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Quick-Select Sample Sentences (Fitts's Law: Easy to tap) */}
          <div className="pt-4 border-t border-[#F2EDE2]">
            <span className="text-xs text-[#78716C] block mb-2.5 font-medium">
              Try benchmark classical verses & multi-line inputs:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleSentences.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.text)}
                  className="min-h-[38px] px-3 py-2 bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#1C1917] border border-[#E5DECF] rounded-lg text-xs font-medium transition-colors font-devanagari hover:border-[#8C4A2F]/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 2. Translation Result Card */}
      <TranslationResult onWordClick={handleWordClick} />

      {/* 3. Educational Technical Section: Gestalt Grouped Information */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
              Sanskrit Machine Translation Pipeline Architecture
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C]">
              How the multi-tier engine processes user input from tokenization to lexical glossing.
            </p>
          </div>
        </div>

        <p className="text-sm text-[#57534E] leading-relaxed mb-6">
          Automated translation between Sanskrit and modern Indo-Aryan languages (Hindi, Marathi) or English operates through a tiered computational linguistics pipeline:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-1.5">
            <h4 className="font-semibold text-sm text-[#1C1917]">
              1. Multi-Line Tokenization
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Splits arbitrary user text into structured line arrays, preserves verse meter, separates punctuation (`।`, `॥`), and normalizes combining diacritics.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-1.5">
            <h4 className="font-semibold text-sm text-[#1C1917]">
              2. Morphological Stem & Sandhi Analysis
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Resolves inflected surface word forms (e.g. <em>असतो</em> → <em>असत्</em>, <em>गच्छति</em> → <em>गम्</em>) and segmented compounds.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl space-y-1.5">
            <h4 className="font-semibold text-sm text-[#1C1917]">
              3. Multi-Lingual Gloss Assembly
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Generates synchronized Hindi, Marathi, and English multi-line translations and builds the transparent token-level lexical table with exact source confidence.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
