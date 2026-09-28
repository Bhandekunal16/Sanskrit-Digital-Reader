import React from 'react';
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
  Workflow
} from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const techPillars = [
    {
      id: 'dictionaries',
      title: '01. Digital Lexicons & Dictionaries',
      icon: BookMarked,
      tagline: 'Structured lexical knowledge graphs',
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
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-tight">
          How Sanskrit Digital Tools Support Language Technology
        </h2>
        <p className="text-base text-[#57534E] mt-3 leading-relaxed">
          Sanskrit possesses one of the world's most rigorously formalized linguistic traditions. Computational Sanskrit tools transform traditional grammatical frameworks into digital instruments for research, pedagogy, and cultural preservation.
        </p>
      </div>

      {/* Interactive Workflow Diagram (Matching requirement) */}
      <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Workflow className="w-5 h-5 text-[#8C4A2F]" />
          <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
            The Digital Sanskrit Processing Pipeline
          </h3>
        </div>
        <p className="text-xs text-[#78716C] mb-6">
          How raw textual heritage flows through computational linguistics layers into accessible human understanding:
        </p>

        {/* Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          
          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold block mb-1">STAGE 1</span>
            <div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Sanskrit Text</h4>
              <p className="text-xs text-[#78716C] mt-1">Raw manuscript or digital Devanagari input.</p>
            </div>
            <div className="mt-3 font-devanagari text-base font-bold text-[#8C4A2F]">धर्मः रक्षति</div>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold block mb-1">STAGE 2</span>
            <div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Word Selection</h4>
              <p className="text-xs text-[#78716C] mt-1">Tokenization and Sandhi boundary detection.</p>
            </div>
            <div className="mt-3 font-mono-code text-xs text-[#1C1917]">token: धर्मः</div>
          </div>

          <div className="p-4 bg-[#FAF7F2] border border-[#DCD3C3] rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold block mb-1">STAGE 3</span>
            <div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Digital Analysis</h4>
              <p className="text-xs text-[#78716C] mt-1">IAST transliteration & root/morpheme mapping.</p>
            </div>
            <div className="mt-3 font-mono-code text-xs text-[#8C4A2F]">dhṛ + man/ghañ</div>
          </div>

          <div className="p-4 bg-[#FBF9F5] border border-[#EAE3D6] rounded-xl flex flex-col justify-between">
            <span className="text-[11px] font-mono-code text-[#8C4A2F] font-semibold block mb-1">STAGE 4</span>
            <div>
              <h4 className="font-semibold text-sm text-[#1C1917]">Meaning & Grammar</h4>
              <p className="text-xs text-[#78716C] mt-1">Lexical lookup, case/tense extraction.</p>
            </div>
            <div className="mt-3 text-xs font-serif-editorial text-[#1C1917]">Masc. Nom. Sg. "Duty/Virtue"</div>
          </div>

          <div className="p-4 bg-[#2C241E] text-[#FBF9F5] rounded-xl flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-mono-code text-[#E2D8C6] font-semibold block mb-1">STAGE 5</span>
            <div>
              <h4 className="font-semibold text-sm text-white">Human Understanding</h4>
              <p className="text-xs text-[#D6CEBE] mt-1">Grounded comprehension of philosophy & ethics.</p>
            </div>
            <div className="mt-3 text-xs text-white font-medium">Clear comprehension</div>
          </div>

        </div>
      </div>

      {/* The 5 Key Technology Pillars */}
      <div className="space-y-6">
        <h3 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
          Core Computational Dimensions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center shrink-0">
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

                  <ul className="space-y-2 mt-4 text-sm text-[#44403C]">
                    {pillar.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8C4A2F] font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-[#F2EDE2] text-xs text-[#78716C] italic">
                  <strong>Tradition & Logic:</strong> {pillar.traditionNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
