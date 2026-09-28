import React from 'react';
import { SearchBox } from './SearchBox';
import { SanskritEntry } from '../data/sanskritDictionary';
import { Sparkles, BookOpen, ArrowRight, Compass } from 'lucide-react';

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
  const sampleWords = [
    { dev: 'धर्मः', iast: 'dharmaḥ', label: 'Righteousness / Duty' },
    { dev: 'संस्कृतम्', iast: 'saṃskṛtam', label: 'Refined / Sanskrit' },
    { dev: 'ज्ञानम्', iast: 'jñānam', label: 'Knowledge / Wisdom' },
    { dev: 'गच्छति', iast: 'gacchati', label: 'Goes / Moves' },
    { dev: 'रामः', iast: 'rāmaḥ', label: 'Delightful / Rama' },
    { dev: 'सत्यम्', iast: 'satyam', label: 'Truth / Reality' },
    { dev: 'अहिंसा', iast: 'ahiṃsā', label: 'Non-violence' },
    { dev: 'शान्तिः', iast: 'śāntiḥ', label: 'Peace / Calm' }
  ];

  return (
    <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#E8E1D5]">
      
      {/* Background Decorative Paper Texture Effect */}
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        
        {/* Editorial Eyebrow / Kicker (No Pill Badges!) */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-[#8C4A2F] uppercase tracking-widest mb-3">
          <span>Digital Humanities</span>
          <span aria-hidden="true">·</span>
          <span>Computational Linguistics</span>
          <span aria-hidden="true">·</span>
          <span>Pāṇinian Lexicon</span>
        </div>

        {/* Title */}
        <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1C1917] tracking-tight leading-[1.15] text-balance max-w-3xl mx-auto">
          Explore Sanskrit with Digital Language Technology
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl mx-auto text-balance">
          Search Sanskrit words, explore their meanings and grammatical information, and discover how computational tools contribute to the preservation and study of Sanskrit.
        </p>

        {/* Central Search Box */}
        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={onSearch}
            onSelectEntry={onSelectEntry}
            placeholder="Enter a Sanskrit word, e.g. धर्मः"
          />
        </div>

        {/* Clickable Example Words */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <span className="text-xs font-medium text-[#78716C] mb-2.5">
            Or select an example word to inspect:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleWords.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSampleWord(item.dev)}
                className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#F2ECE1] text-[#1C1917] border border-[#E0D8CA] rounded-lg text-sm font-medium transition-all shadow-2xs hover:border-[#8C4A2F]/40 flex items-baseline gap-1.5 group"
              >
                <span className="font-devanagari font-bold text-base text-[#1C1917] group-hover:text-[#8C4A2F] transition-colors">
                  {item.dev}
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
