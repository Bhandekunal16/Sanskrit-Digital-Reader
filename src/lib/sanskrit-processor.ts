import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';
import { SANSKRIT_TRANSLATIONS, SanskritTranslationEntry } from '../data/translations';
import { devanagariToIast, iastToDevanagari } from './transliteration';
import { analyzeSandhi, SandhiAnalysisResult } from './sandhi';
import { analyzeSanskritPhonology, WordPhonologicalAnalysis } from './phonology';

/**
 * Pāṇinian Grammatical Types & Models
 */
export type VibhaktiCase = 
  | 'prathamā (nominative)' 
  | 'dvitīyā (accusative)' 
  | 'tṛtīyā (instrumental)' 
  | 'caturthī (dative)' 
  | 'pañcamī (ablative)' 
  | 'ṣaṣṭhī (genitive)' 
  | 'saptamī (locative)' 
  | 'sambodhana (vocative)'
  | 'avyaya (indeclinable)'
  | 'unspecified';

export type SanskritVacana = 'ekavacana (singular)' | 'dvivacana (dual)' | 'bahuvacana (plural)' | 'unspecified';
export type SanskritLinga = 'puṃliṅga (masculine)' | 'strīliṅga (feminine)' | 'napuṃsakaliṅga (neuter)' | 'avyaya' | 'unspecified';
export type SanskritLakara = 'laṭ (present)' | 'laṅ (imperfect past)' | 'loṭ (imperative)' | 'vidhiliṅ (optative)' | 'lṛṭ (future)' | 'liṭ (perfect)' | 'unspecified';
export type SanskritPurusha = 'prathama (3rd person)' | 'madhyama (2nd person)' | 'uttama (1st person)' | 'unspecified';

export interface MorphologicalAnalysisResult {
  surface: string;
  clean: string;
  normalized: string;
  iast: string;
  lemma: string;
  root?: string;
  rootIast?: string;
  rootMeaning?: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'indeclinable' | 'prefix' | 'compound' | 'unknown';
  case?: VibhaktiCase;
  number?: SanskritVacana;
  gender?: SanskritLinga;
  tense?: SanskritLakara;
  person?: SanskritPurusha;
  prakritiPratyaya?: string;
  derivationSummary: string;
  confidence: 'exact_lexicon' | 'stem_heuristic' | 'sandhi_compound' | 'unrecognized';
  meanings: {
    hindi?: string;
    marathi?: string;
    english?: string;
  };
}

export interface ProcessedSanskritToken {
  id: string;
  surface: string;
  clean: string;
  normalized: string;
  iast: string;
  isPunctuation: boolean;
  punctuationBefore?: string;
  punctuationAfter?: string;
  morphology: MorphologicalAnalysisResult;
  sandhi: SandhiAnalysisResult;
  phonology: WordPhonologicalAnalysis;
  foundInLexicon: boolean;
  source: 'dictionary' | 'phrase-dataset' | 'sandhi_split' | 'morphological-gloss' | 'unavailable';
  status: 'translated' | 'partial' | 'transliterated-only' | 'not-found';
}

export interface ProcessedSanskritLine {
  lineNumber: number;
  originalText: string;
  iast: string;
  tokens: ProcessedSanskritToken[];
  translations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  tier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'empty';
}

export interface ProcessedSanskritDocument {
  rawText: string;
  normalizedText: string;
  lines: ProcessedSanskritLine[];
  allTokens: ProcessedSanskritToken[];
  totalWords: number;
  recognizedCount: number;
  unknownCount: number;
  overallTier: 'exact_sentence' | 'known_phrase' | 'lexical_gloss' | 'partial_gloss' | 'empty';
  translations: {
    hindi: string;
    marathi: string;
    english: string;
  };
  context?: string;
  category?: string;
}

/**
 * Punctuation regex for Sanskrit texts (includes Devanagari Danda and double Danda)
 */
export const SANSKRIT_PUNCTUATION_REGEX = /[।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]/g;

/**
 * In-memory LRU caches
 */
const PROCESSOR_TOKEN_CACHE = new Map<string, ProcessedSanskritToken>();
const PROCESSOR_DOC_CACHE = new Map<string, ProcessedSanskritDocument>();
const MAX_CACHE_SIZE = 500;

