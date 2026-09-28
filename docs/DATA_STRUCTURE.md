# Data Structures & Schemas

This document defines the TypeScript interfaces and schemas used across the **Sanskrit Digital Reader** datasets.

---

## 📚 1. Sanskrit Dictionary Schema (`SanskritEntry`)

Located in `src/data/sanskritDictionary.ts`.

### Interface Definition:
```typescript
export interface SanskritEntry {
  /** Unique URL-friendly slug identifier (e.g. 'dharmah', 'jnanam') */
  id: string;

  /** Primary Sanskrit word in Devanagari script (e.g. 'धर्मः') */
  devanagari: string;

  /** Standard IAST transliteration (e.g. 'dharmaḥ') */
  iast: string;

  /** Primary English definition and contextual nuances */
  meaning: string;

  /** Verbal root in Devanagari, or '—' for indeclinables (e.g. 'धृ') */
  root?: string;

  /** Verbal root in IAST (e.g. 'dhṛ') */
  rootIast?: string;

  /** Meaning of the root (e.g. 'to hold, uphold, support, bear') */
  rootMeaning?: string;

  /** Pāṇinian Gaṇa / Verb Class (e.g. 'Bhvādi (1st Gaṇa)') */
  rootClass?: string;

  /** Lexical category */
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'indeclinable' | 'pronoun' | 'prefix';

  /** Human-readable grammatical summary */
  grammar: string;

  /** Grammatical gender (for nominals and adjectives) */
  gender?: 'masculine' | 'feminine' | 'neuter' | 'indeclinable';

  /** Grammatical number */
  number?: 'singular' | 'dual' | 'plural';

  /** Case / Vibhakti (for nouns/pronouns) */
  caseOrVibhakti?: 
    | 'prathamā (nominative)' 
    | 'dvitīyā (accusative)' 
    | 'tṛtīyā (instrumental)' 
    | 'caturthī (dative)' 
    | 'pañcamī (ablative)' 
    | 'ṣaṣṭhī (genitive)' 
    | 'saptamī (locative)' 
    | 'sambodhana (vocative)';

  /** Tense / Mood / Lakāra (for verbs) */
  tenseOrLakara?: 
    | 'laṭ (present)' 
    | 'laṅ (imperfect past)' 
    | 'loṭ (imperative)' 
    | 'vidhiliṅ (optative)' 
    | 'lṛṭ (future)' 
    | 'liṭ (perfect)';

  /** Grammatical person (for verbs) */
  personOrPurusha?: 'prathama (3rd person)' | 'madhyama (2nd person)' | 'uttama (1st person)';

  /** Verbal voice (for verbs) */
  voiceOrPada?: 'parasmaipada' | 'ātmanepada' | 'ubhayapada';

  /** Step-by-step Pāṇinian Prakṛti-Pratyaya morphological derivation */
  morphology: string;

  /** Historical linguistic and Indo-European etymological notes */
  etymology?: string;

  /** Real classical citation in Devanagari */
  example: string;

  /** Classical citation in IAST */
  exampleIast: string;

  /** English translation of the classical citation */
  exampleMeaning: string;

  /** Cognates and derived terms */
  relatedWords?: string[];

  /** Topical category tags for thematic filtering */
  tags?: string[];
}
```

---

## 📜 2. Sanskrit Passage Schema (`SanskritPassage`)

Located in `src/data/passages.ts`.

### Interface Definitions:
```typescript
export interface PassageWordToken {
  /** Devanagari surface form of the word */
  word: string;

  /** IAST transliteration */
  iast: string;

  /** Contextual definition within the verse */
  meaning: string;

  /** Verbal root if applicable */
  root?: string;

  /** Verbal root in IAST */
  rootIast?: string;

  /** Grammatical inflection summary */
  grammar: string;

  /** Part of speech */
  partOfSpeech: string;

  /** Sandhi resolution explaining separation from adjacent words */
  sandhiSplit?: string;

  /** Set to true for punctuation symbols (। or ॥) */
  isPunctuation?: boolean;
}

export interface SanskritPassage {
  /** Unique passage identifier */
  id: string;

  /** Descriptive title */
  title: string;

  /** Classical literary source citation */
  source: string;

  /** Thematic category */
  category: 'wisdom' | 'philosophy' | 'invocation' | 'vedic';

  /** Classical Sanskrit poetic meter */
  meter: string;

  /** Raw line strings */
  lines: string[];

  /** Tokenized word matrix (outer array: lines, inner array: tokens) */
  tokens: PassageWordToken[][];

  /** Complete English literary translation */
  translation: string;

  /** Pāṇinian prose word order (Anvaya) */
  anvaya: string;

  /** Scholarly commentary and contextual notes */
  explanation: string;
}
```

---

## ➕ How to Add New Words to the Dictionary

To add a new word to the lexicon, append a new object to the `SANSKRIT_DICTIONARY` array in `src/data/sanskritDictionary.ts`:

```typescript
{
  id: 'ahimsa',
  devanagari: 'अहिंसा',
  iast: 'ahiṃsā',
  meaning: 'Non-violence, non-injury, compassionate harmlessness to all beings',
  root: 'हिंस्',
  rootIast: 'hiṃs',
  rootMeaning: 'to harm, injure, strike',
  rootClass: 'Bhvādi (1st Gaṇa) / Curādi (10th Gaṇa)',
  partOfSpeech: 'noun',
  grammar: 'Feminine noun, nominative singular (प्रथमा विभक्ति, एकवचन)',
  gender: 'feminine',
  number: 'singular',
  caseOrVibhakti: 'prathamā (nominative)',
  morphology: 'अन्/नञ् (nañ) + हिंस् (hiṃs) + अ (a) + टाप् (ṭāp) → अहिंसा',
  etymology: 'Negative privative a- prefixed to hiṃsā (harm); foundational ethical vow.',
  example: 'अहिंसा परमो धर्मस्तथाहिंसा परं तपः।',
  exampleIast: 'ahiṃsā paramo dharmastathāhiṃsā paraṃ tapaḥ.',
  exampleMeaning: 'Non-violence is the supreme virtue, and the highest austerity (Mahābhārata).',
  relatedWords: ['हिंसक (hiṃsaka)', 'अहिंसक (ahiṃsaka)', 'हिंसा (hiṃsā)'],
  tags: ['yoga', 'ethics', 'philosophy']
}
```

---

## ✅ Data Validation Checklist

When contributing or editing entries:
1. **Devanagari Accuracy**: Ensure proper diacritics, halanta virāma, and anusvāra placement.
2. **IAST Compliance**: Use standard Unicode diacritics (`ā`, `ī`, `ū`, `ṛ`, `ṝ`, `ḷ`, `ṭ`, `ḍ`, `ṇ`, `ś`, `ṣ`, `ṃ`, `ḥ`).
3. **Pāṇinian Decomposition**: Verify that root and affix descriptions match standard traditional derivations.
4. **Citation Authenticity**: Provide verified citations from public domain classical texts with accurate source attribution.
