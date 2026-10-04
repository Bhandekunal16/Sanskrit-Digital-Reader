# Multilingual Sanskrit Translation Engine

The **Sanskrit Vani** translation module at `/translation` enables cross-lingual access to classical Sanskrit literature through parallel **Hindi (हिन्दी)**, **Marathi (मराठी)**, and **English** renderings with word-by-word tokenized glosses.

---

## 🌐 Linguistic Scope & Objectives

Sanskrit holds deep linguistic, etymological, and cultural roots with modern Indo-Aryan languages like Hindi and Marathi:
- **Tatsama Vocabulary**: Thousands of words in Hindi and Marathi are borrowed directly from Sanskrit with identical or near-identical semantics.
- **Tadbhav Morphological Evolution**: Demonstrates how Sanskrit cases, suffixes, and verbal roots evolved into modern regional idioms.
- **Pedagogical Value**: Learning Sanskrit through Hindi or Marathi is naturally intuitive for millions of native speakers, while English bridges global research.

---

## 📑 Translation Data Architecture

Located in `src/data/translations.ts`, every translation record conforms to the `SanskritTranslation` interface:

```typescript
export interface WordTokenGloss {
  devanagari: string;
  iast: string;
  hindi: string;
  marathi: string;
  english: string;
  grammar: string;
}

export interface SanskritTranslation {
  id: string;
  sanskrit: string;
  iast: string;
  source: string;
  category: string;
  hindi: string;
  marathi: string;
  english: string;
  tokens: WordTokenGloss[];
  anvaya?: string;
}
```

---

## ⚡ Real-Time Features

1. **Target Language Switcher**: Dynamically toggle between Hindi, Marathi, and English.
2. **Comparative View**: View all three languages in a synchronized side-by-side card.
3. **Tokenized Gloss Matrix**: An interactive table that breaks down the sentence word-by-word with grammatical parsing and multilingual equivalents.
4. **Audio Pronunciation**: Speech synthesis for Sanskrit recitation.
