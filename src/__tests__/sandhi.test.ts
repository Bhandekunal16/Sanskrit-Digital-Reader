import { describe, it, expect } from 'vitest';
import { analyzeSandhi } from '../lib/sandhi';

describe('Sanskrit Sandhi & Compound Segmentation Engine', () => {
  it('identifies exact verified Sandhi splits from classical literature', () => {
    const resSatyameva = analyzeSandhi('सत्यमेव');
    expect(resSatyameva.possibleSplit).toEqual(['सत्यम्', 'एव']);
    expect(resSatyameva.sandhiType).toBe('vyanjana');
    expect(resSatyameva.confidence).toBe('exact_dataset');

    const resSuryodaya = analyzeSandhi('सूर्योदयः');
    expect(resSuryodaya.possibleSplit).toEqual(['सूर्य', 'उदयः']);
    expect(resSuryodaya.sandhiType).toBe('svara');
    expect(resSuryodaya.sanskritTerm).toContain('गुणसन्धिः');
  });

  it('correctly splits Sadgamaya and Jyotirgamaya compounds', () => {
    const resSadgamaya = analyzeSandhi('सद्गमय');
    expect(resSadgamaya.possibleSplit).toEqual(['सत्', 'गमय']);
    expect(resSadgamaya.sanskritTerm).toContain('जश्त्वसन्धिः');

    const resJyotirgamaya = analyzeSandhi('ज्योतिर्गमय');
    expect(resJyotirgamaya.possibleSplit).toEqual(['ज्योतिः', 'गमय']);
    expect(resJyotirgamaya.sanskritTerm).toContain('रुत्वसन्धिः');
  });

  it('handles rule-based avagraha (पूर्वरूपसन्धिः) heuristics', () => {
    const resAvagraha = analyzeSandhi('सोऽपि');
    expect(resAvagraha.isCompound).toBe(true);
    expect(resAvagraha.possibleSplit).toEqual(['सः', 'अपि']);
  });

  it('handles non-compound or basic root words gracefully', () => {
    const resBasic = analyzeSandhi('ज्ञानम्');
    expect(resBasic.sandhiType).toBe('none');
    expect(resBasic.possibleSplit).toEqual(['ज्ञानम्']);
  });
});
