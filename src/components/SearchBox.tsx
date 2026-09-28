import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Sparkles, BookOpen } from 'lucide-react';
import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';
import { normalizeIast } from '../lib/dictionary';

interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (term: string) => void;
  onSelectEntry?: (entry: SanskritEntry) => void;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearch,
  onSelectEntry,
  autoFocus = false,
  placeholder = 'Enter a Sanskrit word, e.g. धर्मः',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-complete filtered items
  const suggestions = React.useMemo(() => {
    const q = value.trim();
    if (!q) return [];
    const qLower = q.toLowerCase();
    const qNorm = normalizeIast(q);

    return SANSKRIT_DICTIONARY.filter(entry => {
      return (
        entry.devanagari.includes(q) ||
        entry.iast.toLowerCase().includes(qLower) ||
        normalizeIast(entry.iast).includes(qNorm) ||
        entry.meaning.toLowerCase().includes(qLower)
      );
    }).slice(0, 5);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleSelect = (entry: SanskritEntry) => {
    onChange(entry.devanagari);
    setIsOpen(false);
    if (onSelectEntry) {
      onSelectEntry(entry);
    } else {
      onSearch(entry.devanagari);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-[#8C4A2F]">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-[#FFFFFF] text-[#1C1917] placeholder:text-[#A8A29E] text-base sm:text-lg rounded-xl border border-[#D6CEBE] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8C4A2F]/40 focus:border-[#8C4A2F] transition-all"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 text-[#A8A29E] hover:text-[#1C1917] rounded-md transition-colors"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#8C4A2F] hover:bg-[#723922] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span>Analyze</span>
            <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </form>

      {/* Auto-suggest dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFFFF] border border-[#E5DECF] rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-1.5 divide-y divide-[#F5F0E6]">
            {suggestions.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelect(entry)}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-[#F9F7F2] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-devanagari font-bold text-lg text-[#1C1917] group-hover:text-[#8C4A2F] transition-colors">
                    {entry.devanagari}
                  </span>
                  <span className="text-sm font-mono-code text-[#78716C]">
                    {entry.iast}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#78716C] max-w-[50%] truncate">
                  <span className="text-[#A8A29E] italic capitalize">{entry.partOfSpeech}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{entry.meaning}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
