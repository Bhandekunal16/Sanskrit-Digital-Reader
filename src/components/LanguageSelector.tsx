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
        <Globe className="w-3.5 h-3.5 text-[#8C4A2F]" />
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as TargetLanguage)}
          className="bg-[#FFFFFF] text-[#1C1917] text-xs font-medium border border-[#D6CEBE] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8C4A2F] cursor-pointer shadow-2xs"
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
    <div className={`flex items-center p-1 bg-[#EFE9DD] rounded-xl border border-[#DCD3C3] ${className}`}>
      {languages.map((lang) => {
        const isActive = selectedLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            onClick={() => onLanguageChange(lang.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isActive
                ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <span>{lang.label}</span>
            <span className="text-[11px] opacity-75 font-devanagari">({lang.nativeLabel})</span>
          </button>
        );
      })}
    </div>
  );
};