/**
 * Normalizes Sanskrit text preserving Devanagari Unicode characters,
 * halanta, matras, anusvara, visarga, and dandas.
 */
export function normalizeSanskrit(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFC')
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    .replace(/\r\n|\r/g, '\n')
    .trim();
}

/**
 * Strips punctuation and leading/trailing whitespace
 */
export function cleanSanskritWord(word: string): string {
  return word.replace(SANSKRIT_PUNCTUATION_REGEX, '').trim();
}

/**
 * Removes typical Sanskrit nominal & verbal inflectional endings for stem analysis
 */
export function extractPotentialStems(surfaceWord: string): string[] {
  const stems: string[] = [surfaceWord];
  const cleaned = cleanSanskritWord(surfaceWord);
  if (!cleaned) return stems;

  if (cleaned !== surfaceWord) {
    stems.push(cleaned);
  }

  // Common nominal/adjectival case endings and sandhi modifications
  const endings = [
    // 1. Dual/Plural endings
    { suffix: 'ाणाम्', replace: 'अ' },
    { suffix: 'ेषु', replace: 'अ' },
    { suffix: 'ेभ्यः', replace: 'अ' },
    { suffix: 'ैः', replace: 'अ' },
    { suffix: 'ानि', replace: 'अ' },
    { suffix: 'ाः', replace: 'अ' },
    // 2. Singular case endings (अ-कारान्त / आ-कारान्त / इ-कारान्त)
    { suffix: 'स्य', replace: 'अ' },
    { suffix: 'स्य', replace: '' },
    { suffix: 'ात्', replace: 'अ' },
    { suffix: 'ाद्', replace: 'अ' },
    { suffix: 'ाय', replace: 'अ' },
    { suffix: 'ेन', replace: 'अ' },
    { suffix: 'म्', replace: 'अ' },
    { suffix: 'म्', replace: '' },
    { suffix: 'ं', replace: 'अ' },
    { suffix: 'ं', replace: '' },
    { suffix: 'ः', replace: '' },
    { suffix: 'ः', replace: 'अ' },
    { suffix: 'ो', replace: 'अ' },
    { suffix: 'े', replace: 'अ' },
    { suffix: 'ौ', replace: 'अ' },
    // 3. Feminine endings
    { suffix: 'ायाः', replace: 'आ' },
    { suffix: 'ायै', replace: 'आ' },
    { suffix: 'ाम्', replace: 'आ' },
    // 4. Verbal Present (लट्) endings
    { suffix: 'न्ति', replace: '' },
    { suffix: 'तः', replace: '' },
    { suffix: 'ति', replace: '' },
    { suffix: 'थः', replace: '' },
    { suffix: 'थ', replace: '' },
    { suffix: 'सि', replace: '' },
    { suffix: 'ामः', replace: '' },
    { suffix: 'ावः', replace: '' },
    { suffix: 'ामि', replace: '' },
    // 5. Verbal Imperative (लोट्) endings
    { suffix: 'तु', replace: '' },
    { suffix: 'ताम्', replace: '' },
    { suffix: 'न्तु', replace: '' },
    { suffix: 'तम', replace: '' },
    { suffix: 'त', replace: '' },
    { suffix: 'ानि', replace: '' },
    { suffix: 'ाव', replace: '' },
    { suffix: 'ाम', replace: '' },
    // 6. Suffixes & Participles (क्त, क्तवतु, क्त्वा, ल्यप्, तुमुन्)
    { suffix: 'त्वा', replace: '' },
    { suffix: '्य', replace: '' },
    { suffix: 'तुम्', replace: '' },
    { suffix: 'तव्य', replace: '' },
    { suffix: 'नीय', replace: '' },
    { suffix: 'वान्', replace: '' },
    { suffix: 'वती', replace: '' },
    { suffix: 'तः', replace: '' }
  ];

  for (const { suffix, replace } of endings) {
    if (cleaned.endsWith(suffix) && cleaned.length > suffix.length) {
      const stem = cleaned.slice(0, -suffix.length) + replace;
      if (stem && !stems.includes(stem)) {
        stems.push(stem);
      }
      const rawStem = cleaned.slice(0, -suffix.length);
      if (rawStem && !stems.includes(rawStem)) {
        stems.push(rawStem);
      }
    }
  }

  return stems;
}

