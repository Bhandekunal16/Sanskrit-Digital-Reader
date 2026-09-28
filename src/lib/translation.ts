import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { 
  analyzeSanskritDocument, 
  SanskritDocument, 
  SanskritToken, 
  SanskritLine, 
  TranslationStatus, 
  TranslationSource 
} from './sanskrit-analysis';

export type TargetLanguage = 'hindi' | 'marathi' | 'english';

export interface TranslatedLineResult {
  lineNumber: number;
  sourceText: string;
  sourceIast: string;
  hindi: string;
  marathi: string;
  english: string;
  tier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'empty';
  tokens: SanskritToken[];
}

export interface WordBreakdownItem {
  id: string;
  word: string;
  clean: string;
  iast: string;
  hindi: string;
  marathi: string;
  english: string;
  found: boolean;
  status: TranslationStatus;
  source: TranslationSource;
  grammar?: string;
  root?: string;
  rootIast?: string;
  partOfSpeech?: string;
}

export interface TranslationResultOutput {
  sourceText: string;
  sourceIast: string;
  targetLanguage: TargetLanguage;
  translatedText: string;
  translationTier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'partial_gloss' | 'empty';
  isExactMatch: boolean;
  entry?: SanskritTranslationEntry;
  allTranslations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  lines: TranslatedLineResult[];
  wordBreakdown: WordBreakdownItem[];
  context?: string;
  category?: string;
  unknownCount: number;
  totalWordCount: number;
}

/**
 * Translates arbitrary multi-line Sanskrit text into Hindi, Marathi, and English
 * using the unified Sanskrit document analysis engine.
 */
export function translateSanskrit(
  input: string,
  targetLang: TargetLanguage = 'hindi'
): TranslationResultOutput {
  const doc = analyzeSanskritDocument(input);

  if (!doc.rawText) {
    return {
      sourceText: '',
      sourceIast: '',
      targetLanguage: targetLang,
      translatedText: '',
      translationTier: 'empty',
      isExactMatch: false,
      allTranslations: { hindi: '', marathi: '', english: '' },
      lines: [],
      wordBreakdown: [],
      unknownCount: 0,
      totalWordCount: 0
    };
  }

  const lineResults: TranslatedLineResult[] = doc.lines.map((l) => ({
    lineNumber: l.lineNumber,
    sourceText: l.originalText,
    sourceIast: l.sourceIast,
    hindi: l.translations.hindi,
    marathi: l.translations.marathi,
    english: l.translations.english,
    tier: l.tier,
    tokens: l.tokens
  }));

  const wordBreakdown: WordBreakdownItem[] = doc.allTokens.map((t) => ({
    id: t.id,
    word: t.surface,
    clean: t.clean,
    iast: t.iast,
    hindi: t.meanings.hindi || '—',
    marathi: t.meanings.marathi || '—',
    english: t.meanings.english || '—',
    found: t.found,
    status: t.status,
    source: t.source,
    grammar: t.grammar,
    root: t.root,
    rootIast: t.rootIast,
    partOfSpeech: t.partOfSpeech
  }));

  const chosenTranslatedText =
    targetLang === 'hindi'
      ? doc.translations.hindi
      : targetLang === 'marathi'
      ? doc.translations.marathi
      : doc.translations.english;

  const multiLineIast = doc.lines.map((l) => l.sourceIast).filter(Boolean).join('\n');

  return {
    sourceText: doc.rawText,
    sourceIast: multiLineIast,
    targetLanguage: targetLang,
    translatedText: chosenTranslatedText,
    translationTier: doc.overallTier,
    isExactMatch: doc.overallTier === 'exact_sentence',
    allTranslations: {
      hindi: doc.translations.hindi,
      marathi: doc.translations.marathi,
      english: doc.translations.english
    },
    lines: lineResults,
    wordBreakdown,
    context: doc.context || (doc.overallTier === 'exact_sentence' ? 'Canonical classical verse translation.' : 'Dynamic lexical/literal gloss reconstructed from live dictionary and morphology engine.'),
    category: doc.category || 'Dynamic Workspace Input',
    unknownCount: doc.unknownCount,
    totalWordCount: doc.totalWords
  };
}
