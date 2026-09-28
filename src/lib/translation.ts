import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { SANSKRIT_DICTIONARY } from '../data/sanskritDictionary';
import { normalizeIast } from './dictionary';
import { devanagariToIast } from './transliteration';

export type TargetLanguage = 'hindi' | 'marathi' | 'english';

export interface TranslationResultOutput {
  sourceText: string;
  sourceIast: string;
  targetLanguage: TargetLanguage;
  translatedText: string;
  isExactMatch: boolean;
  entry?: SanskritTranslationEntry;
  allTranslations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  wordBreakdown?: {
    word: string;
    iast: string;
    hindi: string;
    marathi: string;
    english: string;
  }[];
  context?: string;
  category?: string;
}

/**
 * Normalizes Sanskrit sentence for fuzzy lookup (removes dandas, excessive whitespace, punctuation)
 */
function cleanSanskritString(str: string): string {
  return str
    .replace(/[।॥,;!?:()\[\]\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Translates Sanskrit input into the chosen target language.
 */
export function translateSanskrit(
  input: string,
  targetLang: TargetLanguage = 'hindi'
): TranslationResultOutput {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      sourceText: '',
      sourceIast: '',
      targetLanguage: targetLang,
      translatedText: '',
      isExactMatch: false,
      allTranslations: { hindi: '', marathi: '', english: '' }
    };
  }

  const iast = devanagariToIast(trimmed);
  const cleanedInput = cleanSanskritString(trimmed);

  // 1. Check exact match in translations dataset
  const exactMatch = SANSKRIT_TRANSLATIONS.find(
    (t) =>
      t.sanskrit === trimmed ||
      cleanSanskritString(t.sanskrit) === cleanedInput ||
      t.iast.toLowerCase() === iast.toLowerCase() ||
      normalizeIast(t.iast) === normalizeIast(iast)
  );

  if (exactMatch) {
    return {
      sourceText: exactMatch.sanskrit,
      sourceIast: exactMatch.iast,
      targetLanguage: targetLang,
      translatedText: exactMatch[targetLang],
      isExactMatch: true,
      entry: exactMatch,
      allTranslations: {
        hindi: exactMatch.hindi,
        marathi: exactMatch.marathi,
        english: exactMatch.english
      },
      context: exactMatch.context,
      category: exactMatch.category
    };
  }

  // 2. Check dictionary exact match
  const dictMatch = SANSKRIT_DICTIONARY.find(
    (d) =>
      d.devanagari === trimmed ||
      cleanSanskritString(d.devanagari) === cleanedInput ||
      d.iast.toLowerCase() === iast.toLowerCase() ||
      normalizeIast(d.iast) === normalizeIast(iast)
  );

  if (dictMatch) {
    const hindi = dictMatch.meaningHindi || dictMatch.meaning;
    const marathi = dictMatch.meaningMarathi || dictMatch.meaning;
    const english = dictMatch.meaning;

    return {
      sourceText: dictMatch.devanagari,
      sourceIast: dictMatch.iast,
      targetLanguage: targetLang,
      translatedText: targetLang === 'hindi' ? hindi : targetLang === 'marathi' ? marathi : english,
      isExactMatch: true,
      allTranslations: {
        hindi,
        marathi,
        english
      },
      context: dictMatch.grammar,
      category: dictMatch.partOfSpeech
    };
  }

  // 3. Sentence tokenization & word-by-word gloss fallback
  const rawTokens = trimmed.split(/[\s।॥,;!?:()\[\]\-]+/).filter(Boolean);
  const breakdown = rawTokens.map((tok) => {
    // Find matching word in translation db or dictionary
    const tEntry = SANSKRIT_TRANSLATIONS.find(
      (t) =>
        t.sanskrit === tok ||
        t.sanskrit.replace(/[ःम्]$/, '') === tok.replace(/[ःम्]$/, '')
    );

    const dEntry = SANSKRIT_DICTIONARY.find(
      (d) =>
        d.devanagari === tok ||
        d.devanagari.replace(/[ःम्]$/, '') === tok.replace(/[ःम्]$/, '')
    );

    return {
      word: tok,
      iast: devanagariToIast(tok),
      hindi: tEntry?.hindi || dEntry?.meaningHindi || tok,
      marathi: tEntry?.marathi || dEntry?.meaningMarathi || tok,
      english: tEntry?.english || dEntry?.meaning || tok
    };
  });

  const assembledHindi = breakdown.map((b) => b.hindi.split(',')[0].split('/')[0].trim()).join(' ');
  const assembledMarathi = breakdown.map((b) => b.marathi.split(',')[0].split('/')[0].trim()).join(' ');
  const assembledEnglish = breakdown.map((b) => b.english.split(',')[0].split('/')[0].trim()).join(' ');

  const chosenAssembled =
    targetLang === 'hindi'
      ? assembledHindi
      : targetLang === 'marathi'
      ? assembledMarathi
      : assembledEnglish;

  return {
    sourceText: trimmed,
    sourceIast: iast,
    targetLanguage: targetLang,
    translatedText: chosenAssembled,
    isExactMatch: false,
    allTranslations: {
      hindi: assembledHindi,
      marathi: assembledMarathi,
      english: assembledEnglish
    },
    wordBreakdown: breakdown,
    context: 'Word-by-word lexical gloss reconstruction from local dictionary baseline.'
  };
}
