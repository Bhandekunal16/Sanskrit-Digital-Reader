import { describe, it, expect } from 'vitest';
import { searchDictionary, getEntryByDevanagari, normalizeIast } from '../lib/dictionary';
import { devanagariToIast, iastToDevanagari } from '../lib/transliteration';

describe('Sanskrit Dictionary & Transliteration Engine', () => {
  it('searches dictionary by Devanagari, IAST, and English meaning', () => {
    const devRes = searchDictionary('धर्मः');
    expect(devRes.exactMatch?.devanagari).toBe('धर्मः');

    const iastRes = searchDictionary('vidya');
    expect(iastRes.matches.length).toBeGreaterThan(0);
    expect(iastRes.matches.some(m => m.devanagari === 'विद्या')).toBe(true);

    const engRes = searchDictionary('knowledge');
    expect(engRes.matches.length).toBeGreaterThan(0);
  });

  it('normalizes IAST diacritics for flexible search', () => {
    expect(normalizeIast('dharmaḥ')).toBe('dharmah');
    expect(normalizeIast('śāntiḥ')).toBe('santih');
  });

  it('converts Devanagari to IAST and back reversibly', () => {
    const text = 'संस्कृतम्';
    const iast = devanagariToIast(text);
    expect(iast).toBe('saṃskṛtam');

    const dev = iastToDevanagari(iast);
    expect(dev).toBe('संस्कृतम्');
  });

  it('handles Sanskrit conjuncts and viramas properly', () => {
    const text = 'सद्गमय';
    const iast = devanagariToIast(text);
    expect(iast).toBe('sadgamaya');
  });
});
