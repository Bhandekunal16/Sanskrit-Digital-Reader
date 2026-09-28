import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';
import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { 
  normalizeSanskrit, 
  extractPotentialStems, 
  analyzeMorphology,
  SanskritProcessor
} from './sanskrit-processor';
import { 
  SanskritToken as TokenizerToken, 
  SanskritLine as TokenizerLine, 
  ParsedSanskritDocument, 
  tokenizeSanskrit 
} from './sanskrit-tokenizer';
import { devanagariToIast } from './transliteration';
import { analyzeSanskritPhonology, WordPhonologicalAnalysis } from './phonology';
import { analyzeSandhi, SandhiAnalysisResult } from './sandhi';

export { SanskritProcessor, normalizeSanskrit, extractPotentialStems, analyzeMorphology };

export type TranslationStatus = 
  | 'translated' 
  | 'partial' 
  | 'transliterated-only' 
  | 'not-found';

export type TranslationSource = 
  | 'dictionary' 
  | 'phrase-dataset' 
  | 'translation-engine' 
  | 'morphological-gloss' 
  | 'sandhi_split'
  | 'unavailable';

export interface SanskritTokenAnalysis {
  id: string;
  surface: string;
  clean: string;
  normalized: string;
  iast: string;
  lemma?: string;
  root?: string;
  rootIast?: string;
  partOfSpeech?: string;
  grammar?: string;
  context?: string;
  found: boolean;
  status: TranslationStatus;
  source: TranslationSource;
  confidence: 'exact' | 'stem_match' | 'compound_split' | 'unrecognized';
  meanings: {
    hindi?: string;
    marathi?: string;
    english?: string;
  };
  sandhi?: SandhiAnalysisResult;
  phonology?: WordPhonologicalAnalysis;
}

export interface SanskritToken extends SanskritTokenAnalysis {
  punctuationBefore?: string;
  punctuationAfter?: string;
  isPunctuation?: boolean;
}

export interface SanskritLine {
  lineNumber: number;
  originalText: string;
  sourceIast: string;
  tokens: SanskritToken[];
  translations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  tier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'empty';
}

export interface SanskritDocument {
  rawText: string;
  normalizedText: string;
  lines: SanskritLine[];
  allTokens: SanskritToken[];
  totalWords: number;
  overallTier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'partial_gloss' | 'empty';
  translations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  context?: string;
  category?: string;
  recognizedCount: number;
  unknownCount: number;
}

/**
 * In-memory analysis caches to prevent recalculating repeated tokens and documents
 */
const TOKEN_CACHE = new Map<string, SanskritTokenAnalysis>();
const DOCUMENT_CACHE = new Map<string, SanskritDocument>();
const MAX_CACHE_SIZE = 500;

function cleanForLookup(str: string): string {
  return str.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim();
}

