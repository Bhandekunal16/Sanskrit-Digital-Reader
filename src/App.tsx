/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RouterProvider, usePathname, useRouter, Link } from './lib/router';
import { SanskritWorkspaceProvider, useSanskritWorkspace } from './lib/sanskrit-context';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WordAnalysis } from './components/WordAnalysis';
import { TransliterationTool } from './components/TransliterationTool';
import { TranslationTool } from './components/TranslationTool';
import { SanskritReader } from './components/SanskritReader';
import { PhonologicalMap } from './components/PhonologicalMap';
import { TechnologySection } from './components/TechnologySection';
import { DigitalPreservation } from './components/DigitalPreservation';
import { Footer } from './components/Footer';
import { SANSKRIT_DICTIONARY, SanskritEntry } from './data/sanskritDictionary';
import { searchDictionary, getEntryByDevanagari } from './lib/dictionary';
import { 
  BookOpen, 
  ArrowRightLeft, 
  Globe, 
  ScrollText, 
  Cpu, 
  Info,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { setSelectedTokenBySurface, selectedToken, loadSample } = useSanskritWorkspace();

  const [searchQuery, setSearchQuery] = useState<string>('धर्मः');
  const [selectedEntry, setSelectedEntry] = useState<SanskritEntry | null>(
    SANSKRIT_DICTIONARY[0] // Initial baseline entry: धर्मः
  );
  const [notFoundQuery, setNotFoundQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SanskritEntry[]>([]);
  const [posFilter, setPosFilter] = useState<string>('all');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const result = searchDictionary(query);

    if (result.exactMatch) {
      setSelectedEntry(result.exactMatch);
      setNotFoundQuery('');
      setSuggestions([]);
      setSelectedTokenBySurface(result.exactMatch.devanagari);
    } else if (result.matches.length > 0) {
      setSelectedEntry(result.matches[0]);
      setNotFoundQuery('');
      setSuggestions(result.matches);
      setSelectedTokenBySurface(result.matches[0].devanagari);
    } else {
      setSelectedEntry(null);
      setNotFoundQuery(query);
      setSuggestions(result.suggestions);
      setSelectedTokenBySurface(query);
    }

    // Direct to dictionary page if searching from another page
    if (pathname !== '/dictionary' && pathname !== '/') {
      router.push('/dictionary');
    }
  }, [pathname, router, setSelectedTokenBySurface]);

  const handleSelectWord = useCallback((word: string) => {
    setSearchQuery(word);
    handleSearch(word);
    setSelectedTokenBySurface(word);
    if (pathname !== '/dictionary') {
      router.push('/dictionary');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleSearch, pathname, router, setSelectedTokenBySurface]);

  const handleSelectEntry = (entry: SanskritEntry) => {
    setSelectedEntry(entry);
    setSearchQuery(entry.devanagari);
    setNotFoundQuery('');
    setSuggestions([]);
    setSelectedTokenBySurface(entry.devanagari);
  };

  // Keep dictionary entry updated if selected token changes
  useEffect(() => {
    if (selectedToken && selectedToken.clean) {
      const match = getEntryByDevanagari(selectedToken.clean);
      if (match) {
        setSelectedEntry(match);
        setNotFoundQuery('');
      } else {
        setSelectedEntry(null);
        setNotFoundQuery(selectedToken.clean);
      }
    }
  }, [selectedToken]);

  // Filtered dictionary list for browse mode
  const filteredLexicon = useMemo(() => {
    if (posFilter === 'all') return SANSKRIT_DICTIONARY;
    return SANSKRIT_DICTIONARY.filter(e => e.partOfSpeech === posFilter);
  }, [posFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917] font-sans">
      
      {/* Universal Header with 7-Route Navigation & Mobile Drawer */}
      <Header onSearchClick={() => router.push('/dictionary')} />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* ROUTE 1: Home Page (/) */}
        {pathname === '/' && (
          <div>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onSelectEntry={handleSelectEntry}
              onSelectSampleWord={handleSelectWord}
            />

            {/* Quick Interactive Feature Hub */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
              
              <div className="mb-8">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                  Platform Overview
                </span>
                <h2 className="font-serif-editorial text-3xl font-semibold text-[#1C1917]">
                  Explore Sanskrit Language Technology Modules
                </h2>
                <p className="text-sm text-[#78716C] mt-1">
                  Choose a dedicated module below or use the top navigation to begin.
                </p>
              </div>

              {/* Module Launch Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                
                <Link
                  href="/dictionary"
                  className="p-5 bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-3 group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                      Digital Lexicon
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1">
                      Search Sanskrit vocabulary, roots (dhātu), vibhakti cases, and Pāṇinian morphological decomposition.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F2EDE2] flex items-center justify-between text-xs font-medium text-[#8C4A2F]">
                    <span>Search Words</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/transliteration"
                  className="p-5 bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-3 group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                      Transliteration
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1">
                      Convert between Devanagari script and standardized IAST (ISO 15919) with phonotactic precision.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F2EDE2] flex items-center justify-between text-xs font-medium text-[#8C4A2F]">
                    <span>Convert Script</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/translation"
                  className="p-5 bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-3 group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                      Translation
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1">
                      Translate Sanskrit words and sentences into Hindi (हिन्दी), Marathi (मराठी), and English.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F2EDE2] flex items-center justify-between text-xs font-medium text-[#8C4A2F]">
                    <span>Translate Sanskrit</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link
                  href="/reader"
                  className="p-5 bg-white border border-[#E8E1D5] hover:border-[#8C4A2F]/50 rounded-2xl shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#8C4A2F] border border-[#EAE3D6] flex items-center justify-center mb-3 group-hover:bg-[#8C4A2F] group-hover:text-white transition-colors">
                      <ScrollText className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif-editorial text-lg font-semibold text-[#1C1917]">
                      Sanskrit Reader
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1">
                      Read classical verses with clickable word tokens, Sandhi resolution, and prose order (Anvaya).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#F2EDE2] flex items-center justify-between text-xs font-medium text-[#8C4A2F]">
                    <span>Read Verses</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

              </div>

              {/* Sample Analysis Highlight */}
              <div className="space-y-12">
                <WordAnalysis
                  entry={selectedEntry}
                  notFoundQuery={notFoundQuery}
                  suggestions={suggestions}
                  onSelectWord={handleSelectWord}
                  onExploreReader={() => router.push('/reader')}
                />
              </div>

            </div>

            {/* Language Technology Section on Home */}
            <section className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <TechnologySection />
              </div>
            </section>

            {/* Preservation Section on Home */}
            <section className="bg-[#FFFFFF] border-t border-[#E8E1D5] py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <DigitalPreservation />
              </div>
            </section>
          </div>
        )}

        {/* ROUTE 2: Dictionary Page (/dictionary) */}
        {pathname === '/dictionary' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <div className="border-b border-[#E8E1D5] pb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                Linguistic Lexicon & Morphological Inspector
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
                Digital Sanskrit Dictionary
              </h1>
              <p className="text-sm text-[#78716C] mt-2">
                Search Sanskrit vocabulary in Devanagari, IAST, or English to inspect root (dhātu) derivations, case inflections, and literary context.
              </p>
            </div>

            <WordAnalysis
              entry={selectedEntry}
              notFoundQuery={notFoundQuery}
              suggestions={suggestions}
              onSelectWord={handleSelectWord}
              onExploreReader={() => router.push('/reader')}
            />

            {/* Full Curated Lexicon Explorer */}
            <div className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif-editorial text-xl font-semibold text-[#1C1917]">
                    Curated Lexicon Database ({filteredLexicon.length} Entries)
                  </h3>
                  <p className="text-xs text-[#78716C] mt-1">
                    Explore core grammatical paradigms and multilingual definitions from classical literature.
                  </p>
                </div>

                {/* POS Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-lg border border-[#E8E1D5] text-xs">
                  <button
                    type="button"
                    onClick={() => setPosFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      posFilter === 'all' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosFilter('noun')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      posFilter === 'noun' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    Nouns
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosFilter('verb')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      posFilter === 'verb' ? 'bg-white text-[#1C1917] font-semibold shadow-2xs' : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    Verbs
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosFilter('indeclinable')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
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
                      type="button"
                      onClick={() => {
                        handleSelectEntry(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`p-3.5 text-left rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
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
                        {item.meaningHindi && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-devanagari truncate">{item.meaningHindi.split(',')[0]}</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phonological Articulation Map Section in Dictionary */}
            <PhonologicalMap
              initialWord={selectedEntry ? selectedEntry.devanagari : searchQuery}
              onSelectWord={handleSelectWord}
            />
          </div>
        )}

        {/* ROUTE 3: Transliteration Page (/transliteration) */}
        {pathname === '/transliteration' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <div className="border-b border-[#E8E1D5] pb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                Phonetic Standardization
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
                Sanskrit Transliteration Engine
              </h1>
              <p className="text-sm text-[#78716C] mt-2">
                Convert losslessly between Devanagari script and the International Alphabet of Sanskrit Transliteration (IAST, ISO 15919).
              </p>
            </div>

            <TransliterationTool onSelectWord={handleSelectWord} />
          </div>
        )}

        {/* ROUTE 4: Translation Page (/translation) */}
        {pathname === '/translation' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <div className="border-b border-[#E8E1D5] pb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                Cross-Lingual Access
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
                Sanskrit Multilingual Translation
              </h1>
              <p className="text-sm text-[#78716C] mt-2">
                Translate classical Sanskrit words and verses into Hindi (हिन्दी), Marathi (मराठी), and English with comparative views and tokenized glosses.
              </p>
            </div>

            <TranslationTool onWordClick={handleSelectWord} />
          </div>
        )}

        {/* ROUTE 5: Reader Page (/reader) */}
        {pathname === '/reader' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <div className="border-b border-[#E8E1D5] pb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C4A2F] block mb-1">
                Interactive Text Annotation
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold text-[#1C1917]">
                Sanskrit Passage Reader
              </h1>
              <p className="text-sm text-[#78716C] mt-2">
                Read classical Sanskrit passages, click individual words for morphological parsing and multilingual meanings, and inspect Pāṇinian prose order (Anvaya).
              </p>
            </div>

            <SanskritReader onSelectWordForDictionary={handleSelectWord} />
          </div>
        )}

        {/* ROUTE 6: Language Technology Page (/technology) */}
        {pathname === '/technology' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <TechnologySection />
          </div>
        )}

        {/* ROUTE 7: About Page (/about) */}
        {pathname === '/about' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
            <DigitalPreservation />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <SanskritWorkspaceProvider>
        <AppContent />
      </SanskritWorkspaceProvider>
    </RouterProvider>
  );
}
