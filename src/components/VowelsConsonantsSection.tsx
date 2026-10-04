import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  VarnaLetter, 
  SANSKRIT_VOWELS, 
  SANSKRIT_CONSONANTS, 
  SANSKRIT_CONJUNCTS, 
  ALL_VARNAMALA_LETTERS,
  BARAHAKHADI_MATRAS,
  PANINIAN_SIKSHA_SUTRAS,
  PaninianSikshaSutra
} from '../data/varnamala';
import { 
  playVarna, 
  playSanskritWord, 
  playVarnaSequence, 
  stopAllAudio, 
  PlaybackOptions 
} from '../lib/phoneticsAudio';
import { 
  Volume2, 
  Play, 
  Square, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Eye, 
  Headphones, 
  Music, 
  HelpCircle,
  Compass,
  Gauge,
  Sliders
} from 'lucide-react';

interface VowelsConsonantsSectionProps {
  onSelectWord?: (word: string) => void;
}

type MainTab = 'explorer' | 'anatomy' | 'barahakhadi' | 'panini' | 'eartraining';
type FilterSection = 'all' | 'vowels' | 'consonants' | 'conjuncts';

export const VowelsConsonantsSection: React.FC<VowelsConsonantsSectionProps> = ({
  onSelectWord
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>('explorer');
  const [filterSection, setFilterSection] = useState<FilterSection>('all');
  const [selectedVarna, setSelectedVarna] = useState<VarnaLetter>(SANSKRIT_VOWELS[0]);
  const [speed, setSpeed] = useState<number>(1.0);
  
  // Autoplay / Guided Tour State
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [sequenceIndex, setSequenceIndex] = useState<number>(-1);
  const cancelSequenceRef = useRef<(() => void) | null>(null);

  // Barahakhadi State
  const [selectedConsonantForMatra, setSelectedConsonantForMatra] = useState<string>('क');
  const [playingMatraIndex, setPlayingMatraIndex] = useState<number | null>(null);

  // Ear Training Quiz State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);

  // Stop any audio on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (cancelSequenceRef.current) {
        cancelSequenceRef.current();
      }
    };
  }, []);

  // Filtered Letters for Explorer
  const visibleLetters = useMemo(() => {
    switch (filterSection) {
      case 'vowels':
        return SANSKRIT_VOWELS;
      case 'consonants':
        return SANSKRIT_CONSONANTS;
      case 'conjuncts':
        return SANSKRIT_CONJUNCTS;
      case 'all':
      default:
        return ALL_VARNAMALA_LETTERS;
    }
  }, [filterSection]);

  const handlePlaySingle = (varna: VarnaLetter) => {
    setSelectedVarna(varna);
    playVarna(varna, { speed });
  };

  const handleStartSequence = (lettersToPlay: VarnaLetter[]) => {
    stopAllAudio();
    setIsPlayingSequence(true);
    setSequenceIndex(0);

    const cancel = playVarnaSequence(
      lettersToPlay,
      (idx, varna) => {
        setSequenceIndex(idx);
        setSelectedVarna(varna);
      },
      () => {
        setIsPlayingSequence(false);
        setSequenceIndex(-1);
      },
      { speed }
    );
    cancelSequenceRef.current = cancel;
  };

  const handleStopSequence = () => {
    stopAllAudio();
    if (cancelSequenceRef.current) {
      cancelSequenceRef.current();
      cancelSequenceRef.current = null;
    }
    setIsPlayingSequence(false);
    setSequenceIndex(-1);
  };

  // Barahakhadi generator
  const generatedBarahakhadi = useMemo(() => {
    // Determine base consonant without inherent vowel
    const baseChar = selectedConsonantForMatra;
    
    return BARAHAKHADI_MATRAS.map((m, idx) => {
      let combinedDevanagari = '';
      let combinedIast = '';

      // Find base IAST
      const baseVarnaObj = ALL_VARNAMALA_LETTERS.find(l => l.devanagari === baseChar);
      const baseIastConsonant = baseVarnaObj ? baseVarnaObj.iast.replace(/a$/, '') : 'k';

      if (m.matraSign === '') {
        combinedDevanagari = baseChar;
        combinedIast = `${baseIastConsonant}a`;
      } else if (m.matraSign === 'ं') {
        combinedDevanagari = `${baseChar}ं`;
        combinedIast = `${baseIastConsonant}aṃ`;
      } else if (m.matraSign === 'ः') {
        combinedDevanagari = `${baseChar}ः`;
        combinedIast = `${baseIastConsonant}aḥ`;
      } else {
        combinedDevanagari = `${baseChar}${m.matraSign}`;
        combinedIast = `${baseIastConsonant}${m.vowelIast}`;
      }

      return {
        id: `matra-${idx}`,
        matraSign: m.matraSign,
        vowel: m.vowelDevanagari,
        vowelIast: m.vowelIast,
        combinedDevanagari,
        combinedIast,
        nameDevanagari: m.nameDevanagari,
        nameEn: m.nameEn
      };
    });
  }, [selectedConsonantForMatra]);

  const handlePlayMatraCombo = async (combo: { combinedDevanagari: string }, index: number) => {
    setPlayingMatraIndex(index);
    await playSanskritWord(combo.combinedDevanagari, { speed });
    setPlayingMatraIndex(null);
  };

  const handlePlayAllBarahakhadi = async () => {
    for (let i = 0; i < generatedBarahakhadi.length; i++) {
      setPlayingMatraIndex(i);
      await playSanskritWord(generatedBarahakhadi[i].combinedDevanagari, { speed });
      await new Promise(r => setTimeout(r, Math.round(900 / speed)));
    }
    setPlayingMatraIndex(null);
  };

  // Ear Training Questions Data
  const earTrainingQuestions = useMemo(() => [
    {
      id: 'et-1',
      target: SANSKRIT_CONSONANTS.find(c => c.devanagari === 'ट')!,
      options: ['ट', 'त', 'ठ', 'ड'],
      title: 'Distinguish Retroflex (ट) vs Dental (त)',
      explanation: 'ट (ṭa) is a retroflex stop (मूर्धन्य) where the curled tongue tip strikes the dome of the palate, whereas त (ta) is a pure dental stop (दन्त्य) with the tongue tip on the upper teeth.'
    },
    {
      id: 'et-2',
      target: SANSKRIT_CONSONANTS.find(c => c.devanagari === 'ध')!,
      options: ['द', 'ध', 'थ', 'ट'],
      title: 'Distinguish Voiced Aspirate (ध) vs Unaspirated (द)',
      explanation: 'ध (dha) is voiced and aspirated (घोष महाप्राण) with warm resonant breath, whereas द (da) is voiced unaspirated (घोष अल्पप्राण).'
    },
    {
      id: 'et-3',
      target: SANSKRIT_CONSONANTS.find(c => c.devanagari === 'श')!,
      options: ['श', 'ष', 'स', 'च'],
      title: 'Distinguish Sibilant Triad: Palatal (श) vs Retroflex (ष) vs Dental (स)',
      explanation: 'श (śa) is a soft palatal sibilant (तालव्य शकार) articulated with flat tongue on the hard roof, distinct from retroflex ष (ṣa) and dental स (sa).'
    },
    {
      id: 'et-4',
      target: SANSKRIT_VOWELS.find(v => v.devanagari === 'ऋ')!,
      options: ['ऋ', 'र', 'इ', 'ॠ'],
      title: 'Identify Vocalic Vowel (ऋ)',
      explanation: 'ऋ (ṛ) is a vocalic retroflex vowel (मूर्धन्य स्वर) sustained with curled tongue resonance without consonant plosion.'
    },
    {
      id: 'et-5',
      target: SANSKRIT_CONSONANTS.find(c => c.devanagari === 'ख')!,
      options: ['क', 'ख', 'ग', 'घ'],
      title: 'Unvoiced Aspirated Guttural (ख)',
      explanation: 'ख (kha) is the aspirated voiceless guttural stop (कण्ठ्य अघोष महाप्राण) produced with an explosive puff of air from the soft palate.'
    },
    {
      id: 'et-6',
      target: SANSKRIT_CONSONANTS.find(c => c.devanagari === 'ण')!,
      options: ['न', 'ण', 'ङ', 'म'],
      title: 'Retroflex Nasal (ण) vs Dental Nasal (न)',
      explanation: 'ण (ṇa) resonates in the nasal cavity with the tongue curled back to the palatal dome (मूर्धन्य नासिक्य), governed by Pāṇinian ṇa-tva.'
    }
  ], []);

  const currentQuiz = earTrainingQuestions[quizQuestionIndex % earTrainingQuestions.length];

  const handlePlayQuizAudio = () => {
    if (currentQuiz?.target) {
      playVarna(currentQuiz.target, { speed: 0.85 });
    }
  };

  const handleQuizOptionSelect = (opt: string) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(opt);
  };

  const handleQuizSubmit = () => {
    if (!quizSelectedOption || quizSubmitted) return;
    const isCorrect = quizSelectedOption === currentQuiz.target.devanagari;
    setQuizSubmitted(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      setQuizStreak(prev => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizQuestionIndex(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header & Navigation Hub */}
      <div className="bg-gradient-to-br from-[#FAF7F2] via-[#FFFFFF] to-[#F5EFEB] border border-[#E8E1D5] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="absolute -right-8 -top-12 opacity-5 pointer-events-none text-9xl font-devanagari select-none text-[#8C4A2F]">
          वर्ण
        </div>

        <div className="max-w-4xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-[#8C4A2F]/10 text-[#8C4A2F] rounded-full text-xs font-bold uppercase tracking-wider">
              ध्वनिविज्ञान एवं उच्चारण (Phonetics & Phonology)
            </span>
            <span className="text-xs text-[#78716C] font-mono-code">
              52 Classical Varṇas · 8 Sthānas · 13 Mātrās
            </span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917] tracking-tight">
            Sanskrit Vowels & Consonants (संस्कृत-वर्णमाला)
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] mt-3 leading-relaxed">
            Watch articulatory anatomy, explore traditional Pāṇinian phonetics, inspect Devanagari character formation, and hear authentic studio-quality audio pronunciation for every vowel, consonant, mātrā, and conjunct.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#E8E1D5]">
            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#EFE9DD]">
              <span className="text-[11px] font-semibold text-[#8C4A2F] uppercase tracking-wider block">
                स्वर (Vowels)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-devanagari text-[#1C1917]">
                १४ <span className="text-xs font-sans text-[#78716C] font-normal">(Svaras)</span>
              </span>
            </div>

            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#EFE9DD]">
              <span className="text-[11px] font-semibold text-[#8C4A2F] uppercase tracking-wider block">
                व्यञ्जन (Consonants)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-devanagari text-[#1C1917]">
                ३३ <span className="text-xs font-sans text-[#78716C] font-normal">(Vyañjanas)</span>
              </span>
            </div>

            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#EFE9DD]">
              <span className="text-[11px] font-semibold text-[#8C4A2F] uppercase tracking-wider block">
                उच्चारण स्थान (Places)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-devanagari text-[#1C1917]">
                ८ <span className="text-xs font-sans text-[#78716C] font-normal">(Sthānas)</span>
              </span>
            </div>

            <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#EFE9DD]">
              <span className="text-[11px] font-semibold text-[#8C4A2F] uppercase tracking-wider block">
                बारहखड़ी (Mātrās)
              </span>
              <span className="text-xl sm:text-2xl font-bold font-devanagari text-[#1C1917]">
                १३ <span className="text-xs font-sans text-[#78716C] font-normal">(Combinations)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8E1D5]">
        <button
          type="button"
          onClick={() => {
            handleStopSequence();
            setActiveTab('explorer');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'explorer'
              ? 'bg-[#2C241E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#E2D8C6]" />
          <span>Complete Varṇamālā (वर्णमाला)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleStopSequence();
            setActiveTab('anatomy');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'anatomy'
              ? 'bg-[#2C241E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
          }`}
        >
          <Eye className="w-4 h-4 text-[#8C4A2F]" />
          <span>Watch: Articulation Anatomy (स्थान-दर्शन)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleStopSequence();
            setActiveTab('barahakhadi');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'barahakhadi'
              ? 'bg-[#2C241E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
          }`}
        >
          <Music className="w-4 h-4 text-[#8C4A2F]" />
          <span>Bāraha-khaḍī Studio (बारहखड़ी)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleStopSequence();
            setActiveTab('panini');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'panini'
              ? 'bg-[#2C241E] text-white shadow-xs font-semibold'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8C4A2F]" />
          <span>Pāṇinian Śikṣā Verses (पाणिनीय-शिक्षा)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleStopSequence();
            setActiveTab('eartraining');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'eartraining'
              ? 'bg-[#8C4A2F] text-white shadow-xs font-semibold'
              : 'bg-white text-[#57534E] hover:bg-[#F2ECE1] border border-[#E8E1D5]'
          }`}
        >
          <Headphones className="w-4 h-4 text-amber-200" />
          <span>Ear Training Practice (श्रवण-अभ्यास)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: COMPLETE VARNAMALA EXPLORER (Watch & Hear)
      ========================================================================= */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Filter + Speed + Autoplay */}
          <div className="p-4 sm:p-5 bg-white border border-[#E8E1D5] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C] mr-1">
                Filter:
              </span>
              <button
                type="button"
                onClick={() => setFilterSection('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterSection === 'all'
                    ? 'bg-[#2C241E] text-white font-semibold'
                    : 'bg-[#F7F4EE] text-[#57534E] hover:bg-[#EAE3D6]'
                }`}
              >
                All (सम्पूर्ण ५२)
              </button>
              <button
                type="button"
                onClick={() => setFilterSection('vowels')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterSection === 'vowels'
                    ? 'bg-[#8C4A2F] text-white font-semibold'
                    : 'bg-[#F7F4EE] text-[#57534E] hover:bg-[#EAE3D6]'
                }`}
              >
                Vowels (स्वर - १४)
              </button>
              <button
                type="button"
                onClick={() => setFilterSection('consonants')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterSection === 'consonants'
                    ? 'bg-[#8C4A2F] text-white font-semibold'
                    : 'bg-[#F7F4EE] text-[#57534E] hover:bg-[#EAE3D6]'
                }`}
              >
                Consonants (व्यञ्जन - ३३)
              </button>
              <button
                type="button"
                onClick={() => setFilterSection('conjuncts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterSection === 'conjuncts'
                    ? 'bg-[#8C4A2F] text-white font-semibold'
                    : 'bg-[#F7F4EE] text-[#57534E] hover:bg-[#EAE3D6]'
                }`}
              >
                Conjuncts & Vedic (५)
              </button>
            </div>

            {/* Audio Autoplay Tour & Speed Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              
              {/* Speed Preset */}
              <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-xl border border-[#E8E1D5] text-xs">
                <span className="text-[10px] font-mono-code font-bold uppercase text-[#78716C] px-1.5">
                  Speed
                </span>
                {[0.5, 0.75, 1.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer font-mono-code ${
                      speed === s
                        ? 'bg-white text-[#1C1917] font-bold shadow-2xs'
                        : 'text-[#78716C] hover:text-[#1C1917]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Autoplay / Stop Guided Tour */}
              {isPlayingSequence ? (
                <button
                  type="button"
                  onClick={handleStopSequence}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all animate-pulse"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Tour ({sequenceIndex + 1}/{visibleLetters.length})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartSequence(visibleLetters)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8C4A2F] hover:bg-[#723B25] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play All in Sequence (स्वर-गान)</span>
                </button>
              )}

            </div>

          </div>

          {/* Main Grid: Letter Cards + Selected Letter Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Interactive Grid of Letters */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {visibleLetters.map((varna, idx) => {
                  const isSelected = selectedVarna.id === varna.id;
                  const isCurrentlyPlayingInSequence = isPlayingSequence && sequenceIndex === idx;

                  return (
                    <div
                      key={varna.id}
                      onClick={() => handlePlaySingle(varna)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                        isCurrentlyPlayingInSequence
                          ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-md ring-2 ring-amber-400 scale-[1.02]'
                          : isSelected
                          ? 'bg-[#FAF7F2] border-[#8C4A2F] shadow-xs ring-1 ring-[#8C4A2F]'
                          : 'bg-white hover:bg-[#FAF7F2] border-[#E8E1D5] hover:border-[#D6CAB7]'
                      }`}
                    >
                      {/* Top Row: Articulation place pill + Audio button */}
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className={`text-[10px] font-mono-code px-1.5 py-0.5 rounded truncate max-w-[90px] ${
                          isCurrentlyPlayingInSequence
                            ? 'bg-white/20 text-white font-bold'
                            : isSelected
                            ? 'bg-[#8C4A2F]/10 text-[#8C4A2F] font-semibold'
                            : 'bg-[#F5EFEB] text-[#78716C]'
                        }`}>
                          {varna.placeSa}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySingle(varna);
                          }}
                          className={`p-1 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                            isCurrentlyPlayingInSequence
                              ? 'text-white hover:bg-white/20'
                              : isSelected
                              ? 'text-[#8C4A2F] hover:bg-[#8C4A2F]/10'
                              : 'text-[#78716C] group-hover:text-[#8C4A2F]'
                          }`}
                          title={`Hear ${varna.devanagari}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Big Character Display */}
                      <div className="text-center my-2">
                        <span className={`font-devanagari font-bold text-4xl leading-tight block ${
                          isCurrentlyPlayingInSequence ? 'text-white' : 'text-[#1C1917]'
                        }`}>
                          {varna.devanagari}
                        </span>
                        <span className={`font-mono-code font-semibold text-xs mt-0.5 block ${
                          isCurrentlyPlayingInSequence ? 'text-amber-200' : 'text-[#8C4A2F]'
                        }`}>
                          {varna.iast} <span className="text-[10px] opacity-70">({varna.ipa})</span>
                        </span>
                      </div>

                      {/* Bottom Row: Exemplar Word preview */}
                      <div className={`pt-2 border-t text-[11px] flex items-center justify-between ${
                        isCurrentlyPlayingInSequence
                          ? 'border-white/20 text-stone-100'
                          : isSelected
                          ? 'border-[#E8E1D5] text-[#57534E]'
                          : 'border-[#F2ECE1] text-[#78716C]'
                      }`}>
                        <span className="font-devanagari font-medium truncate">
                          {varna.exemplar.devanagari}
                        </span>
                        <span className="truncate ml-1 opacity-80">
                          {varna.exemplar.meaningEn}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right 4 Cols: Rich Selected Letter Inspector */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 shadow-xs sticky top-20 space-y-5">
                
                {/* Header with audio play */}
                <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8C4A2F] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8C4A2F]">
                      Varṇa Inspector
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlaySingle(selectedVarna)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8C4A2F] hover:bg-[#723B25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Pronounce</span>
                  </button>
                </div>

                {/* Big Visual Character Showcase */}
                <div className="text-center p-5 bg-gradient-to-b from-[#FAF7F2] to-white rounded-2xl border border-[#EAE3D6]">
                  <span className="font-devanagari font-bold text-6xl sm:text-7xl text-[#1C1917] block drop-shadow-2xs">
                    {selectedVarna.devanagari}
                  </span>

                  <div className="flex items-center justify-center gap-3 mt-2 font-mono-code">
                    <span className="text-base font-bold text-[#8C4A2F]">
                      {selectedVarna.iast}
                    </span>
                    <span className="text-xs text-[#78716C] bg-white px-2 py-0.5 rounded border border-[#E8E1D5]">
                      IPA: {selectedVarna.ipa}
                    </span>
                  </div>

                  {selectedVarna.matraDuration && (
                    <span className="inline-block mt-2 text-xs font-medium text-[#57534E] bg-[#F5EFEB] px-2.5 py-1 rounded-full">
                      Duration: {selectedVarna.matraDuration}
                    </span>
                  )}
                </div>

                {/* Linguistic Classification Specs */}
                <div className="space-y-2.5 text-xs">
                  
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6]">
                    <span className="text-[#8C4A2F] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                      स्थान (Place of Articulation)
                    </span>
                    <div className="font-semibold text-[#1C1917] text-sm">
                      {selectedVarna.placeSa} · {selectedVarna.placeEn}
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-0.5">
                      {selectedVarna.organSa} ({selectedVarna.organEn})
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6]">
                    <span className="text-[#8C4A2F] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                      प्रयत्न (Internal & External Effort)
                    </span>
                    <div className="text-[#1C1917] font-medium">
                      <strong>आभ्यन्तर:</strong> {selectedVarna.internalEffortSa}
                    </div>
                    <div className="text-[#57534E] mt-1">
                      <strong>बाह्य:</strong> {selectedVarna.externalEffortSa}
                    </div>
                  </div>

                  {selectedVarna.paniniSutra && (
                    <div className="p-3 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8]">
                      <span className="text-[#8C4A2F] font-bold block mb-1 uppercase tracking-wider text-[10px]">
                        पाणिनीय शिक्षा सूत्र (Pāṇinian Rule)
                      </span>
                      <div className="font-devanagari font-bold text-sm text-[#1C1917]">
                        {selectedVarna.paniniSutra}
                      </div>
                      <div className="text-[11px] text-[#78716C] mt-1 italic">
                        {selectedVarna.paniniSutraMeaning}
                      </div>
                    </div>
                  )}

                  {/* Pronunciation Tip */}
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900">
                    <span className="font-bold block mb-0.5 text-[10px] uppercase tracking-wider text-blue-800">
                      💡 Pronunciation Guide
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {selectedVarna.pronunciationTip}
                    </p>
                  </div>

                </div>

                {/* Exemplar Word Card */}
                <div className="pt-3 border-t border-[#E8E1D5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-2">
                    Exemplar Sanskrit Word (उदाहरणार्य शब्द)
                  </span>

                  <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-devanagari font-bold text-lg text-[#1C1917]">
                          {selectedVarna.exemplar.devanagari}
                        </span>
                        <span className="text-xs font-mono-code text-[#8C4A2F]">
                          ({selectedVarna.exemplar.iast})
                        </span>
                      </div>
                      <div className="text-xs text-[#57534E] mt-0.5">
                        {selectedVarna.exemplar.meaningEn} · <span className="font-devanagari">{selectedVarna.exemplar.meaningHi}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => playSanskritWord(selectedVarna.exemplar.devanagari, { speed })}
                        className="p-2 bg-white hover:bg-[#F2ECE1] border border-[#E8E1D5] text-[#8C4A2F] rounded-lg transition-colors cursor-pointer"
                        title="Hear word"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {onSelectWord && (
                        <button
                          type="button"
                          onClick={() => onSelectWord(selectedVarna.exemplar.devanagari)}
                          className="p-2 bg-white hover:bg-[#F2ECE1] border border-[#E8E1D5] text-[#57534E] rounded-lg transition-colors cursor-pointer"
                          title="View in Dictionary"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: WATCH - ARTICULATION ANATOMY STUDIO (स्थान-दर्शन)
      ========================================================================= */}
      {activeTab === 'anatomy' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C4A2F]">
                Anatomical Vocal Tract Explorer (उच्चारण-स्थान विज्ञान)
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
                Where Sanskrit Sounds Are Born
              </h2>
              <p className="text-sm text-[#78716C] mt-2 max-w-3xl leading-relaxed">
                Pāṇini mapped the human vocal apparatus into distinct anatomical zones. Click any organ point below to see and hear all the vowels and consonants produced by that specific part of the mouth and throat.
              </p>
            </div>

            {/* Interactive Sthāna Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {PANINIAN_SIKSHA_SUTRAS.map((sutra) => (
                <div
                  key={sutra.id}
                  className="p-5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl space-y-3 hover:border-[#8C4A2F] transition-all"
                >
                  <div className="flex items-start justify-between border-b border-[#E8E1D5] pb-2.5">
                    <div>
                      <span className="font-devanagari font-bold text-lg text-[#1C1917] block">
                        {sutra.placeSa}
                      </span>
                      <span className="text-xs text-[#78716C] font-medium">
                        {sutra.placeEn}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code font-bold text-[#8C4A2F] bg-white px-2 py-0.5 rounded border border-[#E8E1D5]">
                      {sutra.includedVarnas.length} Varṇas
                    </span>
                  </div>

                  {/* Sūtra Quote */}
                  <div className="p-2.5 bg-white rounded-xl border border-[#EFE9DD]">
                    <div className="font-devanagari font-bold text-xs text-[#8C4A2F]">
                      {sutra.sutraDevanagari}
                    </div>
                    <div className="text-[11px] text-[#78716C] mt-1 leading-snug">
                      {sutra.explanationEn}
                    </div>
                  </div>

                  {/* Varnas in this category */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sutra.includedVarnas.map((char) => {
                      const letterObj = ALL_VARNAMALA_LETTERS.find(l => l.devanagari === char);
                      return (
                        <button
                          key={char}
                          type="button"
                          onClick={() => {
                            if (letterObj) handlePlaySingle(letterObj);
                            else playSanskritWord(char, { speed });
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#8C4A2F] hover:text-white border border-[#E0D8CA] rounded-lg text-xs font-devanagari font-bold text-[#1C1917] transition-all cursor-pointer flex items-center gap-1 shadow-2xs group"
                        >
                          <span>{char}</span>
                          <Volume2 className="w-3 h-3 text-[#8C4A2F] group-hover:text-white" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>

            {/* Akṣara Anatomy: Character Construction Breakdown */}
            <div className="p-6 bg-gradient-to-br from-[#FAF7F2] to-white border border-[#EAE3D6] rounded-2xl space-y-4 mt-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8C4A2F]" />
                <h3 className="font-serif-editorial text-lg font-bold text-[#1C1917]">
                  Akṣara Anatomy Formula (वर्ण-संयोग संरचना)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#78716C]">
                In Sanskrit linguistics, every full consonant syllable (अक्षर) is a compound formed by fusing a pure consonant (हलन्त) with a vocalic mātrā (स्वर).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl border border-[#E8E1D5]">
                  <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block mb-1">
                    1. Pure Halanta Base (व्यञ्जन)
                  </span>
                  <span className="font-devanagari font-bold text-3xl text-[#8C4A2F]">क्</span>
                  <span className="text-xs font-mono-code text-[#78716C] block mt-1">(k - Unreleased Stop)</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E8E1D5]">
                  <span className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block mb-1">
                    2. Vocalic Mātrā (स्वर)
                  </span>
                  <span className="font-devanagari font-bold text-3xl text-[#8C4A2F]">ा (आ)</span>
                  <span className="text-xs font-mono-code text-[#78716C] block mt-1">(ā - Long Guttural Vowel)</span>
                </div>

                <div className="p-4 bg-[#8C4A2F] text-white rounded-xl border border-[#8C4A2F] shadow-xs">
                  <span className="text-[11px] uppercase tracking-wider text-amber-200 font-semibold block mb-1">
                    3. Syllable (पूर्ण अक्षर)
                  </span>
                  <span className="font-devanagari font-bold text-3xl text-white">का</span>
                  <span className="text-xs font-mono-code text-stone-200 block mt-1">(kā - Resonant Syllable)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: BĀRAHA-KHAḌĪ MĀTRĀ STUDIO (बारहखड़ी)
      ========================================================================= */}
      {activeTab === 'barahakhadi' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C4A2F]">
                  Mātrā Matrix & Vowel Combos
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
                  Sanskrit Bāraha-khaḍī Studio (बारहखड़ी)
                </h2>
                <p className="text-sm text-[#78716C] mt-1">
                  Select any consonant to generate and hear all 13 primary vowel mātrā combinations (क, का, कि, की, कु, कू, कृ, के, कै, को, कौ, कं, कः).
                </p>
              </div>

              {/* Play all barahakhadi button */}
              <button
                type="button"
                onClick={handlePlayAllBarahakhadi}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#8C4A2F] hover:bg-[#723B25] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer self-start"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Chant Full {selectedConsonantForMatra}-Series</span>
              </button>
            </div>

            {/* Consonant Selector Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                Choose Base Consonant:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SANSKRIT_CONSONANTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedConsonantForMatra(c.devanagari)}
                    className={`w-9 h-9 rounded-xl font-devanagari font-bold text-base transition-all cursor-pointer flex items-center justify-center ${
                      selectedConsonantForMatra === c.devanagari
                        ? 'bg-[#8C4A2F] text-white shadow-xs scale-105'
                        : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C1917] border border-[#E0D8CA]'
                    }`}
                  >
                    {c.devanagari}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Barahakhadi Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-4 border-t border-[#E8E1D5]">
              {generatedBarahakhadi.map((item, idx) => {
                const isPlaying = playingMatraIndex === idx;

                return (
                  <div
                    key={item.id}
                    onClick={() => handlePlayMatraCombo(item, idx)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between group ${
                      isPlaying
                        ? 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-md ring-2 ring-amber-300 scale-105'
                        : 'bg-[#FAF7F2] hover:bg-white border-[#EAE3D6] hover:border-[#8C4A2F]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#78716C]">
                      <span className={isPlaying ? 'text-amber-200 font-bold' : ''}>
                        {item.vowel} ({item.vowelIast})
                      </span>
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-white' : 'text-[#8C4A2F]'}`} />
                    </div>

                    <div className="my-3">
                      <span className={`font-devanagari font-bold text-4xl block ${
                        isPlaying ? 'text-white' : 'text-[#1C1917]'
                      }`}>
                        {item.combinedDevanagari}
                      </span>
                      <span className={`font-mono-code text-xs font-semibold mt-1 block ${
                        isPlaying ? 'text-amber-200' : 'text-[#8C4A2F]'
                      }`}>
                        {item.combinedIast}
                      </span>
                    </div>

                    <div className={`text-[10px] pt-1.5 border-t truncate ${
                      isPlaying ? 'border-white/20 text-stone-200' : 'border-[#E8E1D5] text-[#78716C]'
                    }`}>
                      {item.nameEn}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: PĀṆINIAN ŚIKṢĀ TRADITIONAL VERSES (पाणिनीय-शिक्षा)
      ========================================================================= */}
      {activeTab === 'panini' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C4A2F]">
                Traditional Sanskrit Recitation Mnemonic
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
                Pāṇinian Śikṣā Articulation Sūtras (शिक्षा-सूत्राणि)
              </h2>
              <p className="text-sm text-[#78716C] mt-2 max-w-3xl leading-relaxed">
                For millennia, Sanskrit scholars committed phonological rules to memory using rhythmic verses composed by sage Pāṇini. Click the speaker icon beside any sūtra to hear the classical Sanskrit chanting.
              </p>
            </div>

            <div className="space-y-4">
              {PANINIAN_SIKSHA_SUTRAS.map((sutra, idx) => (
                <div
                  key={sutra.id}
                  className="p-5 sm:p-6 bg-[#FAF7F2] border border-[#EAE3D6] rounded-2xl hover:border-[#8C4A2F] transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E1D5] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#8C4A2F] text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-devanagari font-bold text-xl text-[#1C1917]">
                          {sutra.sutraDevanagari}
                        </span>
                        <span className="text-xs font-mono-code text-[#8C4A2F] ml-2 font-semibold">
                          ({sutra.sutraIast})
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => playSanskritWord(sutra.sutraDevanagari, { speed: 0.8 })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#8C4A2F] text-[#8C4A2F] hover:text-white rounded-xl text-xs font-semibold border border-[#E8E1D5] transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Chant Sūtra</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#EFE9DD]">
                      <span className="text-[10px] uppercase font-bold text-[#8C4A2F] block mb-0.5">
                        English Translation & Scope:
                      </span>
                      <p className="text-[#1C1917] leading-relaxed">
                        {sutra.explanationEn}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#EFE9DD]">
                      <span className="text-[10px] uppercase font-bold text-[#8C4A2F] block mb-0.5">
                        हिन्दी व्याख्या (Hindi Meaning):
                      </span>
                      <p className="font-devanagari text-[#1C1917] leading-relaxed">
                        {sutra.explanationHi}
                      </p>
                    </div>
                  </div>

                  {/* Characters governed */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-[11px] font-bold text-[#78716C]">
                      Governed Varṇas:
                    </span>
                    {sutra.includedVarnas.map(c => (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-white rounded-md text-xs font-devanagari font-bold text-[#8C4A2F] border border-[#E8E1D5]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 5: EAR TRAINING PRACTICE QUIZ (श्रवण-अभ्यास)
      ========================================================================= */}
      {activeTab === 'eartraining' && (
        <div className="space-y-6">
          
          <div className="bg-white border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl mx-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C4A2F]">
                  Acoustic Discrimination Trainer
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#1C1917] mt-1">
                  Sanskrit Ear Training (श्रवण-अभ्यास)
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-[#78716C] block">
                    Score
                  </span>
                  <span className="text-lg font-bold text-[#8C4A2F]">
                    {quizScore} pts
                  </span>
                </div>
                {quizStreak > 1 && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
                    🔥 {quizStreak} Streak
                  </span>
                )}
              </div>
            </div>

            {/* Prompt Box */}
            <div className="p-6 bg-gradient-to-b from-[#FAF7F2] to-white rounded-2xl border border-[#EAE3D6] text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                Question {(quizQuestionIndex % earTrainingQuestions.length) + 1} of {earTrainingQuestions.length}
              </span>

              <h3 className="font-serif-editorial text-xl font-bold text-[#1C1917]">
                {currentQuiz.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C]">
                Click the large audio button to hear the mystery Sanskrit sound, then select the matching letter.
              </p>

              {/* Big Audio Play Button */}
              <button
                type="button"
                onClick={handlePlayQuizAudio}
                className="w-20 h-20 mx-auto rounded-full bg-[#8C4A2F] hover:bg-[#723B25] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Play Audio Sound"
              >
                <Volume2 className="w-9 h-9 animate-pulse" />
              </button>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentQuiz.options.map((opt) => {
                const isSelected = quizSelectedOption === opt;
                const isCorrect = opt === currentQuiz.target.devanagari;
                
                let buttonStyle = 'bg-white hover:bg-[#FAF7F2] border-[#E8E1D5] text-[#1C1917]';
                if (quizSubmitted) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold';
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = 'bg-rose-600 text-white border-rose-600';
                  } else {
                    buttonStyle = 'bg-stone-50 border-[#E8E1D5] text-[#A8A29E] opacity-60';
                  }
                } else if (isSelected) {
                  buttonStyle = 'bg-[#8C4A2F] text-white border-[#8C4A2F] shadow-xs';
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => handleQuizOptionSelect(opt)}
                    className={`p-5 rounded-2xl border text-center transition-all cursor-pointer ${buttonStyle}`}
                  >
                    <span className="font-devanagari font-bold text-4xl block">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Next Action */}
            <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
              {!quizSubmitted ? (
                <button
                  type="button"
                  disabled={!quizSelectedOption}
                  onClick={handleQuizSubmit}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                    quizSelectedOption
                      ? 'bg-[#8C4A2F] hover:bg-[#723B25] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer (उत्तर प्रस्तुत करें)
                </button>
              ) : (
                <div className="w-full space-y-4">
                  <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                    quizSelectedOption === currentQuiz.target.devanagari
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {quizSelectedOption === currentQuiz.target.devanagari ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct! Excellent listening acuity.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>The correct sound was "{currentQuiz.target.devanagari}" ({currentQuiz.target.iast}).</span>
                        </>
                      )}
                    </div>
                    <p>{currentQuiz.explanation}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3 bg-[#2C241E] hover:bg-[#1C1917] text-white rounded-xl font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Next Sound (अगला प्रश्न)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
