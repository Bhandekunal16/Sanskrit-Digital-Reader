import { describe, it, expect } from 'vitest';
import { 
  SanskritProcessor, 
  normalizeSanskrit, 
  extractPotentialStems, 
  analyzeMorphology, 
  processSanskritToken, 
  processSanskritDocument 
} from '../lib/sanskrit-processor';

describe('Centralized Sanskrit Processor Pipeline', () => {
  it('normalizes multi-line Sanskrit with diacritics and whitespace', () => {
    const raw = '  विद्या  \r\n  ददाति   विनयम् ।  ';
    const norm = SanskritProcessor.normalize(raw);
    expect(norm).toBe('विद्या  \n  ददाति   विनयम् ।');
  });

  it('extracts stems for inflectional nominal and verbal forms', () => {
    const verbStems = SanskritProcessor.extractStems('गच्छति');
    expect(verbStems).toContain('गच्छ');

    const nounStems = SanskritProcessor.extractStems('रामस्य');
    expect(nounStems).toContain('राम');
  });

  it('performs unified morphological analysis for baseline dictionary terms', () => {
    const morph = SanskritProcessor.analyzeMorphology('धर्मः');
    expect(morph.confidence).toBe('exact_lexicon');
    expect(morph.lemma).toBe('धर्मः');
    expect(morph.iast).toBe('dharmaḥ');
    expect(morph.meanings.english).toContain('Righteousness');
  });

  it('infers Pāṇinian grammatical traits for inflected words', () => {
    const ramah = SanskritProcessor.analyzeMorphology('रामः');
    expect(ramah.case).toBe('prathamā (nominative)');
    expect(ramah.number).toBe('ekavacana (singular)');
    expect(ramah.gender).toBe('puṃliṅga (masculine)');

    const gacchati = SanskritProcessor.analyzeMorphology('गच्छति');
    expect(gacchati.tense).toBe('laṭ (present)');
    expect(gacchati.person).toBe('prathama (3rd person)');
  });

  it('processes individual tokens with integrated morphology, Sandhi, and phonology', () => {
    const token = SanskritProcessor.processToken('सत्यमेव');
    expect(token.clean).toBe('सत्यमेव');
    expect(token.sandhi.isCompound).toBe(true);
    expect(token.sandhi.possibleSplit).toEqual(['सत्यम्', 'एव']);
    expect(token.phonology.phonemes.length).toBeGreaterThan(0);
  });

  it('processes complete multiline documents and generates line-preserving outputs', () => {
    const doc = SanskritProcessor.processDocument('असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।');
    expect(doc.lines.length).toBe(2);
    expect(doc.totalWords).toBeGreaterThan(4);
    expect(doc.lines[0].tokens.length).toBeGreaterThan(0);
    expect(doc.lines[0].translations.english).toBeDefined();
    expect(doc.lines[1].translations.english).toBeDefined();
  });
});