function cleanForSentenceMatch(str: string): string {
  return str
    .replace(/[।॥,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Analyzes an individual Sanskrit word token.
 * Strictly separates transliteration from lexical meaning and never populates
 * fake translation fallbacks like [word].
 */
export function analyzeSanskritToken(tokenOrWord: TokenizerToken | string): SanskritTokenAnalysis {
  const surface = typeof tokenOrWord === 'string' ? tokenOrWord : tokenOrWord.surface;
  const clean = typeof tokenOrWord === 'string' 
    ? tokenOrWord.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim() 
    : tokenOrWord.clean;
  const normalized = typeof tokenOrWord === 'string' 
    ? clean.replace(/[ःम्]$/, '') 
    : tokenOrWord.normalized;
  const iast = typeof tokenOrWord === 'string' ? devanagariToIast(clean) : tokenOrWord.iast;

  const id = `token-${clean || 'empty'}-${Math.random().toString(36).substring(2, 7)}`;

  if (!clean) {
    return {
      id,
      surface,
      clean: '',
      normalized: '',
      iast: '',
      found: false,
      status: 'not-found',
      source: 'unavailable',
      confidence: 'unrecognized',
      meanings: {}
    };
  }

  // Check in-memory token cache
  const cached = TOKEN_CACHE.get(clean);
  if (cached) {
    return { ...cached, id, surface };
  }

  const cleanLookup = cleanForLookup(clean);

  // 1. Exact Dictionary Match
  const dictMatch = SANSKRIT_DICTIONARY.find(
    (d) => cleanForLookup(d.devanagari) === cleanLookup
  );

  if (dictMatch) {
    const analysis: SanskritTokenAnalysis = {
      id,
      surface,
      clean,
      normalized: dictMatch.devanagari.replace(/[ःम्]$/, ''),
      iast: dictMatch.iast,
      lemma: dictMatch.devanagari,
      found: true,
      status: 'translated',
      source: 'dictionary',
      confidence: 'exact',
      partOfSpeech: dictMatch.partOfSpeech,
      grammar: dictMatch.grammar,
      root: dictMatch.root,
      rootIast: dictMatch.rootIast,
      context: dictMatch.context,
      meanings: {
        english: dictMatch.meaning,
        hindi: dictMatch.meaningHindi || undefined,
        marathi: dictMatch.meaningMarathi || undefined
      },
      sandhi: analyzeSandhi(clean),
      phonology: analyzeSanskritPhonology(clean)
    };
    saveTokenToCache(clean, analysis);
    return analysis;
  }

  // 2. Exact Translation Dataset Match
  const transMatch = SANSKRIT_TRANSLATIONS.find(
    (t) => cleanForLookup(t.sanskrit) === cleanLookup
  );

  if (transMatch) {
    const analysis: SanskritTokenAnalysis = {
      id,
      surface,
      clean,
      normalized: transMatch.sanskrit.replace(/[ःम्]$/, ''),
      iast: transMatch.iast,
      lemma: transMatch.sanskrit,
      found: true,
      status: 'translated',
      source: 'phrase-dataset',
      confidence: 'exact',
      partOfSpeech: transMatch.type,
      grammar: transMatch.category,
      context: transMatch.context,
      meanings: {
        english: transMatch.english,
        hindi: transMatch.hindi,
        marathi: transMatch.marathi
      },
      sandhi: analyzeSandhi(clean),
      phonology: analyzeSanskritPhonology(clean)
    };
    saveTokenToCache(clean, analysis);
    return analysis;
  }

  // 3. Sandhi Split Match
  const sandhiResult = analyzeSandhi(clean);
  if (sandhiResult.isCompound && sandhiResult.possibleSplit.length > 1) {
    // Check if parts can be resolved in dictionary
    const splitMeaningsHi: string[] = [];
    const splitMeaningsMr: string[] = [];
    const splitMeaningsEn: string[] = [];
    let splitResolved = false;

    for (const part of sandhiResult.possibleSplit) {
      const pClean = cleanForLookup(part);
      const pMatch = SANSKRIT_DICTIONARY.find(d => cleanForLookup(d.devanagari) === pClean || cleanForLookup(d.devanagari).replace(/[ःम्]$/, '') === pClean);
      if (pMatch) {
        splitResolved = true;
        if (pMatch.meaningHindi) splitMeaningsHi.push(pMatch.meaningHindi.split(',')[0].trim());
        if (pMatch.meaningMarathi) splitMeaningsMr.push(pMatch.meaningMarathi.split(',')[0].trim());
        splitMeaningsEn.push(pMatch.meaning.split(',')[0].trim());
      }
    }

    if (splitResolved) {
      const analysis: SanskritTokenAnalysis = {
        id,
        surface,
        clean,
        normalized,
        iast: devanagariToIast(clean),
        lemma: sandhiResult.possibleSplit.join(' + '),
        found: true,
        status: 'partial',
        source: 'sandhi_split',
        confidence: 'compound_split',
        grammar: `${sandhiResult.sanskritTerm} (${sandhiResult.possibleSplit.join(' + ')})`,
        meanings: {
          english: splitMeaningsEn.length > 0 ? splitMeaningsEn.join(' / ') : undefined,
          hindi: splitMeaningsHi.length > 0 ? splitMeaningsHi.join(' / ') : undefined,
          marathi: splitMeaningsMr.length > 0 ? splitMeaningsMr.join(' / ') : undefined
        },
        sandhi: sandhiResult,
        phonology: analyzeSanskritPhonology(clean)
      };
      saveTokenToCache(clean, analysis);
      return analysis;
    }
  }

  // 4. Morphological Stem & Inflection Matching
  const candidateStems = extractPotentialStems(clean);

  for (const stem of candidateStems) {
    const stemClean = cleanForLookup(stem);
    if (!stemClean || stemClean === cleanLookup) continue;

    // Check dictionary with stem
    const dictStemMatch = SANSKRIT_DICTIONARY.find(
      (d) => cleanForLookup(d.devanagari) === stemClean || cleanForLookup(d.devanagari).replace(/[ःम्]$/, '') === stemClean
    );

    if (dictStemMatch) {
      const analysis: SanskritTokenAnalysis = {
        id,
        surface,
        clean,
        normalized: dictStemMatch.devanagari.replace(/[ःम्]$/, ''),
        iast: devanagariToIast(clean),
        lemma: dictStemMatch.devanagari,
        found: true,
        status: 'partial',
        source: 'morphological-gloss',
        confidence: 'stem_match',
        partOfSpeech: dictStemMatch.partOfSpeech,
        grammar: `Inflected form of ${dictStemMatch.devanagari} (${dictStemMatch.grammar || 'inflected'})`,
        root: dictStemMatch.root,
        rootIast: dictStemMatch.rootIast,
        meanings: {
          english: dictStemMatch.meaning,
          hindi: dictStemMatch.meaningHindi || undefined,
          marathi: dictStemMatch.meaningMarathi || undefined
        },
        sandhi: sandhiResult,
        phonology: analyzeSanskritPhonology(clean)
      };
      saveTokenToCache(clean, analysis);
      return analysis;
    }

    // Check translations with stem
    const transStemMatch = SANSKRIT_TRANSLATIONS.find(
      (t) => cleanForLookup(t.sanskrit) === stemClean || cleanForLookup(t.sanskrit).replace(/[ःम्]$/, '') === stemClean
    );

    if (transStemMatch) {
      const analysis: SanskritTokenAnalysis = {
        id,
        surface,
        clean,
        normalized: transStemMatch.sanskrit.replace(/[ःम्]$/, ''),
        iast: devanagariToIast(clean),
        lemma: transStemMatch.sanskrit,
        found: true,
        status: 'partial',
        source: 'morphological-gloss',
        confidence: 'stem_match',
        partOfSpeech: transStemMatch.type,
        grammar: `Inflected form of ${transStemMatch.sanskrit}`,
        meanings: {
          english: transStemMatch.english,
          hindi: transStemMatch.hindi,
          marathi: transStemMatch.marathi
        },
        sandhi: sandhiResult,
        phonology: analyzeSanskritPhonology(clean)
      };
      saveTokenToCache(clean, analysis);
      return analysis;
    }
  }

  // 5. Unrecognized Word (No fake translations! Explicit 'not-found' status)
  const unrecognized: SanskritTokenAnalysis = {
    id,
    surface,
    clean,
    normalized,
    iast: devanagariToIast(clean),
    found: false,
    status: 'not-found',
    source: 'unavailable',
    confidence: 'unrecognized',
    meanings: {}, // NEVER populate [word] or iast as fake translations
    sandhi: sandhiResult,
    phonology: analyzeSanskritPhonology(clean)
  };

  saveTokenToCache(clean, unrecognized);
  return unrecognized;
}

function saveTokenToCache(key: string, analysis: SanskritTokenAnalysis) {
  if (TOKEN_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = TOKEN_CACHE.keys().next().value;
    if (firstKey) TOKEN_CACHE.delete(firstKey);
  }
  TOKEN_CACHE.set(key, analysis);
}

/**
 * Master analysis function: Normalizes, tokenizes, transliterates, parses morphology,
 * analyzes phonology and sandhi, and builds multi-lingual outputs for an entire Sanskrit document.
 */
export function analyzeSanskritDocument(rawText: string): SanskritDocument {
  const normalized = normalizeSanskrit(rawText);
  if (!normalized) {
    return {
      rawText: '',
      normalizedText: '',
      lines: [],
      allTokens: [],
      totalWords: 0,
      overallTier: 'empty',
      translations: { hindi: '', marathi: '', english: '' },
      recognizedCount: 0,
      unknownCount: 0
    };
  }

  // Check document cache
  const cachedDoc = DOCUMENT_CACHE.get(normalized);
  if (cachedDoc) {
    return cachedDoc;
  }

  // 1. Check if the entire multi-line block has an exact canonical match in SANSKRIT_TRANSLATIONS
  const cleanedEntire = cleanForSentenceMatch(normalized);
  const exactBlock = SANSKRIT_TRANSLATIONS.find(
    (t) =>
      t.sanskrit === normalized ||
      cleanForSentenceMatch(t.sanskrit) === cleanedEntire
  );

  // 2. Tokenize raw text into lines and token structures
  const parsedDoc: ParsedSanskritDocument = tokenizeSanskrit(normalized);
  const allTokens: SanskritToken[] = [];
  let recognizedCount = 0;
  let unknownCount = 0;

  const lines: SanskritLine[] = parsedDoc.lines.map((pLine) => {
    const lineText = pLine.originalText.trim();
    if (!lineText) {
      return {
        lineNumber: pLine.lineNumber,
        originalText: '',
        sourceIast: '',
        tokens: [],
        translations: { hindi: '', marathi: '', english: '' },
        tier: 'empty'
      };
    }

    const lineIast = devanagariToIast(lineText);
    const cleanedLine = cleanForSentenceMatch(lineText);

    // Check line-level exact match
    const exactLine = SANSKRIT_TRANSLATIONS.find(
      (t) =>
        t.sanskrit === lineText ||
        cleanForSentenceMatch(t.sanskrit) === cleanedLine ||
        cleanForSentenceMatch(t.iast).toLowerCase() === cleanForSentenceMatch(lineIast).toLowerCase()
    );

    // Analyze tokens on this line
    const lineTokens: SanskritToken[] = pLine.tokens.map((tok, tIdx) => {
      const analysis = analyzeSanskritToken(tok);
      const fullToken: SanskritToken = {
        ...analysis,
        id: `line-${pLine.lineNumber}-tok-${tIdx}-${tok.clean || 'punc'}`,
        punctuationBefore: tok.punctuationBefore,
        punctuationAfter: tok.punctuationAfter,
        isPunctuation: !tok.clean && (!!tok.punctuationBefore || !!tok.punctuationAfter)
      };

      if (!fullToken.isPunctuation) {
        if (fullToken.found) recognizedCount++;
        else unknownCount++;
        allTokens.push(fullToken);
      }
      return fullToken;
    });

    if (exactLine) {
      return {
        lineNumber: pLine.lineNumber,
        originalText: lineText,
        sourceIast: lineIast,
        tokens: lineTokens,
        translations: {
          hindi: exactLine.hindi,
          marathi: exactLine.marathi,
          english: exactLine.english
        },
        tier: 'exact_sentence'
      };
    }

    // Assemble dynamic lexical gloss for this line
    const hindiWords: string[] = [];
    const marathiWords: string[] = [];
    const englishWords: string[] = [];

    lineTokens.forEach((t) => {
      if (t.isPunctuation) {
        const punc = t.punctuationAfter || t.punctuationBefore || '';
        hindiWords.push(punc);
        marathiWords.push(punc);
        englishWords.push(punc === '।' ? '.' : punc === '॥' ? '..' : punc);
        return;
      }

      const leadPunc = t.punctuationBefore || '';
      const trailPunc = t.punctuationAfter || '';
      const enTrailPunc = trailPunc === '।' ? '.' : trailPunc === '॥' ? '..' : trailPunc;

      const hi = t.meanings.hindi ? t.meanings.hindi.split(',')[0].split('/')[0].trim() : '';
      const mr = t.meanings.marathi ? t.meanings.marathi.split(',')[0].split('/')[0].trim() : '';
      const en = t.meanings.english ? t.meanings.english.split(',')[0].split('/')[0].trim() : '';

      if (hi) hindiWords.push(leadPunc + hi + trailPunc);
      else hindiWords.push(leadPunc + `—` + trailPunc);

      if (mr) marathiWords.push(leadPunc + mr + trailPunc);
      else marathiWords.push(leadPunc + `—` + trailPunc);

      if (en) englishWords.push(leadPunc + en + enTrailPunc);
      else englishWords.push(leadPunc + `—` + enTrailPunc);
    });

    const assembledHindi = hindiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
    const assembledMarathi = marathiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
    const assembledEnglish = englishWords.join(' ').replace(/\s+([.,;!?])/g, '$1');

    return {
      lineNumber: pLine.lineNumber,
      originalText: lineText,
      sourceIast: lineIast,
      tokens: lineTokens,
      translations: {
        hindi: assembledHindi,
        marathi: assembledMarathi,
        english: assembledEnglish
      },
      tier: 'lexical_gloss'
    };
  });

  // 3. Assemble document-level translations
  const multiLineHindi = lines.map((l) => l.translations.hindi).filter(Boolean).join('\n');
  const multiLineMarathi = lines.map((l) => l.translations.marathi).filter(Boolean).join('\n');
  const multiLineEnglish = lines.map((l) => l.translations.english).filter(Boolean).join('\n');

  const finalHindi = exactBlock ? exactBlock.hindi : multiLineHindi;
  const finalMarathi = exactBlock ? exactBlock.marathi : multiLineMarathi;
  const finalEnglish = exactBlock ? exactBlock.english : multiLineEnglish;

  let overallTier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'partial_gloss' = 'lexical_gloss';
  if (exactBlock) {
    overallTier = 'exact_sentence';
  } else if (lines.length > 0 && lines.every((l) => l.tier === 'exact_sentence' || l.tier === 'empty')) {
    overallTier = 'exact_sentence';
  } else if (lines.some((l) => l.tier === 'exact_sentence')) {
    overallTier = 'partial_gloss';
  }

  const resultDoc: SanskritDocument = {
    rawText: normalized,
    normalizedText: normalized,
    lines,
    allTokens,
    totalWords: allTokens.length,
    overallTier,
    translations: {
      hindi: finalHindi,
      marathi: finalMarathi,
      english: finalEnglish
    },
    context: exactBlock?.context,
    category: exactBlock?.category || 'Sanskrit Workspace Input',
    recognizedCount,
    unknownCount
  };

  // Save in document cache
  if (DOCUMENT_CACHE.size >= MAX_CACHE_SIZE) {
    const firstKey = DOCUMENT_CACHE.keys().next().value;
    if (firstKey) DOCUMENT_CACHE.delete(firstKey);
  }
  DOCUMENT_CACHE.set(normalized, resultDoc);

  return resultDoc;
}
