import { 
  SANSKRIT_PHONEMES, 
  PHONOLOGICAL_GROUPS, 
  SanskritPhoneme, 
  PhonologicalGroup, 
  PhonologicalGroupData 
} from '../data/phonology';
import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';

export interface AnalyzedPhonemeToken {
  grapheme: string;
  iast: string;
  phoneme?: SanskritPhoneme;
  role: 'independent_vowel' | 'consonant' | 'matra_vowel' | 'inherent_vowel' | 'modifier' | 'other';
  groupName: string;
  sanskritTerm: string;
  placeOfArticulation: string;
  manner?: string;
  organ?: string;
}

export interface WordPhonologicalAnalysis {
  word: string;
  phonemes: AnalyzedPhonemeToken[];
  uniquePlaces: string[];
  groupsPresent: PhonologicalGroup[];
  vowelCount: number;
  consonantCount: number;
  modifierCount: number;
}

// Map from matra character to corresponding independent vowel phoneme
const MATRA_TO_VOWEL_MAP: Record<string, string> = {
  'ा': 'आ',
  'ि': 'इ',
  'ी': 'ई',
  'ु': 'उ',
  'ू': 'ऊ',
  'ृ': 'ऋ',
  'ॄ': 'ॠ',
  'ॢ': 'ऌ',
  'ॣ': 'ॡ',
  'े': 'ए',
  'ै': 'ऐ',
  'ो': 'ओ',
  'ौ': 'औ'
};

const VIRAMA = '्';

/**
 * Finds a phoneme definition in the central phonological database
 */
export function findPhoneme(charOrDev: string): SanskritPhoneme | undefined {
  return SANSKRIT_PHONEMES.find(
    p => p.devanagari === charOrDev || p.matraDevanagari === charOrDev || p.iast === charOrDev
  );
}

/**
 * Analyzes the phonological composition of any Sanskrit text/word in real-time.
 * Segments input into discrete Pāṇinian varṇas (letters, vowels, consonants, modifiers)
 * and retrieves physiological articulation places from the shared data model.
 */
