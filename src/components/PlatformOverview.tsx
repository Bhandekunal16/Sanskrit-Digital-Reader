import React, { useState } from 'react';
import { Link } from '../lib/router';
import { 
  ScrollText, 
  BookOpen, 
  ArrowRightLeft, 
  Globe, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  CheckCircle2,
  Volume2,
  BookMarked,
  GraduationCap
} from 'lucide-react';

interface PlatformOverviewProps {
  onStartReading?: () => void;
}

export const PlatformOverview: React.FC<PlatformOverviewProps> = ({ onStartReading }) => {
  const [activePreviewLang, setActivePreviewLang] = useState<'hi' | 'mr' | 'en'>('hi');
  const [selectedPreviewToken, setSelectedPreviewToken] = useState<string | null>(null);

  const previewTranslations: Record<'hi' | 'mr' | 'en', { label: string; text: string; note: string }> = {
    hi: {
      label: 'हिन्दी (Hindi)',
      text: 'मुझे असत्य से सत्य की ओर ले चलो, अंधकार से प्रकाश की ओर ले चलो।',
      note: 'शाश्वत उपनिषद् प्रार्थना'
    },
    mr: {
      label: 'मराठी (Marathi)',
      text: 'मला असत्याकडून सत्याकडे ने, अंधाराकडून प्रकाशाकडे ने.',
      note: 'अन्वयाधारित मराठी भाषांतर'
    },
    en: {
      label: 'English',
      text: 'Lead me from the unreal to the real, lead me from darkness to light.',
      note: 'Classical Upaniṣadic Invocation'
    }
  };

  const previewTokens = [
    { devanagari: 'असतः', iast: 'asataḥ', meaning: 'from falsehood / unreal', pos: 'Noun · Ablative Sing.' },
    { devanagari: 'मा', iast: 'mā', meaning: 'me / myself', pos: 'Pronoun · Accusative' },
    { devanagari: 'सत्', iast: 'sat', meaning: 'towards truth / reality', pos: 'Noun · Accusative Sing.' },
    { devanagari: 'गमय', iast: 'gamaya', meaning: 'lead / cause to go', pos: 'Verb · Causative Imperative' },
  ];

  const pipelineSteps = [
    { label: 'Sanskrit Text', desc: 'Raw Verse & Corpus' },
    { label: 'Transliteration', desc: 'Devanagari ↔ IAST' },
    { label: 'Dictionary', desc: 'Lexical Knowledge' },
    { label: 'Morphology', desc: 'Dhātu & Vibhakti' },
    { label: 'Translation', desc: 'Hindi · Marathi · English' },
    { label: 'Phonology', desc: 'Sthāna & Prayatna' },
  ];

  return (
    <section aria-labelledby="platform-overview-title" className="space-y-10">
      
      {/* 1. Header & Connected Architecture Banner */}
      <div className="text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider font-semibold text-[#8C4A2F] mb-1.5 justify-center sm:justify-start">
          <span>One Connected Workspace</span>
        </div>
        <h2 id="platform-overview-title" className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight">
          Explore Sanskrit Language Technology
        </h2>
        <p className="text-sm sm:text-base text-[#78716C] mt-2 max-w-3xl leading-relaxed">
          Our digital language tools operate on a shared linguistic pipeline — interconnecting lexical indexing, rule-based morphology, script transliteration, and trilingual translation.
        </p>
      </div>

      {/* 2. Unified Sanskrit Data Pipeline (Subtle Flow) */}
      <div className="p-4 sm:p-5 bg-white border border-[#E8E1D5] rounded-2xl shadow-2xs">
        <div className="text-xs font-mono-code uppercase tracking-widest text-[#78716C] mb-3 flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-[#8C4A2F]" />
          <span>Unified Language Pipeline</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineSteps.map((step, idx) => (
            <div 
              key={step.label}
              className="relative p-2.5 rounded-xl bg-[#FAF8F4] border border-[#EAE2D2] flex flex-col justify-between text-left group hover:border-[#8C4A2F]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono-code font-bold text-[#8C4A2F]">
                  0{idx + 1}
                </span>
                {idx < pipelineSteps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#B0A798] hidden lg:block" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C1917] leading-tight">
                  {step.label}
                </p>
                <p className="text-[10px] text-[#78716C] mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Primary Workspace: Featured Sanskrit Reader */}
      <div className="bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#F5EFE6] border-2 border-[#8C4A2F]/30 hover:border-[#8C4A2F]/60 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Context, Value Proposition & Capabilities */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#8C4A2F]/10 text-[#8C4A2F] text-xs font-mono-code font-bold uppercase tracking-wider">
                <ScrollText className="w-3.5 h-3.5" />
                Primary Interactive Workspace
              </span>
            </div>

            <div>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                Sanskrit Reader
              </h3>
              <p className="text-sm sm:text-base text-[#57534E] mt-2 leading-relaxed">
                Read classical verses with interactive token breakdown, Sandhi resolution, and trilingual verse translations.
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-2 pt-2 border-t border-[#EAE2D2]">
              <span className="text-xs font-mono-code uppercase tracking-wider text-[#78716C] font-semibold block">
                Integrated Capabilities
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2C241E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C4A2F] shrink-0" />
                  <span>Clickable token morphology</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C4A2F] shrink-0" />
                  <span>Trilingual verse rendering</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C4A2F] shrink-0" />
                  <span>Sandhi resolution & splits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C4A2F] shrink-0" />
                  <span>Anvaya prose reconstruction</span>
                </li>
              </ul>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href="/reader"
                onClick={onStartReading}
                className="inline-flex items-center justify-center gap-3 min-h-[48px] px-7 py-3 rounded-xl bg-[#8C4A2F] text-white font-semibold text-base hover:bg-[#723B25] active:scale-[0.99] transition-all shadow-xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#8C4A2F] focus:ring-offset-2"
              >
                <span>Start Reading</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Live Reader Preview */}
          <div className="lg:col-span-6 bg-white border border-[#E0D7C6] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C4A2F] animate-pulse"></span>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#78716C]">
                  Live Reader Preview
                </span>
              </div>
              <span className="text-xs text-[#8C4A2F] font-mono-code">
                Bṛhadāraṇyaka Upaniṣad
              </span>
            </div>

            {/* Sanskrit Verse Display */}
            <div className="bg-[#FAF8F4] border border-[#EAE2D2] rounded-xl p-4 text-center space-y-1.5">
              <p className="font-devanagari text-xl sm:text-2xl font-bold text-[#1C1917] tracking-wide">
                असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ॥
              </p>
              <p className="font-mono-code text-xs sm:text-sm text-[#78716C]">
                asato mā sadgamaya | tamaso mā jyotirgamaya ||
              </p>
            </div>

            {/* Interactive Token Inspection Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code text-[#78716C]">
                  Interactive Tokens (Click to inspect):
                </span>
                {selectedPreviewToken && (
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewToken(null)}
                    className="text-[10px] text-[#8C4A2F] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {previewTokens.map((token) => {
                  const isSelected = selectedPreviewToken === token.devanagari;
                  return (
                    <button
                      key={token.devanagari}
                      type="button"
                      onClick={() => setSelectedPreviewToken(isSelected ? null : token.devanagari)}
                      className={`p-2 rounded-lg text-left transition-all min-h-[44px] cursor-pointer border ${
                        isSelected
                          ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs'
                          : 'bg-white hover:bg-[#F5EFE6] text-[#1C1917] border-[#E8E1D5]'
                      }`}
                    >
                      <div className="font-devanagari font-bold text-xs">
                        {token.devanagari}
                      </div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-white/90' : 'text-[#78716C]'}`}>
                        {token.meaning}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Token Details Drawer (if clicked) */}
              {selectedPreviewToken && (
                <div className="p-2.5 bg-[#FAF7F2] border border-[#EAE2D2] rounded-lg text-xs flex items-center justify-between animate-fade-in">
                  <div>
                    <span className="font-bold text-[#8C4A2F] font-devanagari mr-2">
                      {selectedPreviewToken}
                    </span>
                    <span className="text-[#57534E]">
                      {previewTokens.find(t => t.devanagari === selectedPreviewToken)?.pos}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-code text-[#78716C]">
                    Pāṇinian Analysis
                  </span>
                </div>
              )}
            </div>

            {/* Trilingual Preview Language Selector */}
            <div className="pt-2 border-t border-[#F0EAE1] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#78716C] font-semibold">
                  Translation Preview
                </span>
                <div className="flex items-center gap-1 bg-[#F2EDE2] p-0.5 rounded-lg">
                  {(['hi', 'mr', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActivePreviewLang(lang)}
                      className={`min-h-[32px] px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                        activePreviewLang === lang
                          ? 'bg-white text-[#1C1917] shadow-2xs font-semibold'
                          : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                      aria-label={`Preview in ${lang}`}
                    >
                      {lang === 'hi' ? 'Hindi' : lang === 'mr' ? 'Marathi' : 'English'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F4] border border-[#EAE2D2] rounded-xl">
                <p className="text-xs sm:text-sm font-medium text-[#1C1917] leading-relaxed">
                  "{previewTranslations[activePreviewLang].text}"
                </p>
                <p className="text-[10px] text-[#8C4A2F] mt-1 font-mono-code">
                  {previewTranslations[activePreviewLang].note}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Secondary Module Grid (Consistent Information Architecture) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Module 1: Digital Lexicon */}
        <div className="bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl p-6 shadow-2xs transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8C4A2F] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3D6]">
                Dictionary
              </span>
            </div>

            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                Digital Lexicon
              </h3>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Explore Sanskrit vocabulary, roots, and grammatical forms.
              </p>
            </div>

            <div className="pt-2 border-t border-[#F2EDE2]">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#78716C] block mb-2 font-semibold">
                Capabilities:
              </span>
              <ul className="space-y-1.5 text-xs text-[#44403C]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Dhātu root extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Vibhakti case paradigms</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Pāṇinian morphology</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
            <Link
              href="/dictionary"
              className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F4] group-hover:bg-[#8C4A2F] text-[#8C4A2F] group-hover:text-white font-medium text-xs transition-colors border border-[#E8E1D5] group-hover:border-[#8C4A2F]"
            >
              <span>Explore Lexicon</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Module 2: Transliteration */}
        <div className="bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl p-6 shadow-2xs transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8C4A2F] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3D6]">
                Transliteration
              </span>
            </div>

            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                Script Converter
              </h3>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Convert between Devanagari script and standardized IAST (ISO 15919).
              </p>
            </div>

            <div className="pt-2 border-t border-[#F2EDE2]">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#78716C] block mb-2 font-semibold">
                Capabilities:
              </span>
              <ul className="space-y-1.5 text-xs text-[#44403C]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Devanagari ↔ IAST</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>ISO 15919 diacritics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Phonetic mapping</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
            <Link
              href="/transliteration"
              className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F4] group-hover:bg-[#8C4A2F] text-[#8C4A2F] group-hover:text-white font-medium text-xs transition-colors border border-[#E8E1D5] group-hover:border-[#8C4A2F]"
            >
              <span>Open Transliterator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Module 3: Translation */}
        <div className="bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl p-6 shadow-2xs transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8C4A2F] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3D6]">
                Translation
              </span>
            </div>

            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                Multilingual Translation
              </h3>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Translate Sanskrit words and sentences into Hindi, Marathi, and English.
              </p>
            </div>

            <div className="pt-2 border-t border-[#F2EDE2]">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#78716C] block mb-2 font-semibold">
                Capabilities:
              </span>
              <ul className="space-y-1.5 text-xs text-[#44403C]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Trilingual target outputs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Word-by-word gloss</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Syntactic anvaya</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
            <Link
              href="/translation"
              className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F4] group-hover:bg-[#8C4A2F] text-[#8C4A2F] group-hover:text-white font-medium text-xs transition-colors border border-[#E8E1D5] group-hover:border-[#8C4A2F]"
            >
              <span>Translate Text</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Module 4: Sanskrit Quiz & Assessment */}
        <div className="bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl p-6 shadow-2xs transition-all flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#8C4A2F] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE3D6]">
                Assessment
              </span>
            </div>

            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                Sanskrit Quiz
              </h3>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Test your knowledge in vocabulary, grammar, sandhi, samāsa, and phonology.
              </p>
            </div>

            <div className="pt-2 border-t border-[#F2EDE2]">
              <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#78716C] block mb-2 font-semibold">
                Capabilities:
              </span>
              <ul className="space-y-1.5 text-xs text-[#44403C]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>8 Category Assessments</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Pāṇinian Explanations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C4A2F]"></span>
                  <span>Instant Scoring & Feedback</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F2EDE2]">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-between w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FAF8F4] group-hover:bg-[#8C4A2F] text-[#8C4A2F] group-hover:text-white font-medium text-xs transition-colors border border-[#E8E1D5] group-hover:border-[#8C4A2F]"
            >
              <span>Start Sanskrit Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </section>
  );
};
