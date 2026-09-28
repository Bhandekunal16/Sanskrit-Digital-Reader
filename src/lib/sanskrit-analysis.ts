import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';
import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { SanskritToken, extractPotentialStems } from './sanskrit-tokenizer';
import { devanagariToIast } from './transliteration';

export interface SanskritTokenAnalysis {
  surface: string;
  clean: string;
  iast: string;
  lemma?: string;
  found: boolean;
  confidence: 'exact' | 'stem_match' | 'compound_split' | 'unrecognized';
  partOfSpeech?: string;
  grammar?: string;
  root?: string;
  rootIast?: string;
  meaning: string;
  meaningHindi: string;
  meaningMarathi: string;
  context?: string;
}

/**
 * Normalizes string for invariant comparison
 */
function cleanForLookup(str: string): string {
  return str.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim();
}

/**
 * Analyzes a Sanskrit token by searching dictionary entries, translation vocabulary,
 * and applying inflectional stem reduction heuristics.
 */
export function analyzeSanskritToken(token: SanskritToken | string): SanskritTokenAnalysis {
  const surface = typeof token === 'string' ? token : token.surface;
  const clean = typeof token === 'string' ? token.replace(/[।॥.,;!?:()\[\]\-\s]/g, '') : token.clean;
  const iast = typeof token === 'string' ? devanagariToIast(clean) : token.iast;

  if (!clean) {
    return {
      surface,
      clean: '',
      iast: '',
      found: false,
      confidence: 'unrecognized',
      meaning: '',
      meaningHindi: '',
      meaningMarathi: ''
    };
  }

  const cleanLookup = cleanForLookup(clean);

  // 1. Check exact dictionary match
  const dictMatch = SANSKRIT_DICTIONARY.find(
    (d) => cleanForLookup(d.devanagari) === cleanLookup
  );

  if (dictMatch) {
    return {
      surface,
      clean,
      iast: dictMatch.iast,
      lemma: dictMatch.devanagari,
      found: true,
      confidence: 'exact',
      partOfSpeech: dictMatch.partOfSpeech,
      grammar: dictMatch.grammar,
      root: dictMatch.root,
      rootIast: dictMatch.rootIast,
      meaning: dictMatch.meaning,
      meaningHindi: dictMatch.meaningHindi || dictMatch.meaning,
      meaningMarathi: dictMatch.meaningMarathi || dictMatch.meaning
    };
  }

  // 2. Check exact translation vocabulary match
  const transMatch = SANSKRIT_TRANSLATIONS.find(
    (t) => cleanForLookup(t.sanskrit) === cleanLookup
  );

  if (transMatch) {
    return {
      surface,
      clean,
      iast: transMatch.iast,
      lemma: transMatch.sanskrit,
      found: true,
      confidence: 'exact',
      partOfSpeech: transMatch.type,
      grammar: transMatch.category,
      meaning: transMatch.english,
      meaningHindi: transMatch.hindi,
      meaningMarathi: transMatch.marathi,
      context: transMatch.context
    };
  }

  // 3. Morphological Stem & Inflection Matching
  const candidateStems = extractPotentialStems(clean);

  for (const stem of candidateStems) {
    const stemClean = cleanForLookup(stem);
    if (!stemClean) continue;

    // Check dictionary with stem
    const dictStemMatch = SANSKRIT_DICTIONARY.find(
      (d) => cleanForLookup(d.devanagari) === stemClean || cleanForLookup(d.devanagari).replace(/[ःम्]$/, '') === stemClean
    );

    if (dictStemMatch) {
      return {
        surface,
        clean,
        iast: devanagariToIast(clean),
        lemma: dictStemMatch.devanagari,
        found: true,
        confidence: 'stem_match',
        partOfSpeech: dictStemMatch.partOfSpeech,
        grammar: `Inflected form of ${dictStemMatch.devanagari} (${dictStemMatch.grammar || 'inflected'})`,
        root: dictStemMatch.root,
        rootIast: dictStemMatch.rootIast,
        meaning: dictStemMatch.meaning,
        meaningHindi: dictStemMatch.meaningHindi || dictStemMatch.meaning,
        meaningMarathi: dictStemMatch.meaningMarathi || dictStemMatch.meaning
      };
    }

    // Check translations with stem
    const transStemMatch = SANSKRIT_TRANSLATIONS.find(
      (t) => cleanForLookup(t.sanskrit) === stemClean || cleanForLookup(t.sanskrit).replace(/[ःम्]$/, '') === stemClean
    );

    if (transStemMatch) {
      return {
        surface,
        clean,
        iast: devanagariToIast(clean),
        lemma: transStemMatch.sanskrit,
        found: true,
        confidence: 'stem_match',
        partOfSpeech: transStemMatch.type,
        grammar: `Inflected form of ${transStemMatch.sanskrit}`,
        meaning: transStemMatch.english,
        meaningHindi: transStemMatch.hindi,
        meaningMarathi: transStemMatch.marathi
      };
    }
  }

  // 4. Fallback for unrecognized Sanskrit token
  return {
    surface,
    clean,
    iast: devanagariToIast(clean),
    found: false,
    confidence: 'unrecognized',
    meaning: `[${devanagariToIast(clean)}]`,
    meaningHindi: `[${clean}]`,
    meaningMarathi: `[${clean}]`
  };
}
