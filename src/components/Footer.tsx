import React from 'react';
import { Link } from '../lib/router';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        
        {/* Brand Column */}
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <div className="w-6 h-6 rounded bg-[#2C241E] text-white flex items-center justify-center font-devanagari font-bold text-xs group-hover:bg-[#8C4A2F] transition-colors">
              सं
            </div>
            <span className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
              Sanskrit Vani
            </span>
          </Link>
          <p className="text-xs text-[#78716C] leading-relaxed">
            An open educational computational linguistics interface demonstrating digital dictionaries, transliteration, morphological parsing, multilingual translation, and manuscript preservation.
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
                <Link href="/" className="hover:text-[#1C1917] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className="hover:text-[#1C1917] transition-colors">
                  Digital Lexicon
                </Link>
              </li>
              <li>
                <Link href="/transliteration" className="hover:text-[#1C1917] transition-colors">
                  Transliteration Engine
                </Link>
              </li>
              <li>
                <Link href="/translation" className="hover:text-[#1C1917] transition-colors">
                  Multilingual Translation
                </Link>
              </li>
              <li>
                <Link href="/reader" className="hover:text-[#1C1917] transition-colors">
                  Sanskrit Reader
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-[#1C1917] block mb-2 uppercase tracking-wider text-[11px]">
              Linguistics & Heritage
            </span>
            <ul className="space-y-1.5 text-[#57534E]">
              <li>
                <Link href="/technology" className="hover:text-[#1C1917] transition-colors">
                  Language Technology
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#1C1917] transition-colors">
                  Manuscript Preservation
                </Link>
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
          © {new Date().getFullYear()} Sanskrit Vani. Educational and research demonstration.
        </div>
        <div className="text-[#A8A29E]">
          Dedicated to digital preservation of classical Indic literature.
        </div>
      </div>
    </footer>
  );
};
