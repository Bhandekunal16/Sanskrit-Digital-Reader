import { describe, it, expect } from 'vitest';
import { translateSanskrit } from '../lib/translation';

describe('Sanskrit Translation Engine', () => {
  it('translates multi-line Sanskrit input into Hindi, Marathi, and English', () => {
    const text = 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥';
    const resHi = translateSanskrit(text, 'hindi');
    expect(resHi.lines.length).toBe(3);
    expect(resHi.translatedText).toContain('सत्य');

    const resEn = translateSanskrit(text, 'english');
    expect(resEn.translatedText).toContain('truth');
  });

  it('correctly reports translation confidence and source tier', () => {
    const exact = translateSanskrit('सत्यमेव जयते।', 'hindi');
    expect(exact.isExactMatch).toBe(true);
    expect(exact.translationTier).toBe('exact_sentence');

    const dynamic = translateSanskrit('बालकः पुस्तकं पठति।', 'hindi');
    expect(dynamic.translationTier).toBe('lexical_gloss');
    expect(dynamic.wordBreakdown.length).toBeGreaterThan(0);
  });

  it('does not copy Sanskrit or IAST as translations for unknown words', () => {
    const unknown = translateSanskrit('अज्ञातम्', 'hindi');
    const unknownToken = unknown.wordBreakdown.find(w => w.clean === 'अज्ञातम्' || w.word === 'अज्ञातम्');
    expect(unknownToken?.found).toBe(false);
    expect(unknownToken?.hindi).toBe('—');
    expect(unknownToken?.english).toBe('—');
  });
});
