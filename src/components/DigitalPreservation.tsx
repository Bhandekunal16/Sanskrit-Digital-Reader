import React from 'react';
import { 
  Scroll, 
  Library, 
  Globe2, 
  Search, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  BookOpenCheck
} from 'lucide-react';

export const DigitalPreservation: React.FC = () => {
  return (
    <div className="space-y-10">
      
      {/* Editorial Header */}
      <div className="max-w-3xl">
        <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917] tracking-tight">
          Why Digital Sanskrit Matters
        </h2>
        <p className="text-base text-[#57534E] mt-3 leading-relaxed">
          Sanskrit embodies one of humanity’s largest continuous intellectual, philosophical, scientific, and literary heritages. Modern language technology offers the key to safeguarding, organizing, and revitalizing this knowledge.
        </p>
      </div>

      {/* Main Grid: Heritage & Preservation Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-4">
            <Library className="w-5 h-5" />
          </div>
          <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917] mb-2">
            The World’s Largest Manuscript Archive
          </h3>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Scholars estimate that over <strong>30 million Sanskrit manuscripts</strong> exist across public repositories, temple archives, and private collections. Over 90% remain unedited and unpublished. Digital digitization protects these irreplaceable texts against climate decay and physical loss.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-4">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917] mb-2">
            Democratizing Global Access
          </h3>
          <p className="text-sm text-[#57534E] leading-relaxed">
            Historical access was geographically restricted to specific libraries and script literacies (Grantha, Śāradā, Newar, Devanagari). Digital transliteration engines, TEI XML archives, and web readers enable scholars and curious learners worldwide to study texts seamlessly.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-4">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917] mb-2">
            Interoperable Knowledge Graphs
          </h3>
          <p className="text-sm text-[#57534E] leading-relaxed">
            By encoding traditional Sanskrit linguistic metadata—such as Pāṇinian dhātu roots, nominal declensions, and semantic thesauri like Amarakośa—computational systems can cross-reference philosophy, mathematics (Sulba Sūtras), astronomy (Jyotiṣa), and medicine (Āyurveda).
          </p>
        </div>

      </div>

      {/* Deep Archival Insight Callout */}
      <div className="bg-[#FAF7F2] border border-[#E5DECF] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
              Computational Linguistics Benchmark
            </span>
            <h4 className="font-serif-editorial text-2xl font-semibold text-[#1C1917]">
              Pāṇini’s Aṣṭādhyāyī: The First Formal Grammatical System
            </h4>
            <p className="text-sm text-[#57534E] mt-2 leading-relaxed">
              Composed in the 4th century BCE, the 3,959 algebraic sutras of the Aṣṭādhyāyī constitute an algorithmic generative grammar featuring rule precedence, meta-rules (paribhāṣā), context-free transformations, and auxiliary markers that anticipate modern Backus-Naur Form (BNF) computer grammars.
            </p>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E0D8CA] rounded-xl text-center shrink-0 w-full md:w-auto">
            <span className="text-3xl font-devanagari font-bold text-[#8C4A2F] block">
              ३,९५९
            </span>
            <span className="text-xs font-mono-code text-[#78716C]">
              Formal Algebraic Sūtras
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