/**
 * Inflectional pattern matcher to deduce Pāṇinian grammatical traits (Vibhakti, Vacana, Lakāra)
 */
function inferInflectionalTraits(clean: string): {
  case?: VibhaktiCase;
  number?: SanskritVacana;
  gender?: SanskritLinga;
  tense?: SanskritLakara;
  person?: SanskritPurusha;
  partOfSpeech?: 'noun' | 'verb' | 'adjective' | 'pronoun' | 'indeclinable';
  note?: string;
} {
  // Verbal patterns (लट् लकार)
  if (clean.endsWith('ति')) {
    return { partOfSpeech: 'verb', tense: 'laṭ (present)', person: 'prathama (3rd person)', number: 'ekavacana (singular)', note: 'लट् लकार, प्रथम पुरुष, एकवचन' };
  }
  if (clean.endsWith('तः')) {
    return { partOfSpeech: 'verb', tense: 'laṭ (present)', person: 'prathama (3rd person)', number: 'dvivacana (dual)', note: 'लट् लकार, प्रथम पुरुष, द्विवचन' };
  }
  if (clean.endsWith('न्ति')) {
    return { partOfSpeech: 'verb', tense: 'laṭ (present)', person: 'prathama (3rd person)', number: 'bahuvacana (plural)', note: 'लट् लकार, प्रथम पुरुष, बहुवचन' };
  }
  if (clean.endsWith('सि')) {
    return { partOfSpeech: 'verb', tense: 'laṭ (present)', person: 'madhyama (2nd person)', number: 'ekavacana (singular)', note: 'लट् लकार, मध्यम पुरुष, एकवचन' };
  }
  if (clean.endsWith('मि') || clean.endsWith('ामि')) {
    return { partOfSpeech: 'verb', tense: 'laṭ (present)', person: 'uttama (1st person)', number: 'ekavacana (singular)', note: 'लट् लकार, उत्तम पुरुष, एकवचन' };
  }

  // Verbal patterns (लोट् लकार - Imperative)
  if (clean.endsWith('तु')) {
    return { partOfSpeech: 'verb', tense: 'loṭ (imperative)', person: 'prathama (3rd person)', number: 'ekavacana (singular)', note: 'लोट् लकार, प्रथम पुरुष, एकवचन' };
  }

  // Nominal patterns (अ-कारान्त / आ-कारान्त विभक्तयः)
  if (clean.endsWith('स्य')) {
    return { partOfSpeech: 'noun', case: 'ṣaṣṭhī (genitive)', number: 'ekavacana (singular)', note: 'षष्ठी विभक्ति, एकवचन' };
  }
  if (clean.endsWith('ात्') || clean.endsWith('ाद्')) {
    return { partOfSpeech: 'noun', case: 'pañcamī (ablative)', number: 'ekavacana (singular)', note: 'पञ्चमी विभक्ति, एकवचन' };
  }
  if (clean.endsWith('ाय')) {
    return { partOfSpeech: 'noun', case: 'caturthī (dative)', number: 'ekavacana (singular)', note: 'चतुर्थी विभक्ति, एकवचन' };
  }
  if (clean.endsWith('ेन')) {
    return { partOfSpeech: 'noun', case: 'tṛtīyā (instrumental)', number: 'ekavacana (singular)', note: 'तृतीया विभक्ति, एकवचन' };
  }
  if (clean.endsWith('ेषु')) {
    return { partOfSpeech: 'noun', case: 'saptamī (locative)', number: 'bahuvacana (plural)', note: 'सप्तमी विभक्ति, बहुवचन' };
  }
  if (clean.endsWith('ाणाम्')) {
    return { partOfSpeech: 'noun', case: 'ṣaṣṭhī (genitive)', number: 'bahuvacana (plural)', note: 'षष्ठी विभक्ति, बहुवचन' };
  }
  if (clean.endsWith('ैः')) {
    return { partOfSpeech: 'noun', case: 'tṛtīyā (instrumental)', number: 'bahuvacana (plural)', note: 'तृतीया विभक्ति, बहुवचन' };
  }
  if (clean.endsWith('ेभ्यः')) {
    return { partOfSpeech: 'noun', case: 'caturthī (dative)', number: 'bahuvacana (plural)', note: 'चतुर्थी/पञ्चमी विभक्ति, बहुवचन' };
  }
  if (clean.endsWith('म्') || clean.endsWith('ं')) {
    return { partOfSpeech: 'noun', case: 'dvitīyā (accusative)', number: 'ekavacana (singular)', note: 'द्वितीया विभक्ति, एकवचन' };
  }
  if (clean.endsWith('ः')) {
    return { partOfSpeech: 'noun', case: 'prathamā (nominative)', number: 'ekavacana (singular)', gender: 'puṃliṅga (masculine)', note: 'प्रथमा विभक्ति, एकवचन' };
  }

  return {};
}

