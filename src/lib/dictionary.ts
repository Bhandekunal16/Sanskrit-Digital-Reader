import { SANSKRIT_DICTIONARY, SanskritEntry } from '../data/sanskritDictionary';

/**
 * Normalizes IAST diacritics to simple ASCII for fuzzy search
 */
export function normalizeIast(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[āáà]/g, 'a')
    .replace(/[īíì]/g, 'i')
    .replace(/[ūúù]/g, 'u')
    .replace(/[ṛṝ]/g, 'r')
    .replace(/[ḷḹ]/g, 'l')
    .replace(/[ṅñṇ]/g, 'n')
    .replace(/[ṭḍ]/g, 't')
    .replace(/[śṣ]/g, 's')
    .replace(/[ṃṁ]/g, 'm')
    .replace(/[ḥ]/g, 'h')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

export interface SearchResult {
  exactMatch?: SanskritEntry;
  matches: SanskritEntry[];
  suggestions: SanskritEntry[];
  query: string;
}

/**
 * Search the dictionary by Devanagari, IAST, or English meaning
 */
export function searchDictionary(rawQuery: string): SearchResult {
  const query = rawQuery.trim();
  if (!query) {
    return {
      matches: SANSKRIT_DICTIONARY,
      suggestions: [],
      query: ''
    };
  }

  const queryLower = query.toLowerCase();
  const queryNorm = normalizeIast(query);

  // 1. Direct Devanagari match
  const exactDev = SANSKRIT_DICTIONARY.find(
    entry => entry.devanagari === query || entry.devanagari.replace(/[ःम्]/g, '') === query.replace(/[ःम्]/g, '')
  );

  // 2. Direct IAST match
  const exactIast = SANSKRIT_DICTIONARY.find(
    entry => entry.iast.toLowerCase() === queryLower || normalizeIast(entry.iast) === queryNorm
  );

  const exactMatch = exactDev || exactIast;

  // Search filtered matches
  const matches = SANSKRIT_DICTIONARY.filter(entry => {
    // Check Devanagari
    if (entry.devanagari.includes(query)) return true;

    // Check IAST
    if (entry.iast.toLowerCase().includes(queryLower)) return true;
    if (normalizeIast(entry.iast).includes(queryNorm)) return true;

    // Check Meaning
    if (entry.meaning.toLowerCase().includes(queryLower)) return true;

    // Check Root
    if (entry.root && entry.root.includes(query)) return true;
    if (entry.rootIast && entry.rootIast.toLowerCase().includes(queryLower)) return true;

    // Check Tags
    if (entry.tags && entry.tags.some(t => t.toLowerCase().includes(queryLower))) return true;

    return false;
  });

  // If no matches, generate fuzzy suggestions
  let suggestions: SanskritEntry[] = [];
  if (matches.length === 0) {
    const scored = SANSKRIT_DICTIONARY.map(entry => {
      const distDev = levenshtein(query, entry.devanagari);
      const distIast = levenshtein(queryNorm, normalizeIast(entry.iast));
      const minDist = Math.min(distDev, distIast);
      return { entry, score: minDist };
    });

    scored.sort((a, b) => a.score - b.score);
    suggestions = scored.slice(0, 4).map(s => s.entry);
  }

  return {
    exactMatch,
    matches,
    suggestions,
    query
  };
}

/**
 * Get word entry by ID or Devanagari
 */
export function getEntryByDevanagari(devanagari: string): SanskritEntry | undefined {
  return SANSKRIT_DICTIONARY.find(
    e => e.devanagari === devanagari || e.devanagari.replace(/[ःम्]$/, '') === devanagari.replace(/[ःम्]$/, '')
  );
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  SANSKRIT_DICTIONARY.forEach(e => e.tags?.forEach(t => set.add(t)));
  return Array.from(set);
}
