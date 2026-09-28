import React from 'react';
import { BookOpen, Sparkles, Search, Languages, ScrollText, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onSearchClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dictionary')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] rounded-md py-1"
        >
          <div className="w-8 h-8 rounded bg-[#2C241E] text-[#FBF9F5] flex items-center justify-center font-devanagari font-bold text-lg shadow-xs group-hover:bg-[#8C4A2F] transition-colors">
            सं
          </div>
          <span className="font-serif-editorial text-xl font-semibold tracking-tight text-[#1C1917]">
            Sanskrit Digital Reader
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`transition-colors hover:text-[#1C1917] pb-0.5 border-b-2 ${
              activeTab === 'dictionary'
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent'
            }`}
          >
            Dictionary
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className={`transition-colors hover:text-[#1C1917] pb-0.5 border-b-2 ${
              activeTab === 'reader'
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent'
            }`}
          >
            Reader
          </button>
          <button
            onClick={() => setActiveTab('transliteration')}
            className={`transition-colors hover:text-[#1C1917] pb-0.5 border-b-2 ${
              activeTab === 'transliteration'
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent'
            }`}
          >
            Transliteration
          </button>
          <button
            onClick={() => setActiveTab('technology')}
            className={`transition-colors hover:text-[#1C1917] pb-0.5 border-b-2 ${
              activeTab === 'technology'
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent'
            }`}
          >
            Language Technology
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors hover:text-[#1C1917] pb-0.5 border-b-2 ${
              activeTab === 'about'
                ? 'text-[#1C1917] border-[#8C4A2F] font-semibold'
                : 'border-transparent'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#1C1917] bg-[#EFE9DD] hover:bg-[#E5DCF] rounded-lg transition-colors border border-[#DCD3C3] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
            aria-label="Search Sanskrit lexicon"
          >
            <Search className="w-3.5 h-3.5 text-[#78716C]" />
            <span className="hidden sm:inline">Search Lexicon</span>
          </button>
          <button
            onClick={() => setActiveTab('reader')}
            className="px-3.5 py-1.5 text-xs font-medium text-[#FBF9F5] bg-[#2C241E] hover:bg-[#8C4A2F] rounded-lg transition-colors whitespace-nowrap shadow-xs focus-visible:ring-2 focus-visible:ring-[#8C4A2F]"
          >
            Open Reader
          </button>
        </div>

      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E8E1D5] bg-[#F7F4EE] px-2 py-2 text-xs font-medium text-[#57534E]">
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${activeTab === 'dictionary' ? 'text-[#8C4A2F] font-bold' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Dictionary</span>
        </button>
        <button
          onClick={() => setActiveTab('reader')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${activeTab === 'reader' ? 'text-[#8C4A2F] font-bold' : ''}`}
        >
          <ScrollText className="w-4 h-4" />
          <span>Reader</span>
        </button>
        <button
          onClick={() => setActiveTab('transliteration')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${activeTab === 'transliteration' ? 'text-[#8C4A2F] font-bold' : ''}`}
        >
          <Languages className="w-4 h-4" />
          <span>Convert</span>
        </button>
        <button
          onClick={() => setActiveTab('technology')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded ${activeTab === 'technology' ? 'text-[#8C4A2F] font-bold' : ''}`}
        >
          <Cpu className="w-4 h-4" />
          <span>Tech</span>
        </button>
      </div>
    </header>
  );
};
