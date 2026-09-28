import React, { useState } from 'react';
import { Link } from '../lib/router';
import { 
  BookMarked, 
  Languages, 
  Layers, 
  ScrollText, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  Database, 
  Binary, 
  Code2, 
  Workflow,
  CheckCircle2,
  BookOpen,
  ArrowRightLeft,
  Globe,
  Sliders
} from 'lucide-react';

interface PipelineSample {
  id: string;
  label: string;
  stage1Text: string;
  stage2Tokens: string[];
  stage3Iast: string;
  stage4Morphology: string;
  stage5Comprehension: {
    hi: string;
    mr: string;
    en: string;
  };
}

const PIPELINE_SAMPLES: PipelineSample[] = [
  {
    id: 'dharma',
    label: 'धर्मो रक्षति रक्षितः',
    stage1Text: 'धर्म एव हतो हन्ति धर्मो रक्षति रक्षितः।',
    stage2Tokens: ['धर्मः', 'एव', 'हतः', 'हन्ति', 'धर्मः', 'रक्षति', 'रक्षितः'],
    stage3Iast: 'dharma eva hato hanti dharmo rakṣati rakṣitaḥ',
    stage4Morphology: 'धृ + मन् (धर्मादिषु) · प्रथमा विभक्ति (एकवचन) · पुंलिङ्ग',
    stage5Comprehension: {
      hi: 'धर्म की रक्षा करने वाले की धर्म रक्षा करता है।',
      mr: 'धर्माचे रक्षण करणाऱ्याचे धर्म रक्षण करतो.',
      en: 'Dharma (righteousness) protects those who protect it.'
    }
  },
  {
    id: 'vidya',
    label: 'विद्या ददाति विनयं',
    stage1Text: 'विद्या ददाति विनयं विनयाद् याति पात्रताम्।',
    stage2Tokens: ['विद्या', 'ददाति', 'विनयम्', 'विनयात्', 'याति', 'पात्रताम्'],
    stage3Iast: 'vidyā dadāti vinayaṃ vinayād yāti pātratām',
    stage4Morphology: 'विद् + क्यप् / ष्टाप् · प्रथमा विभक्ति (एकवचन) · स्त्रीलिङ्ग',
    stage5Comprehension: {
      hi: 'विद्या विनय देती है, विनय से योग्यता प्राप्त होती है।',
      mr: 'विद्या नम्रता देते, नम्रतेने पात्रता प्राप्त होते.',
      en: 'Knowledge bestows humility; from humility one attains worthiness.'
    }
  },
  {
    id: 'satyam',
    label: 'सत्यमेव जयते',
    stage1Text: 'सत्यमेव जयते नानृतम्।',
    stage2Tokens: ['सत्यम्', 'एव', 'जयते', 'न', 'अनृतम्'],
    stage3Iast: 'satyameva jayate nānṛtam',
    stage4Morphology: 'सत् + यत् (सत्यम्) · प्रथमा विभक्ति · नपुंसकलिङ्ग',
    stage5Comprehension: {
      hi: 'सत्य की ही जीत होती है, असत्य की नहीं।',
      mr: 'सत्याचाच विजय होतो, असत्याचा नाही.',
      en: 'Truth alone triumphs, not falsehood (Muṇḍaka Upaniṣad).'
    }
  },
  {
    id: 'vasudhaiva',
    label: 'वसुधैव कुटुम्बकम्',
    stage1Text: 'उदारचरितानां तु वसुधैव कुटुम्बकम्।',
    stage2Tokens: ['उदारचरितानाम्', 'तु', 'वसुधा', 'एव', 'कुटुम्बकम्'],
    stage3Iast: 'udāracaritānāṃ tu vasudhaiva kuṭumbakam',
    stage4Morphology: 'वसुधा + एव (वृद्धि-सन्धिः) · वसुधैव · समस्तपदम्',
    stage5Comprehension: {
      hi: 'उदार चरित्र वालों के लिए सम्पूर्ण पृथ्वी ही एक परिवार है।',
      mr: 'उदार मनाच्या व्यक्तींसाठी संपूर्ण पृथ्वी हेच एक कुटुंब आहे.',
      en: 'For the noble-hearted, the entire earth is one single family.'
    }
  }
];

