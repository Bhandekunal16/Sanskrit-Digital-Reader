/**
 * Rule-based Sanskrit Transliteration Engine (Devanagari ⇄ IAST)
 * Implements standard IAST (International Alphabet of Sanskrit Transliteration) phonotactics.
 */

// Mapping of independent vowels
const INDEPENDENT_VOWELS: Record<string, string> = {
  'अ': 'a',
  'आ': 'ā',
  'इ': 'i',
  'ई': 'ī',
  'उ': 'u',
  'ऊ': 'ū',
  'ऋ': 'ṛ',
  'ॠ': 'ṝ',
  'ऌ': 'ḷ',
  'ॡ': 'ḹ',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
};

// Mapping of dependent vowel signs (mātrās)
const DEPENDENT_VOWELS: Record<string, string> = {
  'ा': 'ā',
  'ि': 'i',
  'ी': 'ī',
  'ु': 'u',
  'ू': 'ū',
  'ृ': 'ṛ',
  'ॄ': 'ṝ',
  'ॢ': 'ḷ',
  'ॣ': 'ḹ',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
};

// Consonant base representations (without inherent 'a')
const CONSONANTS: Record<string, string> = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ṅ',
  'च': 'c', 'छ': 'ch', 'ज': 'j', 'झ': 'jh', 'ञ': 'ñ',
  'ट': 'ṭ', 'ठ': 'ṭh', 'ड': 'ḍ', 'ढ': 'ḍh', 'ण': 'ṇ',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r',  'ल': 'l', 'व': 'v',
  'श': 'ś', 'ष': 'ṣ',  'स': 's', 'ह': 'h',
  'ळ': 'ḻ', 'क्ष': 'kṣ', 'ज्ञ': 'jñ'
};

// Special modifiers
const SPECIAL_SIGNS: Record<string, string> = {
  'ं': 'ṃ', // Anusvāra
  'ः': 'ḥ', // Visarga
  'ँ': 'm̐', // Candrabindu
  'ऽ': "'", // Avagraha
  '।': '.', // Pūrṇavirāma
  '॥': '..', // Dīrghavirāma
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

const VIRAMA = '्';

/**
 * Converts Devanagari text to IAST transliteration.
 */
export function devanagariToIast(text: string): string {
  if (!text) return '';

  let result = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const nextChar = i + 1 < len ? text[i + 1] : '';

    // Check independent vowel
    if (INDEPENDENT_VOWELS[char]) {
      result += INDEPENDENT_VOWELS[char];
      continue;
    }

    // Check special characters
    if (SPECIAL_SIGNS[char]) {
      result += SPECIAL_SIGNS[char];
      continue;
    }

    // Check consonant
    if (CONSONANTS[char]) {
      const baseConsonant = CONSONANTS[char];

      if (nextChar === VIRAMA) {
        // Suppress inherent 'a'
        result += baseConsonant;
        i++; // skip virama
      } else if (DEPENDENT_VOWELS[nextChar]) {
        // Replace inherent 'a' with the dependent vowel
        result += baseConsonant + DEPENDENT_VOWELS[nextChar];
        i++; // skip matra
      } else {
        // Default inherent 'a'
        result += baseConsonant + 'a';
      }
      continue;
    }

    // Just append standard characters (spaces, punctuation, latin chars)
    if (char !== VIRAMA) {
      result += char;
    }
  }

  return result;
}

/**
 * Reverse mapping from IAST to Devanagari
 */
const IAST_TO_DEV_VOWELS: [string, string][] = [
  ['ai', 'ऐ'], ['au', 'औ'], ['ā', 'आ'], ['ī', 'ई'], ['ū', 'ऊ'],
  ['ṝ', 'ॠ'], ['ṛ', 'ऋ'], ['ḹ', 'ॡ'], ['ḷ', 'ऌ'],
  ['a', 'अ'], ['i', 'इ'], ['u', 'उ'], ['e', 'ए'], ['o', 'ओ']
];

