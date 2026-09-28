import React from 'react';
import { TargetLanguage } from '../lib/translation';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: TargetLanguage;
  onLanguageChange: (lang: TargetLanguage) => void;
  className?: string;
  variant?: 'pills' | 'dropdown' | 'segmented';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = '',
  variant = 'segmented'
}) => {
  const languages: { id: TargetLanguage; label: string; nativeLabel: string }[] = [
    { id: 'hindi', label: 'Hindi', nativeLabel: 'हिन्दी' },
    { id: 'marathi', label: 'Marathi', nativeLabel: 'मराठी' },
    { id: 'english', label: 'English', nativeLabel: 'English' }
  ];

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`}>
        <Globe className="w-4 h-4 text-[#8C4A2F]" aria-hidden="true" />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as TargetLanguage)}
          className="bg-[#FFFFFF] text-[#1C1917] text-xs sm:text-sm font-medium border border-[#D6CEBE] rounded-xl px-3 py-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] cursor-pointer shadow-2xs"
          aria-label="Select Target Language"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label} ({lang.nativeLabel})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div 
      role="radiogroup" 
      aria-label="Select Target Language" 
      className={`inline-flex items-center p-1 bg-[#EFE9DD] rounded-xl border border-[#DCD3C3] ${className}`}
    >
      {languages.map((lang) => {
        const isActive = selectedLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onLanguageChange(lang.id)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C4A2F] cursor-pointer ${
              isActive
                ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                : 'text-[#57534E] hover:text-[#1C1917] hover:bg-white/40'
            }`}
          >
            <span>{lang.label}</span>
            <span className="text-[11px] sm:text-xs opacity-80 font-devanagari">({lang.nativeLabel})</span>
          </button>
        );
      })}
    </div>
  );
};
