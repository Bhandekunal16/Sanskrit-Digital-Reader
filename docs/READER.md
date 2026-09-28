# Sanskrit Reader Module

The **Sanskrit Reader** module bridges the gap between raw classical Sanskrit verses and syntactic comprehension by decomposing poetry into interactive, individually annotable word tokens.

---

## 📖 Pedagogical Workflow

Classical Sanskrit poetry is typically composed in metered stanzas where words are rearranged for poetic rhythm and concatenated through complex Sandhi rules. The reader enables learners to reverse-engineer these verses systematically:

```mermaid
graph LR
    A[Classical Sanskrit Verse] --> B[Word Token Selection]
    B --> C[Sandhi Splitting / Padaccheda]
    C --> D[Morphological & Root Inspection]
    D --> E[Prose Order / Anvaya]
    E --> F[Complete Understanding]
```

---

## 📜 Sample Passage Structure

Each curated passage in `passages.ts` is modeled with line-by-line token arrays:

```typescript
export interface PassageWordToken {
  word: string;             // Devanagari surface form
  iast: string;             // IAST romanization
  meaning: string;          // Meaning in context
  root?: string;            // Underlying verbal root
  rootIast?: string;        // Root in IAST
  grammar: string;          // Grammatical case, number, tense
  partOfSpeech: string;     // Nominal / Verbal / Indeclinable
  sandhiSplit?: string;     // Sandhi resolution if concatenated
  isPunctuation?: boolean;  // Punctuation flag (ignored for click inspection)
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

---

## 🔍 Case Study: *Hitopadeśa* (The Fruits of Learning)

### 1. Sanskrit Verse:
```text
विद्या ददाति विनयं विनयाद् याति पात्रताम् ।
पात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम् ॥
```

### 2. Tokenized Interactive Breakdown:

| Token | IAST | Sandhi Resolution (*Padaccheda*) | Grammatical Analysis | Root (*Dhātu*) | Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **विद्या** | *vidyā* | — | Feminine noun, Nom. Sg. | विद् (*vid*) | True knowledge / learning |
| **ददाति** | *dadāti* | — | Verb, Present 3rd Sg. Parasmaipada | दा (*dā*) | Gives / bestows |
| **विनयम्** | *vinayam* | — | Masculine noun, Acc. Sg. | नी (*nī*) | Humility / discipline |
| **विनयात्** | *vinayāt* | विनयाद् → विनयात् | Masculine noun, Ablative Sg. | नी (*nī*) | From humility |
| **याति** | *yāti* | — | Verb, Present 3rd Sg. | या (*yā*) | Goes to / attains |
| **पात्रताम्** | *pātratām* | — | Feminine abstract noun, Acc. Sg. | पा (*pā*) | Worthiness / capacity |
| **पात्रत्वात्** | *pātratvāt* | पात्रत्वाद् → पात्रत्वात् | Neuter abstract noun, Ablative Sg. | पा (*pā*) | From worthiness |
| **धनम्** | *dhanam* | धनमाप्नोति → धनम् + आप्नोति | Neuter noun, Acc. Sg. | धन् (*dhan*) | Wealth / resources |
| **आप्नोति** | *āpnoti* | धनमाप्नोति → धनम् + आप्नोति | Verb, Present 3rd Sg. (5th Gaṇa) | आप् (*āp*) | Obtains / acquires |
| **धनात्** | *dhanāt* | धनाद् → धनात् | Neuter noun, Ablative Sg. | धन् (*dhan*) | From wealth |
| **धर्मम्** | *dharmam* | — | Masculine noun, Acc. Sg. | धृ (*dhṛ*) | Righteous duty |
| **ततः** | *tataḥ* | — | Indeclinable / Avyaya | — | Thereafter / from that |
| **सुखम्** | *sukham* | — | Neuter noun, Nom./Acc. Sg. | ख (*kha*) | Happiness / ease |

---

### 3. Pāṇinian Prose Order (*Anvaya*):
> **विद्या विनयं ददाति। विनयात् पात्रतां याति। पात्रत्वात् धनम् आप्नोति। धनात् धर्मम् (आप्नोति), ततः सुखम् (भवति)।**

### 4. English Translation:
> *"Knowledge bestows humility. From humility, one gains worthiness. From worthiness, one acquires wealth. From wealth, one performs righteous duty (dharma), and from that arises true, enduring happiness."*

---

## 🎛️ Reader User Interface Features

1. **Active Focus & Highlighting**: When any word button is clicked, it highlights with a terracotta ring and immediately syncs the side inspection card.
2. **Meter Identification**: Displays classical metrical forms (e.g., *Anuṣṭubh* — 8 syllables per *pāda*, 32 syllables total).
3. **Anvaya Drawer**: An expandable section explaining the natural prose order of the sentence for syntax learners.
4. **Full Audio Recitation**: Native speech synthesis recitation of the complete verse.
