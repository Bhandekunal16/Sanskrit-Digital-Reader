import { describe, it, expect } from 'vitest';
import { analyzeSanskritDocument, analyzeSanskritToken } from '../lib/sanskrit-analysis';

describe('Sanskrit Master Document & Token Analysis Pipeline', () => {
  it('analyzes exact dictionary entries and attaches verified definitions', () => {
    const analysis = analyzeSanskritToken('धर्मः');
    expect(analysis.found).toBe(true);
    expect(analysis.source).toBe('dictionary');
    expect(analysis.iast).toBe('dharmaḥ');
    expect(analysis.meanings.english).toContain('Righteousness');
    expect(analysis.meanings.hindi).toBeDefined();
  });

  it('handles unknown words without copying fake [word] or IAST into translations', () => {
    const analysis = analyzeSanskritToken('अज्ञातपदम्');
    expect(analysis.found).toBe(false);
    expect(analysis.status).toBe('not-found');
    expect(analysis.source).toBe('unavailable');
    expect(analysis.meanings.english).toBeUndefined();
    expect(analysis.meanings.hindi).toBeUndefined();
    expect(analysis.meanings.marathi).toBeUndefined();
    expect(analysis.iast).toBeDefined(); // Transliteration is provided, but NOT as meaning
  });

  it('parses multi-line document into structured lines and synchronized multi-lingual outputs', () => {
    const input = 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥';
    const doc = analyzeSanskritDocument(input);

    expect(doc.lines.length).toBe(3);
    expect(doc.totalWords).toBeGreaterThan(6);
    expect(doc.translations.hindi).toContain('सत्य');
    expect(doc.translations.english).toContain('truth');

    // Check individual token status
    const asato = doc.allTokens.find(t => t.clean === 'असतो');
    expect(asato).toBeDefined();
    expect(asato?.found).toBe(true);
    expect(asato?.iast).toBe('asato');
  });

  it('correctly processes arbitrary simple sentence: रामः वनं गच्छति।', () => {
    const doc = analyzeSanskritDocument('रामः वनं गच्छति।');
    expect(doc.lines.length).toBe(1);
    expect(doc.allTokens.map(t => t.clean)).toContain('रामः');
    expect(doc.allTokens.map(t => t.clean)).toContain('वनं');
    expect(doc.allTokens.map(t => t.clean)).toContain('गच्छति');
  });
});
