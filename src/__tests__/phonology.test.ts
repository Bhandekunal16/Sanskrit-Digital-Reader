import { describe, it, expect } from 'vitest';
import { analyzeSanskritPhonology, findPhoneme } from '../lib/phonology';

describe('Sanskrit Phonological & Articulation Analysis Engine', () => {
  it('correctly maps independent vowels, matras, and consonants to Pāṇinian places', () => {
    const analysis = analyzeSanskritPhonology('धर्मः');
    expect(analysis.word).toBe('धर्मः');
    expect(analysis.phonemes.length).toBeGreaterThan(0);

    // Check presence of visarga modifier
    const visarga = analysis.phonemes.find(p => p.role === 'modifier');
    expect(visarga).toBeDefined();
    expect(visarga?.placeOfArticulation).toBe('Guttural / Visarga');
  });

  it('correctly counts vowels, consonants, and articulatory organs for complex words', () => {
    const vidyaAnalysis = analyzeSanskritPhonology('विद्या');
    expect(vidyaAnalysis.consonantCount).toBeGreaterThanOrEqual(2); // व्, द्, य्
    expect(vidyaAnalysis.vowelCount).toBeGreaterThanOrEqual(2); // इ, आ
    expect(vidyaAnalysis.uniquePlaces.length).toBeGreaterThanOrEqual(2);
  });

  it('finds phonemes by Devanagari or IAST', () => {
    const ka = findPhoneme('क');
    expect(ka?.iast).toBe('ka');
    expect(ka?.placeOfArticulation).toBe('Guttural / Velar');

    const aa = findPhoneme('आ');
    expect(aa?.iast).toBe('ā');
    expect(aa?.type).toBe('vowel');
  });
});