export function analyzeSanskritPhonology(text: string): WordPhonologicalAnalysis {
  const trimmed = text.trim();
  const phonemes: AnalyzedPhonemeToken[] = [];
  const len = trimmed.length;

  const inherentAPhoneme = findPhoneme('अ');

  for (let i = 0; i < len; i++) {
    const char = trimmed[i];
    const nextChar = i + 1 < len ? trimmed[i + 1] : '';

    // Ignore spaces and standard punctuation in phonemic count
    if (/\s|[।॥,;!?:()\[\]\-]/.test(char)) {
      continue;
    }

    // 1. Check Independent Vowel
    const indVowel = SANSKRIT_PHONEMES.find(p => p.devanagari === char && p.type === 'vowel');
    if (indVowel) {
      phonemes.push({
        grapheme: char,
        iast: indVowel.iast,
        phoneme: indVowel,
        role: 'independent_vowel',
        groupName: indVowel.sanskritName,
        sanskritTerm: indVowel.sanskritTerm,
        placeOfArticulation: indVowel.placeOfArticulation,
        manner: indVowel.manner,
        organ: indVowel.organ
      });
      continue;
    }

    // 2. Check Modifiers (Anusvara, Visarga, Candrabindu, Avagraha)
    const modifierPhoneme = SANSKRIT_PHONEMES.find(
      p => p.devanagari === char && (p.type === 'modifier' || p.type === 'aspirate')
    );
    if (modifierPhoneme) {
      phonemes.push({
        grapheme: char,
        iast: modifierPhoneme.iast,
        phoneme: modifierPhoneme,
        role: 'modifier',
        groupName: modifierPhoneme.sanskritName,
        sanskritTerm: modifierPhoneme.sanskritTerm,
        placeOfArticulation: modifierPhoneme.placeOfArticulation,
        manner: modifierPhoneme.manner,
        organ: modifierPhoneme.organ
      });
      continue;
    }

    // 3. Check Consonant
    const consPhoneme = SANSKRIT_PHONEMES.find(
      p => p.devanagari === char && (p.type === 'consonant' || p.type === 'semivowel' || p.type === 'sibilant' || p.type === 'aspirate')
    );

    if (consPhoneme) {
      // Consonant base
      phonemes.push({
        grapheme: char + (nextChar === VIRAMA ? VIRAMA : ''),
        iast: consPhoneme.iast.replace(/a$/, ''),
        phoneme: consPhoneme,
        role: 'consonant',
        groupName: consPhoneme.sanskritName,
        sanskritTerm: consPhoneme.sanskritTerm,
        placeOfArticulation: consPhoneme.placeOfArticulation,
        manner: consPhoneme.manner,
        organ: consPhoneme.organ
      });

      if (nextChar === VIRAMA) {
        // Suppress inherent 'a'
        i++; // skip virama
      } else if (MATRA_TO_VOWEL_MAP[nextChar]) {
        // Has a dependent vowel sign (mātrā)
        const matraVowelChar = MATRA_TO_VOWEL_MAP[nextChar];
        const matraPhoneme = SANSKRIT_PHONEMES.find(p => p.devanagari === matraVowelChar);
        if (matraPhoneme) {
          phonemes.push({
            grapheme: nextChar,
            iast: matraPhoneme.iast,
            phoneme: matraPhoneme,
            role: 'matra_vowel',
            groupName: matraPhoneme.sanskritName,
            sanskritTerm: matraPhoneme.sanskritTerm,
            placeOfArticulation: matraPhoneme.placeOfArticulation,
            manner: matraPhoneme.manner,
            organ: matraPhoneme.organ
          });
        }
        i++; // skip matra
      } else {
        // Unmodified consonant has inherent vowel 'a' (अ)
        if (inherentAPhoneme) {
          phonemes.push({
            grapheme: '(अ)',
            iast: 'a',
            phoneme: inherentAPhoneme,
            role: 'inherent_vowel',
            groupName: inherentAPhoneme.sanskritName,
            sanskritTerm: inherentAPhoneme.sanskritTerm + ' (Inherent)',
            placeOfArticulation: inherentAPhoneme.placeOfArticulation,
            manner: inherentAPhoneme.manner,
            organ: inherentAPhoneme.organ
          });
        }
      }
      continue;
    }

    // 4. Standalone Matra or other grapheme
    if (MATRA_TO_VOWEL_MAP[char]) {
      const vowelChar = MATRA_TO_VOWEL_MAP[char];
      const matraPhoneme = SANSKRIT_PHONEMES.find(p => p.devanagari === vowelChar);
      if (matraPhoneme) {
        phonemes.push({
          grapheme: char,
          iast: matraPhoneme.iast,
          phoneme: matraPhoneme,
          role: 'matra_vowel',
          groupName: matraPhoneme.sanskritName,
          sanskritTerm: matraPhoneme.sanskritTerm,
          placeOfArticulation: matraPhoneme.placeOfArticulation,
          manner: matraPhoneme.manner,
          organ: matraPhoneme.organ
        });
      }
      continue;
    }
  }

  const uniquePlaces = Array.from(new Set(phonemes.map(p => p.placeOfArticulation).filter(Boolean)));
  const groupsPresent = Array.from(new Set(phonemes.map(p => p.phoneme?.group).filter(Boolean))) as PhonologicalGroup[];

  const vowelCount = phonemes.filter(p => p.role === 'independent_vowel' || p.role === 'matra_vowel' || p.role === 'inherent_vowel').length;
  const consonantCount = phonemes.filter(p => p.role === 'consonant').length;
  const modifierCount = phonemes.filter(p => p.role === 'modifier').length;

  return {
    word: trimmed,
    phonemes,
    uniquePlaces,
    groupsPresent,
    vowelCount,
    consonantCount,
    modifierCount
  };
}

/**
 * Searches the dictionary dataset for words containing a specific phoneme
 */
export function getWordsByPhoneme(phonemeDevanagari: string, limit = 6): SanskritEntry[] {
  const clean = phonemeDevanagari.replace(/[()]/g, '');
  return SANSKRIT_DICTIONARY.filter(entry => {
    return entry.devanagari.includes(clean);
  }).slice(0, limit);
}

/**
 * Searches the dictionary dataset for words articulated predominantly within a specific group
 */
export function getWordsByPhonologicalGroup(group: PhonologicalGroup, limit = 6): SanskritEntry[] {
  const groupPhonemes = SANSKRIT_PHONEMES.filter(p => p.group === group);
  const chars = groupPhonemes.map(p => p.devanagari);

  return SANSKRIT_DICTIONARY.filter(entry => {
    return chars.some(c => entry.devanagari.includes(c));
  }).slice(0, limit);
}