/**
 * Performs unified morphological analysis on a Sanskrit word token
 */
export function analyzeMorphology(surfaceWord: string): MorphologicalAnalysisResult {
  const clean = cleanSanskritWord(surfaceWord);
  const normalized = clean.replace(/[ःम्]$/, '');
  const iast = devanagariToIast(clean);

  if (!clean) {
    return {
      surface: surfaceWord,
      clean: '',
      normalized: '',
      iast: '',
      lemma: '',
      partOfSpeech: 'unknown',
      derivationSummary: 'Empty token',
      confidence: 'unrecognized',
      meanings: {}
    };
  }

  const cleanLookup = clean.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim();
  const inferredTraits = inferInflectionalTraits(clean);

  // 1. Direct Dictionary Match
  const dictMatch = SANSKRIT_DICTIONARY.find(
    d => cleanSanskritWord(d.devanagari) === cleanLookup
  );

  if (dictMatch) {
    return {
      surface: surfaceWord,
      clean,
      normalized: dictMatch.devanagari.replace(/[ःम्]$/, ''),
      iast: dictMatch.iast,
      lemma: dictMatch.devanagari,
      root: dictMatch.root,
      rootIast: dictMatch.rootIast,
      rootMeaning: dictMatch.rootMeaning,
      partOfSpeech: (dictMatch.partOfSpeech as any) || inferredTraits.partOfSpeech || 'noun',
      case: dictMatch.caseOrVibhakti || inferredTraits.case,
      number: (dictMatch.number === 'singular' ? 'ekavacana (singular)' : dictMatch.number === 'dual' ? 'dvivacana (dual)' : dictMatch.number === 'plural' ? 'bahuvacana (plural)' : inferredTraits.number),
      gender: (dictMatch.gender === 'masculine' ? 'puṃliṅga (masculine)' : dictMatch.gender === 'feminine' ? 'strīliṅga (feminine)' : dictMatch.gender === 'neuter' ? 'napuṃsakaliṅga (neuter)' : inferredTraits.gender),
      tense: dictMatch.tenseOrLakara || inferredTraits.tense,
      person: dictMatch.personOrPurusha || inferredTraits.person,
      prakritiPratyaya: dictMatch.morphology,
      derivationSummary: dictMatch.grammar || `Exact lexical entry for ${dictMatch.devanagari}`,
      confidence: 'exact_lexicon',
      meanings: {
        english: dictMatch.meaning,
        hindi: dictMatch.meaningHindi || undefined,
        marathi: dictMatch.meaningMarathi || undefined
      }
    };
  }

  // 2. Translation Dataset Match
  const transMatch = SANSKRIT_TRANSLATIONS.find(
    t => cleanSanskritWord(t.sanskrit) === cleanLookup
  );

  if (transMatch) {
    return {
      surface: surfaceWord,
      clean,
      normalized: transMatch.sanskrit.replace(/[ःम्]$/, ''),
      iast: transMatch.iast,
      lemma: transMatch.sanskrit,
      partOfSpeech: (transMatch.type as any) || inferredTraits.partOfSpeech || 'noun',
      case: inferredTraits.case,
      number: inferredTraits.number,
      gender: inferredTraits.gender,
      tense: inferredTraits.tense,
      person: inferredTraits.person,
      derivationSummary: transMatch.category || `Recognized Sanskrit form (${transMatch.sanskrit})`,
      confidence: 'exact_lexicon',
      meanings: {
        english: transMatch.english,
        hindi: transMatch.hindi,
        marathi: transMatch.marathi
      }
    };
  }

  // 3. Sandhi & Compound Split Check
  const sandhiResult = analyzeSandhi(clean);
  if (sandhiResult.isCompound && sandhiResult.possibleSplit.length > 1) {
    const splitMeaningsHi: string[] = [];
    const splitMeaningsMr: string[] = [];
    const splitMeaningsEn: string[] = [];
    let splitResolved = false;

    for (const part of sandhiResult.possibleSplit) {
      const pClean = cleanSanskritWord(part);
      const pMatch = SANSKRIT_DICTIONARY.find(
        d => cleanSanskritWord(d.devanagari) === pClean || cleanSanskritWord(d.devanagari).replace(/[ःम्]$/, '') === pClean
      );
      if (pMatch) {
        splitResolved = true;
        if (pMatch.meaningHindi) splitMeaningsHi.push(pMatch.meaningHindi.split(',')[0].trim());
        if (pMatch.meaningMarathi) splitMeaningsMr.push(pMatch.meaningMarathi.split(',')[0].trim());
        splitMeaningsEn.push(pMatch.meaning.split(',')[0].trim());
      }
    }

    if (splitResolved) {
      return {
        surface: surfaceWord,
        clean,
        normalized,
        iast,
        lemma: sandhiResult.possibleSplit.join(' + '),
        partOfSpeech: 'compound',
        derivationSummary: `${sandhiResult.sanskritTerm} (${sandhiResult.possibleSplit.join(' + ')}) · ${sandhiResult.ruleName}`,
        prakritiPratyaya: sandhiResult.explanation,
        confidence: 'sandhi_compound',
        meanings: {
          english: splitMeaningsEn.length > 0 ? splitMeaningsEn.join(' / ') : undefined,
          hindi: splitMeaningsHi.length > 0 ? splitMeaningsHi.join(' / ') : undefined,
          marathi: splitMeaningsMr.length > 0 ? splitMeaningsMr.join(' / ') : undefined
        }
      };
    }
  }

  // 4. Inflectional Stem Stripping
  const candidateStems = extractPotentialStems(clean);

  for (const stem of candidateStems) {
    const stemClean = cleanSanskritWord(stem);
    if (!stemClean || stemClean === cleanLookup) continue;

    const dictStemMatch = SANSKRIT_DICTIONARY.find(
      d => cleanSanskritWord(d.devanagari) === stemClean || cleanSanskritWord(d.devanagari).replace(/[ःम्]$/, '') === stemClean
    );

    if (dictStemMatch) {
      return {
        surface: surfaceWord,
        clean,
        normalized: dictStemMatch.devanagari.replace(/[ःम्]$/, ''),
        iast,
        lemma: dictStemMatch.devanagari,
        root: dictStemMatch.root,
        rootIast: dictStemMatch.rootIast,
        rootMeaning: dictStemMatch.rootMeaning,
        partOfSpeech: inferredTraits.partOfSpeech || (dictStemMatch.partOfSpeech as any) || 'noun',
        case: inferredTraits.case,
        number: inferredTraits.number,
        gender: inferredTraits.gender,
        tense: inferredTraits.tense,
        person: inferredTraits.person,
        prakritiPratyaya: `${dictStemMatch.devanagari} + प्रत्यय (${inferredTraits.note || 'inflected'})`,
        derivationSummary: `Inflected form of ${dictStemMatch.devanagari} (${inferredTraits.note || dictStemMatch.grammar || 'inflected'})`,
        confidence: 'stem_heuristic',
        meanings: {
          english: dictStemMatch.meaning,
          hindi: dictStemMatch.meaningHindi || undefined,
          marathi: dictStemMatch.meaningMarathi || undefined
        }
      };
    }
  }

  // 5. Unrecognized Token
  return {
    surface: surfaceWord,
    clean,
    normalized,
    iast,
    lemma: clean,
    partOfSpeech: inferredTraits.partOfSpeech || 'unknown',
    case: inferredTraits.case,
    number: inferredTraits.number,
    gender: inferredTraits.gender,
    tense: inferredTraits.tense,
    person: inferredTraits.person,
    derivationSummary: inferredTraits.note ? `Unlisted lexical item (${inferredTraits.note})` : 'Unrecognized in baseline corpus',
    confidence: 'unrecognized',
    meanings: {} // Strictly no fake values
  };
}

