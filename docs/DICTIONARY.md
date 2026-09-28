# Sanskrit Dictionary & Lexical Architecture

The **Sanskrit Digital Reader** dictionary module implements a structured, multi-dimensional lexical model designed to represent the rich inflectional and morphological realities of Sanskrit.

---

## 🗂️ Lexical Data Model

Unlike simple bilingual word-lists, every entry in `sanskritDictionary.ts` conforms to the `SanskritEntry` TypeScript interface:

```typescript
export interface SanskritEntry {
  id: string;                                // Unique lowercase identifier (e.g. 'dharmah')
  devanagari: string;                        // Canonical Devanagari representation (e.g. 'धर्मः')
  iast: string;                              // Standard IAST romanization (e.g. 'dharmaḥ')
  meaning: string;                           // Primary English definitions
  root?: string;                             // Verbal root in Devanagari (e.g. 'धृ')
  rootIast?: string;                         // Verbal root in IAST (e.g. 'dhṛ')
  rootMeaning?: string;                      // Meaning of the root (e.g. 'to hold, uphold, support')
  rootClass?: string;                        // Pāṇinian Gaṇa (e.g. 'Bhvādi (1st Gaṇa)')
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'indeclinable' | 'pronoun' | 'prefix';
  grammar: string;                           // Human-readable grammatical description
  gender?: 'masculine' | 'feminine' | 'neuter' | 'indeclinable';
  number?: 'singular' | 'dual' | 'plural';
  caseOrVibhakti?: string;                   // Case name (e.g. 'prathamā (nominative)')
  tenseOrLakara?: string;                    // Tense/mood name (e.g. 'laṭ (present)')
  personOrPurusha?: string;                  // Person (e.g. 'prathama (3rd person)')
  voiceOrPada?: string;                      // Voice (e.g. 'parasmaipada' or 'ātmanepada')
  morphology: string;                        // Pāṇinian Prakṛti-Pratyaya decomposition
  etymology?: string;                        // Historical linguistic and PIE cognate notes
  example: string;                           // Classical citation in Devanagari
  exampleIast: string;                       // Classical citation in IAST
  exampleMeaning: string;                    // English translation of the citation
  relatedWords?: string[];                   // Cognates and derived vocabulary
  tags?: string[];                           // Topical tags (e.g. ['ethics', 'philosophy'])
}
```

---

## 🔍 Search Engine Implementation

The dictionary search logic in `src/lib/dictionary.ts` employs a multi-tiered matching strategy:

### 1. Diacritic Normalization
To enable flexible search without requiring specialized IAST keyboard layouts, the `normalizeIast()` function strips diacritics to basic ASCII:

```typescript
export function normalizeIast(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[āáà]/g, 'a')
    .replace(/[īíì]/g, 'i')
    .replace(/[ūúù]/g, 'u')
    .replace(/[ṛṝ]/g, 'r')
    .replace(/[ḷḹ]/g, 'l')
    .replace(/[ṅñṇ]/g, 'n')
    .replace(/[ṭḍ]/g, 't')
    .replace(/[śṣ]/g, 's')
    .replace(/[ṃṁ]/g, 'm')
    .replace(/[ḥ]/g, 'h')
    .replace(/[^a-z0-9]/g, '');
}
```

This ensures that queries like `dharma`, `dharm`, `dharmah`, and `dharmaḥ` all correctly resolve to `धर्मः`.

### 2. Search Precedence
1. **Exact Devanagari Match**: Matches the exact word or word stem minus visarga/anusvāra.
2. **Exact IAST Match**: Matches the precise IAST string or its normalized ASCII equivalent.
3. **Substring & Semantic Match**: Searches across definitions, roots, and topic tags.

---

## 🔎 Missing-Word Handling & Fuzzy Fallback

If a user searches for a term not present in the curated demo dataset:
1. The search engine computes the **Levenshtein edit distance** between the query and all dictionary entries in both Devanagari and normalized IAST.
2. The entries with the lowest edit distances are ranked and returned as helpful suggestions.
3. The UI presents an informative fallback:
   > *"No entry found in the demo dictionary. Did you mean one of these words?"*

---

## 📝 Sample Lexicon Record

```typescript
{
  id: 'jnanam',
  devanagari: 'ज्ञानम्',
  iast: 'jñānam',
  meaning: 'Knowledge, wisdom, cognition, spiritual realization, consciousness',
  root: 'ज्ञा',
  rootIast: 'jñā',
  rootMeaning: 'to know, perceive, understand',
  rootClass: 'Kryādi (9th Gaṇa)',
  partOfSpeech: 'noun',
  grammar: 'Neuter noun, nominative singular (प्रथमा विभक्ति, एकवचन)',
  gender: 'neuter',
  number: 'singular',
  caseOrVibhakti: 'prathamā (nominative)',
  morphology: 'ज्ञा (jñā) + ल्युट् (lyuṭ / -ana suffix) + अम् (am) → ज्ञानम्',
  etymology: 'Proto-Indo-European *ǵneh₃- ("to know"), cognate with Greek gnōsis and English know.',
  example: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।',
  exampleIast: 'na hi jñānena sadṛśaṃ pavitramiha vidyate.',
  exampleMeaning: 'Truly, there is nothing in this world as purifying as knowledge (Bhagavad Gītā 4.38).',
  relatedWords: ['ज्ञानी (jñānī)', 'विज्ञान (vijñāna)', 'अज्ञान (ajñāna)', 'जिज्ञासा (jijñāsā)'],
  tags: ['philosophy', 'epistemology', 'vedanta']
}
```
