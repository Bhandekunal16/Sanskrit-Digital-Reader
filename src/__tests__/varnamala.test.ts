import { describe, it, expect } from 'vitest';
import { 
  SANSKRIT_VOWELS, 
  SANSKRIT_CONSONANTS, 
  SANSKRIT_CONJUNCTS, 
  ALL_VARNAMALA_LETTERS,
  BARAHAKHADI_MATRAS,
  PANINIAN_SIKSHA_SUTRAS,
  getVarnaByDevanagari 
} from '../data/varnamala';
import { normalizePath, NAV_ITEMS } from '../lib/router';

describe('Sanskrit Varṇamālā Dataset & Phonetics Verification', () => {
  it('contains all 14-16 classical Sanskrit vowels (स्वर)', () => {
    expect(SANSKRIT_VOWELS.length).toBeGreaterThanOrEqual(14);
    const vowelChars = SANSKRIT_VOWELS.map(v => v.devanagari);
    expect(vowelChars).toContain('अ');
    expect(vowelChars).toContain('आ');
    expect(vowelChars).toContain('इ');
    expect(vowelChars).toContain('ई');
    expect(vowelChars).toContain('उ');
    expect(vowelChars).toContain('ऊ');
    expect(vowelChars).toContain('ऋ');
    expect(vowelChars).toContain('ॠ');
    expect(vowelChars).toContain('ऌ');
    expect(vowelChars).toContain('ए');
    expect(vowelChars).toContain('ऐ');
    expect(vowelChars).toContain('ओ');
    expect(vowelChars).toContain('औ');
    expect(vowelChars).toContain('अं');
    expect(vowelChars).toContain('अः');
  });

  it('contains all 33 classical Sanskrit consonants (व्यञ्जन)', () => {
    expect(SANSKRIT_CONSONANTS.length).toBe(33);
    const consonantChars = SANSKRIT_CONSONANTS.map(c => c.devanagari);
    
    // 5 Vargas
    const expectedConsonants = [
      'क', 'ख', 'ग', 'घ', 'ङ',
      'च', 'छ', 'ज', 'झ', 'ञ',
      'ट', 'ठ', 'ड', 'ढ', 'ण',
      'त', 'थ', 'द', 'ध', 'न',
      'प', 'फ', 'ब', 'भ', 'म',
      'य', 'र', 'ल', 'व',
      'श', 'ष', 'स', 'ह'
    ];

    expectedConsonants.forEach(c => {
      expect(consonantChars).toContain(c);
    });
  });

  it('contains classical conjuncts and Vedic ळ (ḻa)', () => {
    const conjunctChars = SANSKRIT_CONJUNCTS.map(c => c.devanagari);
    expect(conjunctChars).toContain('क्ष');
    expect(conjunctChars).toContain('त्र');
    expect(conjunctChars).toContain('ज्ञ');
    expect(conjunctChars).toContain('श्र');
    expect(conjunctChars).toContain('ळ');
  });

  it('every varṇa has valid acoustic and linguistic parameters', () => {
    ALL_VARNAMALA_LETTERS.forEach(varna => {
      expect(varna.devanagari).toBeTruthy();
      expect(varna.iast).toBeTruthy();
      expect(varna.placeSa).toBeTruthy();
      expect(varna.organSa).toBeTruthy();
      expect(varna.exemplar).toBeDefined();
      expect(varna.exemplar.meaningEn).toBeTruthy();
      expect(varna.audioParams.baseFreq).toBeGreaterThan(0);
      expect(varna.audioParams.duration).toBeGreaterThan(0);
    });
  });

  it('Bāraha-khaḍī contains 13 standard mātrā combinations', () => {
    expect(BARAHAKHADI_MATRAS.length).toBeGreaterThanOrEqual(13);
  });

  it('Pāṇinian Śikṣā Sūtras map correctly to articulation places', () => {
    expect(PANINIAN_SIKSHA_SUTRAS.length).toBeGreaterThanOrEqual(8);
    const kanthaSutra = PANINIAN_SIKSHA_SUTRAS.find(s => s.id === 'sutra-kantha');
    expect(kanthaSutra).toBeDefined();
    expect(kanthaSutra?.sutraDevanagari).toContain('अकुहविसर्जनीयानां कण्ठः');
    expect(kanthaSutra?.includedVarnas).toContain('अ');
    expect(kanthaSutra?.includedVarnas).toContain('क');
  });

  it('correctly normalizes /vowels-consonants and aliases', () => {
    expect(normalizePath('/vowels-consonants')).toBe('/vowels-consonants');
    expect(normalizePath('/varnamala')).toBe('/vowels-consonants');
    expect(normalizePath('/alphabet')).toBe('/vowels-consonants');
    expect(normalizePath('/phonetics')).toBe('/vowels-consonants');
    expect(normalizePath('/vowels-consonants?lang=sa#chart')).toBe('/vowels-consonants');
  });

  it('NAV_ITEMS includes Vowels & Consonants route', () => {
    const navHrefs = NAV_ITEMS.map(i => i.href);
    expect(navHrefs).toContain('/vowels-consonants');
  });

  it('retrieves varṇa by Devanagari character', () => {
    const ka = getVarnaByDevanagari('क');
    expect(ka).toBeDefined();
    expect(ka?.iast).toBe('ka');
    expect(ka?.varga).toBe('ka-varga');
  });
});
