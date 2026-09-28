import React from 'react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        
        {/* Brand Column */}
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-[#2C241E] text-white flex items-center justify-center font-devanagari font-bold text-xs">
              सं
            </div>
            <span className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
              Sanskrit Digital Reader
            </span>
          </div>
          <p className="text-xs text-[#78716C] leading-relaxed">
            An open educational computational linguistics interface demonstrating digital dictionaries, transliteration, morphological parsing, and manuscript preservation.
          </p>
          <div className="mt-4 text-[11px] text-[#A8A29E] font-mono-code">
            Pāṇinian Grammar & IAST Standardization
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <span className="font-semibold text-[#1C1917] block mb-2 uppercase tracking-wider text-[11px]">
              Platform Tools
            </span>
            <ul className="space-y-1.5 text-[#57534E]">
              <li>
                <button onClick={() => onNavigate('dictionary')} className="hover:text-[#1C1917] transition-colors">
                  Digital Lexicon
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reader')} className="hover:text-[#1C1917] transition-colors">
                  Sanskrit Reader
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transliteration')} className="hover:text-[#1C1917] transition-colors">
                  Transliteration Engine
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1C1917] block mb-2 uppercase tracking-wider text-[11px]">
              Linguistics
            </span>
            <ul className="space-y-1.5 text-[#57534E]">
              <li>
                <button onClick={() => onNavigate('technology')} className="hover:text-[#1C1917] transition-colors">
                  Language Technology
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#1C1917] transition-colors">
                  Manuscript Preservation
                </button>
              </li>
              <li>
                <span className="text-[#A8A29E]">Cologne Sanskrit Lexicon</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1C1917] block mb-2 uppercase tracking-wider text-[11px]">
              Standards
            </span>
            <ul className="space-y-1.5 text-[#57534E]">
              <li><span>IAST (ISO 15919)</span></li>
              <li><span>Unicode 0900–097F</span></li>
              <li><span>TEI XML Schemas</span></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
        <div>
          © {new Date().getFullYear()} Sanskrit Digital Reader. Educational and research demonstration.
        </div>
        <div className="text-[#A8A29E]">
          Dedicated to digital preservation of classical Indic literature.
        </div>
      </div>
    </footer>
  );
};
