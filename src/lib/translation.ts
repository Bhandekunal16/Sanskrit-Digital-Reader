import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { SANSKRIT_DICTIONARY } from '../data/sanskritDictionary';
import { 
  tokenizeSanskrit, 
  normalizeSanskrit, 
  ParsedSanskritDocument, 
  SanskritLine, 
  SanskritToken 
} from './sanskrit-tokenizer';
import { analyzeSanskritToken, SanskritTokenAnalysis } from './sanskrit-analysis';
import { devanagariToIast } from './transliteration';

export type TargetLanguage = 'hindi' | 'marathi' | 'english';

export interface TranslatedLineResult {
  lineNumber: number;
  sourceText: string;
  sourceIast: string;
  hindi: string;
  marathi: string;
  english: string;
  tier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'empty';
  tokenAnalyses: SanskritTokenAnalysis[];
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
  wordBreakdown: {
    word: string;
    clean: string;
    iast: string;
    hindi: string;
    marathi: string;
    english: string;
    found: boolean;
    grammar?: string;
    root?: string;
  }[];
  context?: string;
  category?: string;
  unknownCount: number;
  totalWordCount: number;
}

/**
 * Normalizes string for sentence matching (removes dandas and excess spacing)
 */
function cleanForSentenceMatch(str: string): string {
  return str
    .replace(/[।॥,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Translates a single Sanskrit line using 3-tier resolution:
 * Tier 1: Full-sentence canonical match
 * Tier 2: Phrase match
 * Tier 3: Dynamic tokenized lexical gloss
 */
function translateLine(line: SanskritLine): TranslatedLineResult {
  const lineText = line.originalText.trim();
  if (!lineText) {
    return {
      lineNumber: line.lineNumber,
      sourceText: '',
      sourceIast: '',
      hindi: '',
      marathi: '',
      english: '',
      tier: 'empty',
      tokenAnalyses: []
    };
  }

  const lineIast = devanagariToIast(lineText);
  const cleanedLine = cleanForSentenceMatch(lineText);

  // 1. Check Exact Sentence Match in SANSKRIT_TRANSLATIONS
  const exactSentence = SANSKRIT_TRANSLATIONS.find(
    (t) =>
      t.sanskrit === lineText ||
      cleanForSentenceMatch(t.sanskrit) === cleanedLine ||
      cleanForSentenceMatch(t.iast).toLowerCase() === cleanForSentenceMatch(lineIast).toLowerCase()
  );

  if (exactSentence) {
    const tokenAnalyses = line.tokens.map(t => analyzeSanskritToken(t));
    return {
      lineNumber: line.lineNumber,
      sourceText: lineText,
      sourceIast: lineIast,
      hindi: exactSentence.hindi,
      marathi: exactSentence.marathi,
      english: exactSentence.english,
      tier: 'exact_sentence',
      tokenAnalyses
    };
  }

  // 2. Tokenize and analyze each token on this line
  const tokenAnalyses: SanskritTokenAnalysis[] = line.tokens.map(t => analyzeSanskritToken(t));

  // Build gloss translations for this line
  const hindiWords: string[] = [];
  const marathiWords: string[] = [];
  const englishWords: string[] = [];

  line.tokens.forEach((token, idx) => {
    const analysis = tokenAnalyses[idx];
    
    // If it's pure punctuation
    if (!token.clean && token.punctuationAfter) {
      hindiWords.push(token.punctuationAfter);
      marathiWords.push(token.punctuationAfter);
      englishWords.push(token.punctuationAfter === '।' ? '.' : token.punctuationAfter === '॥' ? '..' : token.punctuationAfter);
      return;
    }

    if (analysis) {
      // Pick first primary gloss meaning
      const hi = analysis.meaningHindi.split(',')[0].split('/')[0].trim();
      const mr = analysis.meaningMarathi.split(',')[0].split('/')[0].trim();
      const en = analysis.meaning.split(',')[0].split('/')[0].trim();

      const leadPunc = token.punctuationBefore || '';
      const trailPunc = token.punctuationAfter ? (token.punctuationAfter === '।' ? '।' : token.punctuationAfter) : '';
      const enTrailPunc = token.punctuationAfter ? (token.punctuationAfter === '।' ? '.' : token.punctuationAfter === '॥' ? '..' : token.punctuationAfter) : '';

      hindiWords.push(leadPunc + hi + trailPunc);
      marathiWords.push(leadPunc + mr + trailPunc);
      englishWords.push(leadPunc + en + enTrailPunc);
    }
  });

  const assembledHindi = hindiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
  const assembledMarathi = marathiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
  const assembledEnglish = englishWords.join(' ').replace(/\s+([.,;!?])/g, '$1');

  return {
    lineNumber: line.lineNumber,
    sourceText: lineText,
    sourceIast: lineIast,
    hindi: assembledHindi,
    marathi: assembledMarathi,
    english: assembledEnglish,
    tier: 'lexical_gloss',
    tokenAnalyses
  };
}

/**
 * Translates arbitrary multi-line Sanskrit text into Hindi, Marathi, and English.
 */
export function translateSanskrit(
  input: string,
  targetLang: TargetLanguage = 'hindi'
): TranslationResultOutput {
  const trimmed = normalizeSanskrit(input);
  if (!trimmed) {
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

  // 1. Check if the entire multi-line block has an exact canonical match in SANSKRIT_TRANSLATIONS
  const cleanedEntire = cleanForSentenceMatch(trimmed);
  const exactBlock = SANSKRIT_TRANSLATIONS.find(
    (t) =>
      t.sanskrit === trimmed ||
      cleanForSentenceMatch(t.sanskrit) === cleanedEntire
  );

  // 2. Tokenize into lines and tokens
  const parsedDoc: ParsedSanskritDocument = tokenizeSanskrit(trimmed);
  const lineResults: TranslatedLineResult[] = parsedDoc.lines.map(line => translateLine(line));

  // 3. Assemble multi-line output
  const multiLineHindi = lineResults.map(l => l.hindi).filter(Boolean).join('\n');
  const multiLineMarathi = lineResults.map(l => l.marathi).filter(Boolean).join('\n');
  const multiLineEnglish = lineResults.map(l => l.english).filter(Boolean).join('\n');
  const multiLineIast = lineResults.map(l => l.sourceIast).filter(Boolean).join('\n');

  // If entire text has exact match, prioritize canonical block translation
  const finalHindi = exactBlock ? exactBlock.hindi : multiLineHindi;
  const finalMarathi = exactBlock ? exactBlock.marathi : multiLineMarathi;
  const finalEnglish = exactBlock ? exactBlock.english : multiLineEnglish;

  // Determine overall tier
  let overallTier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'partial_gloss' = 'lexical_gloss';
  if (exactBlock) {
    overallTier = 'exact_sentence';
  } else if (lineResults.every(l => l.tier === 'exact_sentence' || l.tier === 'empty')) {
    overallTier = 'exact_sentence';
  } else if (lineResults.some(l => l.tier === 'exact_sentence')) {
    overallTier = 'partial_gloss';
  }

  // 4. Build dynamic word-level breakdown for ALL tokens
  const breakdown: {
    word: string;
    clean: string;
    iast: string;
    hindi: string;
    marathi: string;
    english: string;
    found: boolean;
    grammar?: string;
    root?: string;
  }[] = [];

  let unknownCount = 0;

  parsedDoc.allTokens.forEach((token) => {
    if (!token.clean) return; // Skip pure punctuation tokens

    const analysis = analyzeSanskritToken(token);
    if (!analysis.found) {
      unknownCount++;
    }

    breakdown.push({
      word: token.surface,
      clean: token.clean,
      iast: analysis.iast || token.iast,
      hindi: analysis.meaningHindi,
      marathi: analysis.meaningMarathi,
      english: analysis.meaning,
      found: analysis.found,
      grammar: analysis.grammar,
      root: analysis.root
    });
  });

  const chosenTranslatedText =
    targetLang === 'hindi'
      ? finalHindi
      : targetLang === 'marathi'
      ? finalMarathi
      : finalEnglish;

  return {
    sourceText: trimmed,
    sourceIast: multiLineIast,
    targetLanguage: targetLang,
    translatedText: chosenTranslatedText,
    translationTier: overallTier,
    isExactMatch: !!exactBlock || overallTier === 'exact_sentence',
    entry: exactBlock,
    allTranslations: {
      hindi: finalHindi,
      marathi: finalMarathi,
      english: finalEnglish
    },
    lines: lineResults,
    wordBreakdown: breakdown,
    context: exactBlock?.context || (overallTier === 'exact_sentence' ? 'Canonical classical verse translation.' : 'Dynamic lexical/literal gloss reconstructed from live dictionary and morphology engine.'),
    category: exactBlock?.category || 'Dynamic Input',
    unknownCount,
    totalWordCount: breakdown.length
  };
}