/**
 * Complete Token Processing (Morphology + Sandhi + Phonology + Transliteration)
 */
export function processSanskritToken(
  rawToken: string,
  punctuationBefore?: string,
  punctuationAfter?: string
): ProcessedSanskritToken {
  const clean = cleanSanskritWord(rawToken);
  const id = `tok-${clean || 'punc'}-${Math.random().toString(36).substring(2, 7)}`;

  if (!clean) {
    const isPunc = !!punctuationBefore || !!punctuationAfter;
    return {
      id,
      surface: rawToken,
      clean: '',
      normalized: '',
      iast: '',
      isPunctuation: isPunc,
      punctuationBefore,
      punctuationAfter,
      morphology: {
        surface: rawToken,
        clean: '',
        normalized: '',
        iast: '',
        lemma: '',
        partOfSpeech: 'unknown',
        derivationSummary: 'Punctuation',
        confidence: 'unrecognized',
        meanings: {}
      },
      sandhi: analyzeSandhi(''),
      phonology: analyzeSanskritPhonology(''),
      foundInLexicon: false,
      source: 'unavailable',
      status: 'not-found'
    };
  }

  // Check token cache
  const cached = PROCESSOR_TOKEN_CACHE.get(clean);
  if (cached) {
    return {
      ...cached,
      id,
      surface: rawToken,
      punctuationBefore,
      punctuationAfter
    };
  }

  const morphology = analyzeMorphology(rawToken);
  const sandhi = analyzeSandhi(clean);
  const phonology = analyzeSanskritPhonology(clean);

  let source: ProcessedSanskritToken['source'] = 'unavailable';
  let status: ProcessedSanskritToken['status'] = 'not-found';

  if (morphology.confidence === 'exact_lexicon') {
    source = 'dictionary';
    status = 'translated';
  } else if (morphology.confidence === 'sandhi_compound') {
    source = 'sandhi_split';
    status = 'partial';
  } else if (morphology.confidence === 'stem_heuristic') {
    source = 'morphological-gloss';
    status = 'partial';
  }

  const processed: ProcessedSanskritToken = {
    id,
    surface: rawToken,
    clean,
    normalized: morphology.normalized,
    iast: morphology.iast,
    isPunctuation: false,
    punctuationBefore,
    punctuationAfter,
    morphology,
    sandhi,
    phonology,
    foundInLexicon: status === 'translated' || status === 'partial',
    source,
    status
  };

  if (PROCESSOR_TOKEN_CACHE.size >= MAX_CACHE_SIZE) {
    const first = PROCESSOR_TOKEN_CACHE.keys().next().value;
    if (first) PROCESSOR_TOKEN_CACHE.delete(first);
  }
  PROCESSOR_TOKEN_CACHE.set(clean, processed);

  return processed;
}