export const TechnologySection: React.FC = () => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('dharma');
  const [activeStage, setActiveStage] = useState<number>(1);
  const [comprehensionLang, setComprehensionLang] = useState<'en' | 'hi' | 'mr'>('en');

  const currentSample = PIPELINE_SAMPLES.find(s => s.id === selectedSampleId) || PIPELINE_SAMPLES[0];

  const techPillars = [
    {
      id: 'dictionaries',
      title: '01. Digital Lexicons & Dictionaries',
      icon: BookMarked,
      tagline: 'Structured lexical knowledge graphs',
      route: '/dictionary',
      routeLabel: 'Open Lexicon',
      bullets: [
        'Store structured lexical information across nominal, verbal, and indeclinable paradigms.',
        'Make multi-century Sanskrit vocabulary rapidly searchable via Devanagari, IAST, and semantic concepts.',
        'Connect headwords with Pāṇinian dhātu (roots), semantic gaṇas (classes), and grammatical derivations.'
      ],
      traditionNote: 'Digital descendants of traditional Amarakośa synonym dictionaries and 19th-century historical lexicons (Monier-Williams, Apte).'
    },
    {
      id: 'transliteration',
      title: '02. Phonetic Transliteration & Encoding',
      icon: Languages,
      tagline: 'Lossless script conversion and Unicode standardization',
      route: '/transliteration',
      routeLabel: 'Open Transliterator',
      bullets: [
        'Converts between scripts and standardized representations without ambiguity (Devanagari, IAST, ISO 15919, SLP1, ITRANS).',
        'Makes Sanskrit literature and scientific texts accessible to scholars and learners globally.',
        'Standardizes Unicode codepoints (U+0900–U+097F) to facilitate automated computational indexing and search.'
      ],
      traditionNote: 'Grounded in the precise 5-fold articulation taxonomy (Sthāna & Prayatna) of ancient Śikṣā phonetics.'
    },
    {
      id: 'morphology',
      title: '03. Morphological Analyzers & Rule Engines',
      icon: Layers,
      tagline: 'Processing highly inflected agglutinative linguistic systems',
      route: '/reader',
      routeLabel: 'Inspect Morphology',
      bullets: [
        'Identifies roots (dhātus), inflections (vibhakti/lakāra), gender (liṅga), number (vacana), and person (puruṣa).',
        'Models Sanskrit nominal declensions (8 cases × 3 numbers) and rich verbal conjugations (10 lakāras).',
        'Implements finite-state transducers (FSTs) to parse and generate syntactically valid word-forms.'
      ],
      traditionNote: 'Pāṇini’s Aṣṭādhyāyī (~4th century BCE) is widely recognized by computer scientists as the earliest formal generative grammar and rule-based algorithm.'
    },
    {
      id: 'preservation',
      title: '04. Digital Preservation & Manuscript Informatics',
      icon: ScrollText,
      tagline: 'Conserving fragile palm-leaf and birch-bark manuscripts',
      route: '/about',
      routeLabel: 'View Preservation',
      bullets: [
        'Transforms ancient manuscript folios into standardized digital scholarly editions (TEI XML, OCR).',
        'Helps preserve millions of uncataloged manuscripts endangered by climate and physical degradation.',
        'Enables researchers, universities, and students worldwide to access open digital archives instantly.'
      ],
      traditionNote: 'Bridging physical palm-leaf codices with resilient cloud archives and distributed knowledge bases.'
    },
    {
      id: 'nlp',
      title: '05. Natural Language Processing & Computational Linguistics',
      icon: Cpu,
      tagline: 'Foundational modules for Sanskrit language processing',
      route: '/translation',
      routeLabel: 'Open Translation',
      bullets: [
        'Sandhi Resolution: Splitting phonologically fused word boundaries into discrete lexical tokens.',
        'Samāsa Analysis: Deconstructing complex compound words and extracting internal semantic relationships.',
        'Dependency Parsing: Mapping Kāraka relationships to analyze sentence syntax and semantic roles for translation.'
      ],
      traditionNote: 'Provides computational building blocks for machine translation, semantic search, and information retrieval.'
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* Section Header */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider font-semibold text-[#8C4A2F] mb-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>Linguistic Architecture & Algorithms</span>
        </div>
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-tight">
          How Sanskrit Digital Tools Support Language Technology
        </h2>
        <p className="text-base text-[#57534E] mt-3 leading-relaxed">
          Sanskrit possesses one of the world's most rigorously formalized linguistic traditions. Computational Sanskrit tools transform traditional grammatical frameworks into digital instruments for research, pedagogy, and cultural preservation.
        </p>
      </div>

      {/* Interactive Processing Pipeline Simulator */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EAE1]">
          <div className="flex items-center gap-2">
            <Workflow className="w-5 h-5 text-[#8C4A2F]" />
            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                Interactive Sanskrit Processing Pipeline
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Click a stage or sample sentence below to trace the computational flow:
              </p>
            </div>
          </div>

          {/* Sample Sentence Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono-code text-[#78716C] mr-1">Sample:</span>
            {PIPELINE_SAMPLES.map((sample) => {
              const isSelected = sample.id === selectedSampleId;
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setSelectedSampleId(sample.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer min-h-[34px] ${
                    isSelected
                      ? 'bg-[#8C4A2F] text-white font-semibold shadow-2xs'
                      : 'bg-[#FAF8F4] text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
                  }`}
                >
                  <span className="font-devanagari">{sample.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Stage Interactive Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Stage 1: Text Input */}
          <button
            type="button"
            onClick={() => setActiveStage(1)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer min-h-[110px] ${
              activeStage === 1
                ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/30 shadow-xs'
                : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F7F2EB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold">STAGE 01</span>
                {activeStage === 1 && <span className="w-2 h-2 rounded-full bg-[#8C4A2F]"></span>}
              </div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Sanskrit Text</h4>
              <p className="text-[11px] text-[#78716C] mt-0.5">Raw Devanagari verse</p>
            </div>
            <div className="mt-2 font-devanagari text-xs font-bold text-[#8C4A2F] truncate">
              {currentSample.stage1Text.split('।')[0]}
            </div>
          </button>

          {/* Stage 2: Tokenization & Sandhi */}
          <button
            type="button"
            onClick={() => setActiveStage(2)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer min-h-[110px] ${
              activeStage === 2
                ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/30 shadow-xs'
                : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F7F2EB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold">STAGE 02</span>
                {activeStage === 2 && <span className="w-2 h-2 rounded-full bg-[#8C4A2F]"></span>}
              </div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Tokenization</h4>
              <p className="text-[11px] text-[#78716C] mt-0.5">Sandhi splitting</p>
            </div>
            <div className="mt-2 font-devanagari text-xs font-bold text-[#8C4A2F] truncate">
              {currentSample.stage2Tokens.slice(0, 3).join(' · ')}...
            </div>
          </button>

          {/* Stage 3: Phonetics & IAST */}
          <button
            type="button"
            onClick={() => setActiveStage(3)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer min-h-[110px] ${
              activeStage === 3
                ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/30 shadow-xs'
                : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F7F2EB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold">STAGE 03</span>
                {activeStage === 3 && <span className="w-2 h-2 rounded-full bg-[#8C4A2F]"></span>}
              </div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Phonetics / IAST</h4>
              <p className="text-[11px] text-[#78716C] mt-0.5">Standardized diacritics</p>
            </div>
            <div className="mt-2 font-mono-code text-xs text-[#8C4A2F] truncate">
              {currentSample.stage3Iast}
            </div>
          </button>

          {/* Stage 4: Morphology & Lexicon */}
          <button
            type="button"
            onClick={() => setActiveStage(4)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer min-h-[110px] ${
              activeStage === 4
                ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-2 ring-[#8C4A2F]/30 shadow-xs'
                : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F7F2EB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold">STAGE 04</span>
                {activeStage === 4 && <span className="w-2 h-2 rounded-full bg-[#8C4A2F]"></span>}
              </div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Morphology</h4>
              <p className="text-[11px] text-[#78716C] mt-0.5">Roots & declensions</p>
            </div>
            <div className="mt-2 font-mono-code text-xs text-[#8C4A2F] truncate">
              {currentSample.stage4Morphology.split('·')[0]}
            </div>
          </button>

          {/* Stage 5: Translation & Understanding */}
          <button
            type="button"
            onClick={() => setActiveStage(5)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer min-h-[110px] ${
              activeStage === 5
                ? 'bg-[#2C241E] text-white border-[#2C241E] ring-2 ring-[#8C4A2F]/30 shadow-xs'
                : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F7F2EB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-mono-code font-semibold ${activeStage === 5 ? 'text-[#E2D8C6]' : 'text-[#8C4A2F]'}`}>
                  STAGE 05
                </span>
                {activeStage === 5 && <span className="w-2 h-2 rounded-full bg-[#E2D8C6]"></span>}
              </div>
              <h4 className={`font-semibold text-sm ${activeStage === 5 ? 'text-white' : 'text-[#1C1917]'}`}>
                Translation
              </h4>
              <p className={`text-[11px] mt-0.5 ${activeStage === 5 ? 'text-[#D6CEBE]' : 'text-[#78716C]'}`}>
                Trilingual output
              </p>
            </div>
            <div className={`mt-2 text-xs truncate ${activeStage === 5 ? 'text-[#F5EDE4]' : 'text-[#8C4A2F]'}`}>
              {currentSample.stage5Comprehension.en}
            </div>
          </button>

        </div>

        {/* Active Stage Live Inspector Box */}
        <div className="p-5 bg-[#FAF8F4] border border-[#EAE2D2] rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE2D2]">
            <div>
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#8C4A2F]">
                Pipeline Stage {activeStage} Detail
              </span>
              <h4 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                {activeStage === 1 && 'Sanskrit Corpus Input & Script Normalization'}
                {activeStage === 2 && 'Lexical Tokenization & Sandhi Boundary Resolution'}
                {activeStage === 3 && 'Standardized Phonetic Transliteration (IAST / ISO 15919)'}
                {activeStage === 4 && 'Pāṇinian Morphological Parsing & Dhātu Derivation'}
                {activeStage === 5 && 'Cross-Lingual Semantic Translation & Syntax Reconstruction'}
              </h4>
            </div>

            {/* Jump to Corresponding Tool CTA */}
            <div>
              {activeStage === 1 && (
                <Link
                  href="/reader"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8C4A2F] text-white rounded-lg text-xs font-medium hover:bg-[#723B25] transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open in Reader</span>
                </Link>
              )}
              {activeStage === 2 && (
                <Link
                  href="/reader"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8C4A2F] text-white rounded-lg text-xs font-medium hover:bg-[#723B25] transition-colors"
                >
                  <ScrollText className="w-3.5 h-3.5" />
                  <span>Inspect Tokens in Reader</span>
                </Link>
              )}
              {activeStage === 3 && (
                <Link
                  href="/transliteration"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8C4A2F] text-white rounded-lg text-xs font-medium hover:bg-[#723B25] transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Open Transliterator</span>
                </Link>
              )}
              {activeStage === 4 && (
                <Link
                  href="/dictionary"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8C4A2F] text-white rounded-lg text-xs font-medium hover:bg-[#723B25] transition-colors"
                >
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>Search in Dictionary</span>
                </Link>
              )}
              {activeStage === 5 && (
                <Link
                  href="/translation"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8C4A2F] text-white rounded-lg text-xs font-medium hover:bg-[#723B25] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open Translator</span>
                </Link>
              )}
            </div>
          </div>

          {/* Active Stage Data Rendering */}
          {activeStage === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-[#57534E]">
                Raw Sanskrit verse in Devanagari script is verified against Unicode standards (U+0900–U+097F) and cleaned of irregular manuscript glyphs:
              </p>
              <div className="p-4 bg-white border border-[#E0D7C6] rounded-xl text-center">
                <span className="font-devanagari text-2xl font-bold text-[#1C1917]">
                  {currentSample.stage1Text}
                </span>
              </div>
            </div>
          )}

          {activeStage === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-[#57534E]">
                Sandhi engine resolves compound sandhi boundaries to separate continuous text into discrete grammatical tokens:
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSample.stage2Tokens.map((tok, idx) => (
                  <span
                    key={`${tok}-${idx}`}
                    className="px-3 py-2 bg-white border border-[#E0D7C6] rounded-lg font-devanagari font-bold text-base text-[#8C4A2F] shadow-2xs"
                  >
                    {tok}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeStage === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-[#57534E]">
                Phonological transliteration maps each phoneme losslessly into standardized IAST with accurate diacritics (macrons, underdots, and tildes):
              </p>
              <div className="p-4 bg-white border border-[#E0D7C6] rounded-xl">
                <span className="font-mono-code text-sm sm:text-base text-[#8C4A2F] font-semibold">
                  {currentSample.stage3Iast}
                </span>
              </div>
            </div>
          )}

          {activeStage === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-[#57534E]">
                Morphological analyzer parses root dhātus, case inflections (vibhakti), genders (liṅga), and verbal classes:
              </p>
              <div className="p-4 bg-white border border-[#E0D7C6] rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="font-devanagari text-lg font-bold text-[#1C1917]">
                  {currentSample.stage2Tokens[0]}
                </div>
                <div className="font-mono-code text-xs text-[#8C4A2F] bg-[#FAF7F2] px-3 py-1.5 rounded-md border border-[#EAE3D6]">
                  {currentSample.stage4Morphology}
                </div>
              </div>
            </div>
          )}

          {activeStage === 5 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#57534E]">
                  Trilingual semantic translation engine provides contextual rendering in English, Hindi, and Marathi:
                </p>
                <div className="flex items-center gap-1 bg-[#F2EDE2] p-0.5 rounded-lg text-xs">
                  {(['en', 'hi', 'mr'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setComprehensionLang(lang)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        comprehensionLang === lang
                          ? 'bg-white text-[#1C1917] font-semibold shadow-2xs'
                          : 'text-[#78716C] hover:text-[#1C1917]'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border border-[#E0D7C6] rounded-xl">
                <p className="text-sm font-medium text-[#1C1917] leading-relaxed">
                  "{currentSample.stage5Comprehension[comprehensionLang]}"
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* The 5 Key Technology Pillars */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
              Core Computational Dimensions
            </h3>
            <p className="text-xs text-[#78716C] mt-1">
              Foundational pillars powering modern Sanskrit digital humanities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between group hover:border-[#8C4A2F]/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center shrink-0 group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                          {pillar.title}
                        </h4>
                        <p className="text-xs text-[#78716C] font-mono-code">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4 text-sm text-[#44403C]">
                    {pillar.bullets.map((b, i) => (
                      <li key={`${pillar.id}-bullet-${i}`} className="flex items-start gap-2">
                        <span className="text-[#8C4A2F] font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F2EDE2] space-y-3">
                  <div className="text-xs text-[#78716C] italic">
                    <strong>Tradition & Logic:</strong> {pillar.traditionNote}
                  </div>

                  <Link
                    href={pillar.route}
                    className="inline-flex items-center justify-between w-full min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#FAF8F4] group-hover:bg-[#8C4A2F] text-[#8C4A2F] group-hover:text-white font-medium text-xs transition-colors border border-[#E8E1D5] group-hover:border-[#8C4A2F]"
                  >
                    <span>{pillar.routeLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
