import React, { useMemo } from 'react';
import { Link, useRouter } from '../lib/router';
import { SearchBox } from './SearchBox';
import { SanskritEntry } from '../data/sanskritDictionary';
import { getFeaturedWords } from '../lib/dictionary';
import { ScrollText, BookOpen, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearch: (term: string) => void;
  onSelectEntry?: (entry: SanskritEntry) => void;
  onSelectSampleWord: (word: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onSelectEntry,
  onSelectSampleWord
}) => {
  const router = useRouter();
  const sampleWords = useMemo(() => getFeaturedWords(8), []);

  return (
    <section aria-labelledby="hero-heading" className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#E8E1D5] bg-[#FAF8F4]/80">
      
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        
        {/* Scholarly Eyebrow Hierarchy */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#8C4A2F] uppercase tracking-widest mb-3 font-semibold">
          <span>Sanskrit Language Technology</span>
        </div>

        {/* Primary Page Title */}
        <h1 
          id="hero-heading"
          className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1C1917] tracking-tight leading-[1.15] text-balance max-w-3xl mx-auto"
        >
          Explore Sanskrit Language Technology
        </h1>

        {/* Academic Purpose Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mx-auto text-balance">
          Read, analyze, transliterate, and translate Sanskrit using connected digital language tools.
        </p>

        {/* Primary User Action CTAs */}
        <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/reader"
            className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-6 py-2.5 rounded-xl bg-[#8C4A2F] text-white font-medium text-sm sm:text-base hover:bg-[#723B25] active:scale-[0.99] transition-all shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#8C4A2F] focus:ring-offset-2"
          >
            <ScrollText className="w-4 h-4 shrink-0 text-[#F5EDE4]" />
            <span>Start Reading Sanskrit</span>
            <ArrowRight className="w-4 h-4 shrink-0 text-[#F5EDE4]" />
          </Link>

          <Link
            href="/dictionary"
            className="inline-flex items-center justify-center gap-2.5 min-h-[44px] px-5 py-2.5 rounded-xl bg-white text-[#2C241E] border border-[#D5CCA8] font-medium text-sm sm:text-base hover:bg-[#F2ECE1] active:scale-[0.99] transition-all shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#8C4A2F] focus:ring-offset-2"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-[#8C4A2F]" />
            <span>Explore Dictionary</span>
          </Link>
        </div>

        {/* Integrated Quick Search Box */}
        <div className="mt-10 pt-8 border-t border-[#EAE2D2] max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-xs font-medium text-[#78716C] uppercase tracking-wider font-mono-code">
              Quick Lexicon Search
            </span>
            <span className="text-xs text-[#8C4A2F]">
              Devanagari or IAST
            </span>
          </div>

          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={onSearch}
            onSelectEntry={onSelectEntry}
            placeholder="Enter a Sanskrit word, e.g. धर्मः or dharma"
          />
        </div>

        {/* Example Words for Immediate Interactive Lookup */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-[#78716C] mb-2.5">
            Or select an example word to inspect morphology:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleWords.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSampleWord(item.devanagari)}
                className="min-h-[40px] px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#F2ECE1] text-[#1C1917] border border-[#E0D8CA] rounded-lg text-sm font-medium transition-all shadow-2xs hover:border-[#8C4A2F]/40 flex items-baseline gap-1.5 group cursor-pointer active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-[#8C4A2F]"
                aria-label={`Inspect ${item.devanagari} (${item.iast})`}
              >
                <span className="font-devanagari font-bold text-base text-[#1C1917] group-hover:text-[#8C4A2F] transition-colors">
                  {item.devanagari}
                </span>
                <span className="text-xs font-mono-code text-[#78716C]">
                  {item.iast}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