/**
 * Unified Master Sanskrit Pipeline:
 * Normalization → Tokenization → Transliteration → Morphology → Sandhi → Phonology → Multilingual Gloss
 */
export function processSanskritDocument(rawText: string): ProcessedSanskritDocument {
  const normalized = normalizeSanskrit(rawText);
  if (!normalized) {
    return {
      rawText: '',
      normalizedText: '',
      lines: [],
      allTokens: [],
      totalWords: 0,
      recognizedCount: 0,
      unknownCount: 0,
      overallTier: 'empty',
      translations: { hindi: '', marathi: '', english: '' }
    };
  }

  const cached = PROCESSOR_DOC_CACHE.get(normalized);
  if (cached) {
    return cached;
  }

  const rawLines = normalized.split('\n');
  const allTokens: ProcessedSanskritToken[] = [];
  let recognizedCount = 0;
  let unknownCount = 0;

  const lines: ProcessedSanskritLine[] = rawLines.map((lineText, lineIdx) => {
    const trimmed = lineText.trim();
    if (!trimmed) {
      return {
        lineNumber: lineIdx + 1,
        originalText: '',
        iast: '',
        tokens: [],
        translations: { hindi: '', marathi: '', english: '' },
        tier: 'empty'
      };
    }

    const lineIast = devanagariToIast(trimmed);

    // Tokenize line respecting Sanskrit spaces and punctuation
    const words = trimmed.split(/\s+/).filter(Boolean);
    const lineTokens: ProcessedSanskritToken[] = [];

    words.forEach((w) => {
      const matchLeading = w.match(/^([।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]+)(.*)$/);
      let pBefore = matchLeading ? matchLeading[1] : undefined;
      let rest = matchLeading ? matchLeading[2] : w;

      const matchTrailing = rest.match(/^(.*?)([।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]+)$/);
      let pAfter = matchTrailing ? matchTrailing[2] : undefined;
      let core = matchTrailing ? matchTrailing[1] : rest;

      if (core) {
        const tokenObj = processSanskritToken(core, pBefore, pAfter);
        lineTokens.push(tokenObj);
        allTokens.push(tokenObj);
        if (tokenObj.foundInLexicon) recognizedCount++;
        else unknownCount++;
      } else if (pBefore || pAfter) {
        const puncOnly = processSanskritToken('', pBefore, pAfter);
        lineTokens.push(puncOnly);
      }
    });

    // Assemble dynamic line translations
    const hindiWords: string[] = [];
    const marathiWords: string[] = [];
    const englishWords: string[] = [];

    lineTokens.forEach((tok) => {
      if (tok.isPunctuation) {
        const punc = tok.punctuationAfter || tok.punctuationBefore || '';
        hindiWords.push(punc);
        marathiWords.push(punc);
        englishWords.push(punc === '।' ? '.' : punc === '॥' ? '..' : punc);
        return;
      }

      const pBefore = tok.punctuationBefore || '';
      const pAfter = tok.punctuationAfter || '';
      const enAfter = pAfter === '।' ? '.' : pAfter === '॥' ? '..' : pAfter;

      const hi = tok.morphology.meanings.hindi ? tok.morphology.meanings.hindi.split(',')[0].split('/')[0].trim() : '';
      const mr = tok.morphology.meanings.marathi ? tok.morphology.meanings.marathi.split(',')[0].split('/')[0].trim() : '';
      const en = tok.morphology.meanings.english ? tok.morphology.meanings.english.split(',')[0].split('/')[0].trim() : '';

      hindiWords.push(hi ? pBefore + hi + pAfter : pBefore + '—' + pAfter);
      marathiWords.push(mr ? pBefore + mr + pAfter : pBefore + '—' + pAfter);
      englishWords.push(en ? pBefore + en + enAfter : pBefore + '—' + enAfter);
    });

    const assembledHi = hindiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
    const assembledMr = marathiWords.join(' ').replace(/\s+([।॥.,;!?])/g, '$1');
    const assembledEn = englishWords.join(' ').replace(/\s+([.,;!?])/g, '$1');

    return {
      lineNumber: lineIdx + 1,
      originalText: trimmed,
      iast: lineIast,
      tokens: lineTokens,
      translations: {
        hindi: assembledHi,
        marathi: assembledMr,
        english: assembledEn
      },
      tier: 'lexical_gloss'
    };
  });

  const fullHindi = lines.map(l => l.translations.hindi).filter(Boolean).join('\n');
  const fullMarathi = lines.map(l => l.translations.marathi).filter(Boolean).join('\n');
  const fullEnglish = lines.map(l => l.translations.english).filter(Boolean).join('\n');

  const doc: ProcessedSanskritDocument = {
    rawText: normalized,
    normalizedText: normalized,
    lines,
    allTokens,
    totalWords: allTokens.length,
    recognizedCount,
    unknownCount,
    overallTier: lines.length > 0 ? 'lexical_gloss' : 'empty',
    translations: {
      hindi: fullHindi,
      marathi: fullMarathi,
      english: fullEnglish
    }
  };

  if (PROCESSOR_DOC_CACHE.size >= MAX_CACHE_SIZE) {
    const first = PROCESSOR_DOC_CACHE.keys().next().value;
    if (first) PROCESSOR_DOC_CACHE.delete(first);
  }
  PROCESSOR_DOC_CACHE.set(normalized, doc);

  return doc;
}

/**
 * Unified Sanskrit Processor API Singleton
 */
export const SanskritProcessor = {
  normalize: normalizeSanskrit,
  cleanWord: cleanSanskritWord,
  extractStems: extractPotentialStems,
  analyzeMorphology,
  processToken: processSanskritToken,
  processDocument: processSanskritDocument,
  analyzeSandhi,
  analyzePhonology: analyzeSanskritPhonology,
  toIast: devanagariToIast,
  toDevanagari: iastToDevanagari
};
