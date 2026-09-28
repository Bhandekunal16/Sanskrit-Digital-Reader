import React, { useState, useMemo } from 'react';
import { translateSanskrit, TargetLanguage, TranslationResultOutput } from '../lib/translation';
import { SANSKRIT_TRANSLATIONS } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';
import { TranslationResult } from './TranslationResult';
import { 
  Languages, 
  CornerDownLeft, 
  RotateCcw, 
  Sparkles, 
  Cpu, 
  ArrowRight,
  BookOpen,
  Layers,
  Search,
  Loader2
} from 'lucide-react';

interface TranslationToolProps {
  onWordClick?: (word: string) => void;
}

export const TranslationTool: React.FC<TranslationToolProps> = ({ onWordClick }) => {
  const sampleSentences = useMemo(() => {
    return [
      {
        id: 'asato-ma',
        label: 'असतो मा सद्गमय (Multi-line)',
        text: 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥'
      },
      {
        id: 'vidya-dadati',
        label: 'विद्या ददाति विनयम्',
        text: 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।'
      },
      {
        id: 'ramah-vanam',
        label: 'रामः वनं गच्छति (Dynamic)',
        text: 'रामः वनं गच्छति।\nसीता तेन सह गच्छति।'
      },
      {
        id: 'satyameva',
        label: 'सत्यमेव जयते',
        text: 'सत्यमेव जयते।'
      },
      {
        id: 'gita-karma',
        label: 'कर्मण्येवाधिकारस्ते...',
        text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।'
      },
      {
        id: 'vasudhaiva',
        label: 'वसुधैव कुटुम्बकम्',
        text: 'वसुधैव कुटुम्बकम्।'
      }
    ];
  }, []);

  const [inputText, setInputText] = useState('विद्या ददाति विनयं विनयाद् याति पात्रताम्।');
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('hindi');
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<TranslationResultOutput>(() =>
    translateSanskrit('विद्या ददाति विनयं विनयाद् याति पात्रताम्।', 'hindi')
  );

  const handleTranslate = (textToTranslate: string = inputText, lang: TargetLanguage = targetLanguage) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed) {
      setResult(translateSanskrit('', lang));
      return;
    }

    setIsTranslating(true);
    // Instantaneous client-side tokenizer & translation engine calculation
    setTimeout(() => {
      const res = translateSanskrit(trimmed, lang);
      setResult(res);
      setIsTranslating(false);
    }, 120);
  };

  const handleLanguageChange = (lang: TargetLanguage) => {
    setTargetLanguage(lang);
    if (inputText.trim()) {
      handleTranslate(inputText, lang);
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    handleTranslate(sampleText, targetLanguage);
  };

  const handleClear = () => {
    setInputText('');
    setResult(translateSanskrit('', targetLanguage));
  };

  return (
    <div className="space-y-8">
      
      {/* Translation Input & Controls Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-6 bg-[#FAF7F2] border-b border-[#EFE9DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
                Sanskrit Multilingual Translation Engine
              </h2>
              <span className="text-xs font-mono-code text-[#8C4A2F] border-l border-[#D6CEBE] pl-2">
                Multi-Line & Dynamic Lexical Parser
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-1">
              Translates arbitrary Sanskrit sentences, multi-line verses, and single words into Hindi, Marathi, and English using multi-tier sentence and tokenized lexical glossing.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#57534E] hidden sm:inline">
              Translate To:
            </span>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Input Textarea Workspace */}
        <div className="p-6 sm:p-8 space-y-4">
          
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#57534E] flex items-center gap-1.5">
              <span>Sanskrit Input (संस्कृत वाक्य / श्लोक)</span>
            </label>
            <span className="text-xs text-[#A8A29E] font-mono-code">
              {inputText.length} chars · {inputText.split('\n').filter(Boolean).length || 0} lines
            </span>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="संस्कृत वाक्य यहाँ लिखें (Single line or multi-line verses)...&#10;e.g.&#10;असतो मा सद्गमय ।&#10;तमसो मा ज्योतिर्गमय ।"
              rows={5}
              className="w-full p-4 bg-[#FBF9F5] border border-[#E8E1D5] rounded-xl text-lg sm:text-xl font-devanagari text-[#1C1917] resize-y focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/30 focus:border-[#8C4A2F] transition-all leading-relaxed"
            />

            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors py-1.5 px-2.5 rounded-lg hover:bg-[#F2ECE1] border border-[#E8E1D5]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Input</span>
              </button>

              <button
                type="button"
                disabled={isTranslating || !inputText.trim()}
                onClick={() => handleTranslate(inputText, targetLanguage)}
                className="px-6 py-2.5 bg-[#8C4A2F] hover:bg-[#723922] disabled:opacity-50 text-white rounded-xl text-sm font-medium shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <span>Translate</span>
                    <CornerDownLeft className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Quick-Select Sample Sentences */}
          <div className="pt-4 border-t border-[#F2EDE2]">
            <span className="text-xs text-[#78716C] block mb-2 font-medium">
              Try sample classical verses & dynamic sentences:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleSentences.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.text)}
                  className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0EAE0] text-[#1C1917] border border-[#E5DECF] rounded-lg text-xs font-medium transition-colors font-devanagari hover:border-[#8C4A2F]/40"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Translation Result Card */}
      <TranslationResult
        result={result}
        targetLanguage={targetLanguage}
        onLanguageChange={handleLanguageChange}
        onWordClick={onWordClick}
      />

      {/* Educational Section: The Machine Translation Challenge for Sanskrit */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
              Sanskrit Machine Translation Pipeline Architecture
            </h3>
            <p className="text-xs text-[#78716C]">
              How the multi-tier engine processes user input from tokenization to lexical glossing.
            </p>
          </div>
        </div>

        <p className="text-sm text-[#57534E] leading-relaxed mb-6">
          Automated translation between Sanskrit and modern Indo-Aryan languages (Hindi, Marathi) or English operates through a tiered computational linguistics pipeline:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              1. Multi-Line Tokenization
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Splits arbitrary user text into structured line arrays, preserves verse meter, separates punctuation (`।`, `॥`), and normalizes combining diacritics.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              2. Morphological Stem Matching
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Resolves inflected surface word forms (e.g. <em>असतो</em> → <em>असत्</em>, <em>गच्छति</em> → <em>गम्</em>) to find root lemmas in the dictionary dataset.
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              3. Multi-Lingual Gloss Assembly
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Generates synchronized Hindi, Marathi, and English multi-line translations and builds the dynamic token-level lexical table.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
