# Data Structures & Schemas

This document defines the TypeScript interfaces and schemas used across the **Sanskrit Vani** datasets.

---

## 📚 1. Sanskrit Dictionary Schema (`SanskritEntry`)

Located in `src/data/sanskritDictionary.ts`.

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

## 🔊 2. Varṇamālā & Phonetics Schema (`VarnaLetter`)

Located in `src/data/varnamala.ts`.

```typescript
export type VarnamalaSection = 'vowels' | 'consonants' | 'conjuncts' | 'vedic';
export type SvaraType = 'hrasva' | 'dirgha' | 'sandhyaksara' | 'ayogavaha';
export type VargaType = 'ka-varga' | 'ca-varga' | 'ta-retro-varga' | 'ta-dental-varga' | 'pa-varga' | 'antastha' | 'ushman' | 'samyukta' | 'vaidika';

export interface VarnaLetter {
  id: string;
  devanagari: string;
  iast: string;
  ipa: string;
  section: VarnamalaSection;
  subType?: SvaraType;
  varga?: VargaType;
  vargaName?: string;
  
  // Phonological Classification
  placeEn: string;
  placeSa: string;
  placeTerm: string;
  organEn: string;
  organSa: string;
  
  // Effort (Prayatna)
  internalEffortSa: string; // आभ्यन्तर प्रयत्न
  internalEffortEn: string;
  externalEffortSa: string; // बाह्य प्रयत्न
  externalEffortEn: string;
  voicing: 'voiced' | 'unvoiced';
  aspiration: 'unaspirated' | 'aspirated' | 'nasal' | 'vowel';
  
  // Duration & Matra
  matraDuration?: string;
  matraSign?: string;
  
  // Academic & Traditional details
  paniniSutra?: string;
  paniniSutraMeaning?: string;
  description: string;
  pronunciationTip: string;
  
  // Exemplar Word
  exemplar: {
    devanagari: string;
    iast: string;
    meaningEn: string;
    meaningHi: string;
    meaningMr: string;
    category: string;
  };
  
  // Acoustic Formant & Synthesis Frequencies
  audioParams: {
    baseFreq: number;
    formantF1: number;
    formantF2: number;
    formantF3: number;
    duration: number;
    type: 'vowel' | 'stop' | 'nasal' | 'fricative' | 'semivowel' | 'aspirate';
    isAspirated?: boolean;
    isVoiced?: boolean;
  };
}
```

---

## 🎓 3. Sanskrit Quiz Schema (`QuizQuestion`)

Located in `src/data/quizzes.ts`.

```typescript
export type QuizCategory =
  | 'vocabulary'
  | 'grammar'
  | 'sandhi'
  | 'samasa'
  | 'transliteration'
  | 'phonology'
  | 'translation'
  | 'reading'
  | 'mixed';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type QuizType = 'single' | 'multiple' | 'true-false';

export interface QuizOption {
  id: string;
  text: string;
  devanagari?: string;
  iast?: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  type: QuizType;
  question: string;
  questionDevanagari?: string;
  context?: string;
  options: QuizOption[];
  correctAnswers: string[];
  explanation: string;
  hint?: string;
}
```

---

## 📜 4. Sanskrit Passage Schema (`SanskritPassage`)

Located in `src/data/passages.ts`.

```typescript
export interface PassageWordToken {
  word: string;
  iast: string;
  meaning: string;
  root?: string;
  rootIast?: string;
  grammar: string;
  partOfSpeech: string;
  sandhiSplit?: string;
  isPunctuation?: boolean;
}

export interface SanskritPassage {
  id: string;
  title: string;
  source: string;
  category: 'wisdom' | 'philosophy' | 'invocation' | 'vedic';
  meter: string;
  lines: string[];
  tokens: PassageWordToken[][];
  translation: string;
  anvaya: string;
  explanation: string;
}
```
