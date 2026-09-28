import { describe, it, expect } from 'vitest';
import { normalizeSanskrit, tokenizeSanskrit, extractPotentialStems } from '../lib/sanskrit-tokenizer';

describe('Sanskrit Tokenizer & Normalizer', () => {
  it('normalizes Unicode Devanagari characters, handles composite marks and whitespace', () => {
    const raw = '  धर्मः \r\n  शान्तिः   ';
    const normalized = normalizeSanskrit(raw);
    expect(normalized).toBe('धर्मः \n  शान्तिः');
  });

  it('correctly tokenizes multi-line Sanskrit text preserving line boundaries', () => {
    const text = 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥';
    const parsed = tokenizeSanskrit(text);

    expect(parsed.lines.length).toBe(3);
    expect(parsed.totalWords).toBeGreaterThan(6);

    // Line 1 check: Words extracted cleanly
    const line1Words = parsed.lines[0].tokens.map(t => t.clean).filter(Boolean);
    expect(line1Words).toEqual(['असतो', 'मा', 'सद्गमय']);

    // Line 3 check: Words extracted cleanly
    const line3Words = parsed.lines[2].tokens.map(t => t.clean).filter(Boolean);
    expect(line3Words).toEqual(['मृत्योर्मा', 'अमृतं', 'गमय']);
  });

  it('isolates punctuation marks (।, ॥, ., ,) and does not attach them to clean tokens', () => {
    const text = 'रामः वनं गच्छति । किं त्वम् अपि गच्छसि ॥';
    const parsed = tokenizeSanskrit(text);

    const cleans = parsed.allTokens.map(t => t.clean);
    expect(cleans).toContain('रामः');
    expect(cleans).toContain('गच्छति');
    expect(cleans).toContain('त्वम्');
    expect(cleans).not.toContain('।');
    expect(cleans).not.toContain('॥');
  });

  it('extracts potential inflectional stems for Sanskrit words', () => {
    const stems = extractPotentialStems('गच्छति');
    expect(stems).toContain('गच्छ');
    
    const ramahStems = extractPotentialStems('रामस्य');
    expect(ramahStems).toContain('राम');
  });
});