const IAST_TO_DEV_MATRAS: [string, string][] = [
  ['ai', 'ै'], ['au', 'ौ'], ['ā', 'ा'], ['ī', 'ी'], ['ū', 'ू'],
  ['ṝ', 'ॄ'], ['ṛ', 'ृ'], ['ḹ', 'ॣ'], ['ḷ', 'ॢ'],
  ['i', 'ि'], ['u', 'ु'], ['e', 'े'], ['o', 'ो']
];

const IAST_TO_DEV_CONSONANTS: [string, string][] = [
  ['kṣ', 'क्ष्'], ['jñ', 'ज्ञ्'],
  ['kh', 'ख्'], ['gh', 'घ्'], ['ch', 'छ्'], ['jh', 'झ्'],
  ['ṭh', 'ठ्'], ['ḍh', 'ढ्'], ['th', 'थ्'], ['dh', 'ध्'], ['ph', 'फ्'], ['bh', 'भ्'],
  ['ṅ', 'ङ्'], ['ñ', 'ञ्'], ['ṭ', 'ट्'], ['ḍ', 'ड्'], ['ṇ', 'ण्'],
  ['t', 'त्'], ['d', 'द्'], ['n', 'न्'], ['p', 'प्'], ['b', 'ब्'], ['m', 'म्'],
  ['y', 'य्'], ['r', 'र्'], ['l', 'ल्'], ['v', 'व्'],
  ['ś', 'श्'], ['ṣ', 'ष्'], ['s', 'स्'], ['h', 'ह्'],
  ['k', 'क्'], ['g', 'ग्'], ['c', 'च्'], ['j', 'ज्']
];

/**
 * Converts IAST text to Devanagari.
 */
export function iastToDevanagari(text: string): string {
  if (!text) return '';

  let input = text.trim();
  let output = '';
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Check for special marks
    if (char === 'ṃ' || char === 'ṁ') {
      output += 'ं';
      i++;
      continue;
    }
    if (char === 'ḥ') {
      output += 'ः';
      i++;
      continue;
    }
    if (char === "'" || char === '’') {
      output += 'ऽ';
      i++;
      continue;
    }
    if (char === '.' && input[i + 1] === '.') {
      output += '॥';
      i += 2;
      continue;
    }
    if (char === '.') {
      output += '।';
      i++;
      continue;
    }
    if (/\s/.test(char) || /[,;!?:()\[\]\-]/.test(char)) {
      output += char;
      i++;
      continue;
    }

    // Try to match a consonant
    let matchedConsonant: { dev: string; len: number } | null = null;
    for (const [iastPattern, devChar] of IAST_TO_DEV_CONSONANTS) {
      if (input.slice(i, i + iastPattern.length).toLowerCase() === iastPattern) {
        matchedConsonant = { dev: devChar, len: iastPattern.length };
        break;
      }
    }

    if (matchedConsonant) {
      i += matchedConsonant.len;
      // Look ahead for vowel following this consonant
      let matchedMatra: { matra: string; len: number } | null = null;

      // Check for inherent 'a' (which removes the virama)
      if (input[i] === 'a' && input[i + 1] !== 'i' && input[i + 1] !== 'u') {
        // Just remove the halanta/virama from the consonant
        output += matchedConsonant.dev.replace('्', '');
        i += 1;
        continue;
      }

      for (const [matraPattern, matraChar] of IAST_TO_DEV_MATRAS) {
        if (input.slice(i, i + matraPattern.length).toLowerCase() === matraPattern) {
          matchedMatra = { matra: matraChar, len: matraPattern.length };
          break;
        }
      }

      if (matchedMatra) {
        // Consonant with matra (replace virama with matra)
        output += matchedConsonant.dev.replace('्', matchedMatra.matra);
        i += matchedMatra.len;
      } else {
        // Consonant with halanta / virama
        output += matchedConsonant.dev;
      }
      continue;
    }

    // Try to match an independent initial vowel
    let matchedVowel: { dev: string; len: number } | null = null;
    for (const [vowelPattern, devVowel] of IAST_TO_DEV_VOWELS) {
      if (input.slice(i, i + vowelPattern.length).toLowerCase() === vowelPattern) {
        matchedVowel = { dev: devVowel, len: vowelPattern.length };
        break;
      }
    }

    if (matchedVowel) {
      output += matchedVowel.dev;
      i += matchedVowel.len;
      continue;
    }

    // Unmatched character, pass through
    output += char;
    i++;
  }

  return output;
}

