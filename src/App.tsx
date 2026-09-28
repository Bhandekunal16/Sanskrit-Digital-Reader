/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WordAnalysis } from './components/WordAnalysis';
import { TransliterationTool } from './components/TransliterationTool';
import { SanskritReader } from './components/SanskritReader';
import { TechnologySection } from './components/TechnologySection';
import { DigitalPreservation } from './components/DigitalPreservation';
import { Footer } from './components/Footer';
import { SANSKRIT_DICTIONARY, SanskritEntry } from './data/sanskritDictionary';
import { searchDictionary, getEntryByDevanagari } from './lib/dictionary';
import { 
  BookOpen, 
  Languages, 
  ScrollText, 
  Cpu, 
  Info, 
  Search,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dictionary');
  const [searchQuery, setSearchQuery] = useState<string>('धर्मः');
  const [selectedEntry, setSelectedEntry] = useState<SanskritEntry | null>(
    SANSKRIT_DICTIONARY[0] // Initial baseline entry: धर्मः
  );
  const [notFoundQuery, setNotFoundQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SanskritEntry[]>([]);
  const [posFilter, setPosFilter] = useState<string>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const result = searchDictionary(query);

    if (result.exactMatch) {
      setSelectedEntry(result.exactMatch);
      setNotFoundQuery('');
      setSuggestions([]);
    } else if (result.matches.length > 0) {
      setSelectedEntry(result.matches[0]);
      setNotFoundQuery('');
      setSuggestions(result.matches);
    } else {
      setSelectedEntry(null);
      setNotFoundQuery(query);
      setSuggestions(result.suggestions);
    }

    // If searching, ensure user is viewing the dictionary view
    if (activeTab !== 'dictionary' && activeTab !== 'reader') {
      setActiveTab('dictionary');
    }
  };

  const handleSelectWord = (word: string) => {
    setSearchQuery(word);
    handleSearch(word);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectEntry = (entry: SanskritEntry) => {
    setSelectedEntry(entry);
    setSearchQuery(entry.devanagari);
    setNotFoundQuery('');
    setSuggestions([]);
  };

  // Filtered dictionary list for browse mode
  const filteredLexicon = React.useMemo(() => {
    if (posFilter === 'all') return SANSKRIT_DICTIONARY;
    return SANSKRIT_DICTIONARY.filter(e => e.partOfSpeech === posFilter);
  }, [posFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917] font-sans">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchClick={() => {
          setActiveTab('dictionary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onSelectEntry={handleSelectEntry}
          onSelectSampleWord={handleSelectWord}
        />

        {/* Interactive Technology Hub Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          
          {/* Section Heading with Interactive Segmented Control */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8E1D5]">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                Interactive Demonstration
              </span>
              <h2 className="font-serif-editorial text-3xl font-semibold text-[#1C1917]">
                Try Sanskrit Language Technology
              </h2>
            </div>

            {/* Interactive Tab Switcher Buttons (Functional state selectors) */}
            <div className="flex items-center p-1 bg-[#EFE9DD] rounded-xl border border-[#DCD3C3] self-start md:self-auto">
              <button
                onClick={() => setActiveTab('dictionary')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'dictionary'
                    ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Dictionary</span>
              </button>

              <button
                onClick={() => setActiveTab('transliteration')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'transliteration'
                    ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Transliteration</span>
              </button>

              <button
                onClick={() => setActiveTab('reader')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'reader'
                    ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Reader</span>
              </button>

              <button
                onClick={() => setActiveTab('technology')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'technology'
                    ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#8C4A2F]" />
                <span>Technology</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          <div className="transition-opacity duration-200">
            {activeTab === 'dictionary' && (
              <div className="space-y-12">
                <WordAnalysis
                  entry={selectedEntry}
                  notFoundQuery={notFoundQuery}
                  suggestions={suggestions}
                  onSelectWord={handleSelectWord}
                  onExploreReader={() => setActiveTab('reader')}
                />

                {/* Browse the Demo Corpus */}
                <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                        Curated Demo Lexicon ({filteredLexicon.length} Entries)
                      </h3>
                      <p className="text-xs text-[#78716C] mt-1">
                        Explore core grammatical paradigms from classical Sanskrit literature.
                      </p>
                    </div>

                    {/* POS Filter Tabs */}
                    <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-lg border border-[#E8E1D5] text-xs">
                      <button
                        onClick={() => setPosFilter('all')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          posFilter === 'all' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setPosFilter('noun')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          posFilter === 'noun' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        Nouns
                      </button>
                      <button
                        onClick={() => setPosFilter('verb')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          posFilter === 'verb' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        Verbs
                      </button>
                      <button
                        onClick={() => setPosFilter('indeclinable')}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          posFilter === 'indeclinable' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                        }`}
                      >
                        Avyaya
                      </button>
                    </div>
                  </div>

                  {/* Lexicon Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {filteredLexicon.map((item) => {
                      const isSelected = selectedEntry?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleSelectEntry(item);
                            window.scrollTo({ top: 380, behavior: 'smooth' });
                          }}
                          className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-[#FAF7F2] border-[#8C4A2F] ring-1 ring-[#8C4A2F]/30'
                              : 'bg-[#FBF9F5] border-[#EAE3D6] hover:bg-[#F5EFEB] hover:border-[#D6CEBE]'
                          }`}
                        >
                          <div className="flex items-baseline justify-between mb-1">
                            <span className="font-devanagari font-bold text-xl text-[#1C1917] group-hover:text-[#8C4A2F] transition-colors">
                              {item.devanagari}
                            </span>
                            <span className="font-mono-code text-xs text-[#8C4A2F]">
                              {item.iast}
                            </span>
                          </div>

                          <div className="text-xs text-[#57534E] line-clamp-1 mb-2">
                            {item.meaning}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-[#A8A29E] pt-2 border-t border-[#EFE9DD]/80">
                            <span className="capitalize">{item.partOfSpeech}</span>
                            {item.root && item.root !== '—' && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>Root: {item.root}</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transliteration' && (
              <TransliterationTool />
            )}

            {activeTab === 'reader' && (
              <SanskritReader />
            )}

            {activeTab === 'technology' && (
              <TechnologySection />
            )}

            {activeTab === 'about' && (
              <DigitalPreservation />
            )}
          </div>

        </div>

        {/* Global Technology Section (Always reachable at the bottom of the landing page for complete overview) */}
        {activeTab !== 'technology' && activeTab !== 'about' && (
          <section className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <TechnologySection />
            </div>
          </section>
        )}

        {/* Global Digital Preservation Section */}
        {activeTab !== 'about' && (
          <section className="bg-[#FFFFFF] border-t border-[#E8E1D5] py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <DigitalPreservation />
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

    </div>
  );
}
