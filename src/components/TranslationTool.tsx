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
  Search
} from 'lucide-react';

interface TranslationToolProps {
  onWordClick?: (word: string) => void;
}

export const TranslationTool: React.FC<TranslationToolProps> = ({ onWordClick }) => {
  const sampleSentences = useMemo(() => {
    return SANSKRIT_TRANSLATIONS.filter(t => t.type === 'sentence' || t.type === 'phrase').map(t => ({
      id: t.id,
      label: t.sanskrit.length > 22 ? t.sanskrit.slice(0, 18) + '...' : t.sanskrit,
      text: t.sanskrit
    }));
  }, []);

  const [inputText, setInputText] = useState(
    () => sampleSentences[0]?.text || 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।'
  );
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>('hindi');
  const [result, setResult] = useState<TranslationResultOutput>(() =>
    translateSanskrit(sampleSentences[0]?.text || 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।', 'hindi')
  );

  const handleTranslate = (textToTranslate: string = inputText, lang: TargetLanguage = targetLanguage) => {
    if (!textToTranslate.trim()) return;
    const res = translateSanskrit(textToTranslate, lang);
    setResult(res);
  };

  const handleLanguageChange = (lang: TargetLanguage) => {
    setTargetLanguage(lang);
    if (inputText.trim()) {
      handleTranslate(inputText, lang);
    }
  };

  const handleSelectSample = (sample: string) => {
    setInputText(sample);
    handleTranslate(sample, targetLanguage);
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
                Sanskrit Multilingual Translation
              </h2>
              <span className="text-xs font-mono-code text-[#8C4A2F] border-l border-[#D6CEBE] pl-2">
                Sanskrit → Hindi | Marathi | English
              </span>
            </div>
            <p className="text-xs text-[#78716C] mt-1">
              Cross-lingual demonstration translating Sanskrit words, phrases, and classical verses into major Indic languages and English.
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
              <span>Sanskrit Input (संस्कृत वाक्य)</span>
            </label>
            <span className="text-xs text-[#A8A29E] font-mono-code">
              {inputText.length} characters
            </span>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="संस्कृत वाक्य यहाँ लिखें... e.g. विद्या ददाति विनयम्"
              rows={4}
              className="w-full p-4 bg-[#FBF9F5] border border-[#E8E1D5] rounded-xl text-xl sm:text-2xl font-devanagari text-[#1C1917] resize-none focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/30 focus:border-[#8C4A2F] transition-all"
            />

            <div className="flex items-center justify-between mt-3">
              
              <button
                type="button"
                onClick={() => setInputText('')}
                className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#1C1917] transition-colors py-1 px-2 rounded hover:bg-[#F2ECE1]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Input</span>
              </button>

              <button
                type="button"
                onClick={() => handleTranslate(inputText, targetLanguage)}
                className="px-5 py-2.5 bg-[#8C4A2F] hover:bg-[#723922] text-white rounded-xl text-sm font-medium shadow-xs transition-colors flex items-center gap-2"
              >
                <span>Translate</span>
                <CornerDownLeft className="w-4 h-4 opacity-80" />
              </button>

            </div>
          </div>

          {/* Quick-Select Sample Sentences */}
          <div className="pt-4 border-t border-[#F2EDE2]">
            <span className="text-xs text-[#78716C] block mb-2 font-medium">
              Try representative classical sentences:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleSentences.map((sample, idx) => (
                <button
                  key={idx}
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
              Sanskrit Machine Translation: Computational Dimensions
            </h3>
            <p className="text-xs text-[#78716C]">
              Why automated Sanskrit translation requires a specialized multi-stage NLP pipeline.
            </p>
          </div>
        </div>

        <p className="text-sm text-[#57534E] leading-relaxed mb-6">
          Automated translation between Sanskrit and modern Indo-Aryan languages (Hindi, Marathi) or English presents unique computational linguistics challenges. Because Sanskrit words are highly inflected and concatenated through Sandhi, a successful Machine Translation (MT) pipeline must resolve several linguistic layers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              1. Sandhi & Tokenization
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Splitting continuous Sanskrit compounds into discrete grammatical words before semantic lookup is possible (e.g. <em>विद्याददाति</em> → <em>विद्या + ददाति</em>).
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              2. Kāraka & Syntactic Parsing
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Mapping non-fixed Sanskrit word order (free word order) into target language subject-verb-object structures (Hindi/Marathi SOV or English SVO).
            </p>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl">
            <h4 className="font-semibold text-sm text-[#1C1917] mb-1">
              3. Word Sense Disambiguation
            </h4>
            <p className="text-[#78716C] leading-relaxed">
              Disambiguating polysemous Sanskrit roots (e.g. <em>धर्म</em> as duty, religion, cosmic order, or intrinsic virtue) based on literary context.
            </p>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-[#F2EDE2] text-[11px] text-[#A8A29E] font-mono-code">
          * Notice: The above translation engine is an educational baseline demonstration powered by structured lexical pairs and rule-based glosses.
        </div>
      </div>

    </div>
  );
};