export interface PhoneticCategory {
  title: string;
  sanskritName: string;
  organ: string;
  items: { devanagari: string; iast: string; type: string }[];
}

export const SANSKRIT_PHONETIC_CHART: PhoneticCategory[] = [
  {
    title: 'Guttural (Velar)',
    sanskritName: 'कण्ठ्य (Kaṇṭhya)',
    organ: 'Throat / Soft Palate',
    items: [
      { devanagari: 'अ, आ', iast: 'a, ā', type: 'Vowels' },
      { devanagari: 'क, ख', iast: 'ka, kha', type: 'Unvoiced Stop' },
      { devanagari: 'ग, घ', iast: 'ga, gha', type: 'Voiced Stop' },
      { devanagari: 'ङ', iast: 'ṅa', type: 'Nasal' },
      { devanagari: 'ह, ः', iast: 'ha, ḥ', type: 'Aspirate / Visarga' }
    ]
  },
  {
    title: 'Palatal',
    sanskritName: 'तालव्य (Tālavya)',
    organ: 'Hard Palate',
    items: [
      { devanagari: 'इ, ई', iast: 'i, ī', type: 'Vowels' },
      { devanagari: 'च, छ', iast: 'ca, cha', type: 'Unvoiced Stop' },
      { devanagari: 'ज, झ', iast: 'ja, jha', type: 'Voiced Stop' },
      { devanagari: 'ञ', iast: 'ña', type: 'Nasal' },
      { devanagari: 'य, श', iast: 'ya, śa', type: 'Semivowel / Sibilant' }
    ]
  },
  {
    title: 'Retroflex (Cerebral)',
    sanskritName: 'मूर्धन्य (Mūrdhanya)',
    organ: 'Roof of Mouth / Coronal',
    items: [
      { devanagari: 'ऋ, ॠ', iast: 'ṛ, ṝ', type: 'Vowels' },
      { devanagari: 'ट, ठ', iast: 'ṭa, ṭha', type: 'Unvoiced Stop' },
      { devanagari: 'ड, ढ', iast: 'ḍa, ḍha', type: 'Voiced Stop' },
      { devanagari: 'ण', iast: 'ṇa', type: 'Nasal' },
      { devanagari: 'र, ष', iast: 'ra, ṣa', type: 'Semivowel / Sibilant' }
    ]
  },
  {
    title: 'Dental',
    sanskritName: 'दन्त्य (Dantya)',
    organ: 'Teeth / Alveolar',
    items: [
      { devanagari: 'ऌ, ॡ', iast: 'ḷ, ḹ', type: 'Vowels' },
      { devanagari: 'त, थ', iast: 'ta, tha', type: 'Unvoiced Stop' },
      { devanagari: 'द, ध', iast: 'da, dha', type: 'Voiced Stop' },
      { devanagari: 'न', iast: 'na', type: 'Nasal' },
      { devanagari: 'ल, स', iast: 'la, sa', type: 'Semivowel / Sibilant' }
    ]
  },
  {
    title: 'Labial',
    sanskritName: 'ओष्ठ्य (Oṣṭhya)',
    organ: 'Lips',
    items: [
      { devanagari: 'उ, ऊ', iast: 'u, ū', type: 'Vowels' },
      { devanagari: 'प, फ', iast: 'pa, pha', type: 'Unvoiced Stop' },
      { devanagari: 'ब, भ', iast: 'ba, bha', type: 'Voiced Stop' },
      { devanagari: 'म', iast: 'ma', type: 'Nasal' },
      { devanagari: 'व', iast: 'va', type: 'Labiodental' }
    ]
  }
];
