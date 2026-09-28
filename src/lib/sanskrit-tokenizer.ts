import { devanagariToIast } from './transliteration';

export interface SanskritToken {
  surface: string;          // Original surface form (e.g. 'धर्मः')
  clean: string;            // Stripped of surrounding punctuation (e.g. 'धर्मः')
  normalized: string;       // Normalized for matching (e.g. 'धर्म')
  iast: string;             // IAST transliteration (e.g. 'dharmaḥ')
  punctuationBefore?: string;
  punctuationAfter?: string;
}

export interface SanskritLine {
  lineNumber: number;
  originalText: string;
  tokens: SanskritToken[];
  punctuation?: string;
}

export interface ParsedSanskritDocument {
  rawText: string;
  lines: SanskritLine[];
  allTokens: SanskritToken[];
  totalWords: number;
}

/**
 * Normalizes Sanskrit text preserving Devanagari Unicode characters,
 * halanta, matras, anusvara, visarga, and dandas.
 */
export function normalizeSanskrit(text: string): string {
  if (!text) return '';
  return text
    // Normalize Unicode composite characters
    .normalize('NFC')
    // Replace non-standard spaces with standard space
    .replace(/[\u00A0\u1680\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    // Standardize newlines
    .replace(/\r\n|\r/g, '\n')
    .trim();
}

/**
 * Splits punctuation and word characters in Devanagari.
 */
const PUNCTUATION_REGEX = /[।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]/g;

/**
 * Removes typical Sanskrit inflectional endings for fallback stem matching
 */
export function extractPotentialStems(surfaceWord: string): string[] {
  const stems: string[] = [surfaceWord];
  const cleaned = surfaceWord.replace(PUNCTUATION_REGEX, '').trim();
  if (!cleaned) return stems;

  if (cleaned !== surfaceWord) {
    stems.push(cleaned);
  }

  // Common nominal/adjectival case endings and sandhi modifications
  const endings = [
    // Visarga & Anusvara
    /ः$/,
    /म्$/,
    /न्$/,
    /त्$/,
    /द्$/,
    // Genitive / Dative / Ablative / Instrumental
    /स्य$/,
    /ेण$/,
    /ाय$/,
    /ात्$/,
    /े$/,
    /ौ$/,
    /ाः$/,
    /ान्$/,
    /भ्याम्$/,
    /भिः$/,
    /भ्यः$/,
    /ेषु$/,
    /ासु$/,
    /ानाम्$/,
    // Long vowel nominatives
    /ा$/,
    /ी$/,
    /ू$/,
    // Verbal endings (Present Indicative - Laṭ)
    /ति$/,
    /तः$/,
    /न्ति$/,
    /सि$/,
    /थः$/,
    /थ$/,
    /मि$/,
    /वः$/,
    /मः$/,
    // Imperative (Loṭ) / Optative (Liṅ)
    /तु$/,
    /ताम्$/,
    /न्तु$/,
    /हि$/,
    /तम्$/,
    /त$/,
    /ानि$/,
    /ाव$/,
    /ाम$/,
    /ेत्$/,
    // Causative / Gerund / Participle
    /यति$/,
    /त्वा$/,
    /य$/,
    /तुम्$/
  ];

  for (const ending of endings) {
    if (ending.test(cleaned)) {
      const stripped = cleaned.replace(ending, '');
      if (stripped.length >= 2) {
        stems.push(stripped);
        // Also add potential short 'a' stem
        stems.push(stripped + 'अ');
      }
    }
  }

  // Sandhi splitting heuristics for common prefixes/compounds
  // e.g. असतो -> असत् + तः / असत्
  if (cleaned.endsWith('तो')) {
    stems.push(cleaned.replace(/तो$/, 'त्'));
    stems.push(cleaned.replace(/तो$/, 'तः'));
  }
  // e.g. मृत्योर्मा -> मृत्योः + मा
  if (cleaned.includes('र्मा')) {
    stems.push(cleaned.replace(/र्मा/, 'ः'));
    stems.push(cleaned.replace(/र्मा/, 'म्'));
  }
  // e.g. ज्योतिर्गमय -> ज्योतिः + गमय
  if (cleaned.includes('र्गमय')) {
    stems.push(cleaned.replace(/र्गमय/, 'ः'));
    stems.push('गमय');
  }
  // e.g. सद्गमय -> सत् + गमय
  if (cleaned.startsWith('सद्')) {
    stems.push('सत्');
    stems.push(cleaned.replace(/^सद्/, ''));
  }

  return Array.from(new Set(stems.filter(s => s && s.length > 0)));
}

/**
 * Tokenizes arbitrary multi-line Sanskrit text into structured lines and tokens.
 */
export function tokenizeSanskrit(rawText: string): ParsedSanskritDocument {
  const normalized = normalizeSanskrit(rawText);
  if (!normalized) {
    return {
      rawText: '',
      lines: [],
      allTokens: [],
      totalWords: 0
    };
  }

  const rawLines = normalized.split('\n');
  const lines: SanskritLine[] = [];
  const allTokens: SanskritToken[] = [];

  rawLines.forEach((lineStr, lineIdx) => {
    const trimmedLine = lineStr.trim();
    if (!trimmedLine) {
      lines.push({
        lineNumber: lineIdx + 1,
        originalText: '',
        tokens: []
      });
      return;
    }

    // Split words while detecting attached punctuation
    const rawWords = trimmedLine.split(/\s+/).filter(Boolean);
    const lineTokens: SanskritToken[] = [];

    rawWords.forEach((word) => {
      // Extract leading punctuation
      const leadMatch = word.match(/^[।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]+/);
      const punctuationBefore = leadMatch ? leadMatch[0] : undefined;

      // Extract trailing punctuation
      const trailMatch = word.match(/[।॥.,;!?:()\[\]\-\/\\"'`~<>{}|+*&^%$#@]+$/);
      const punctuationAfter = trailMatch ? trailMatch[0] : undefined;

      // Clean core word
      let clean = word;
      if (punctuationBefore) clean = clean.slice(punctuationBefore.length);
      if (punctuationAfter) clean = clean.slice(0, clean.length - punctuationAfter.length);

      if (clean) {
        const token: SanskritToken = {
          surface: word,
          clean,
          normalized: clean.replace(/[ःम्]$/, ''),
          iast: devanagariToIast(clean),
          punctuationBefore,
          punctuationAfter
        };
        lineTokens.push(token);
        allTokens.push(token);
      } else if (punctuationBefore || punctuationAfter) {
        // Pure punctuation token
        const punc = punctuationBefore || punctuationAfter || word;
        const puncToken: SanskritToken = {
          surface: punc,
          clean: '',
          normalized: '',
          iast: punc === '।' ? '.' : punc === '॥' ? '..' : punc,
          punctuationAfter: punc
        };
        lineTokens.push(puncToken);
      }
    });

    lines.push({
      lineNumber: lineIdx + 1,
      originalText: trimmedLine,
      tokens: lineTokens
    });
  });

  return {
    rawText: normalized,
    lines,
    allTokens,
    totalWords: allTokens.length
  };
}
