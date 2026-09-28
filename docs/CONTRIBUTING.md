# Contributing to Sanskrit Digital Reader

We welcome contributions from students, teachers, computational linguists, Indologists, and web developers!

Whether you are adding new vocabulary to the dictionary, curating annotated classical verses for the reader, improving transliteration accuracy, or fixing code, this guide will help you get started.

---

## 📋 Code of Conduct & Academic Integrity

- **Factual & Verified**: All linguistic analyses, roots, and grammatical tags must be accurate and grounded in established Sanskrit grammatical tradition (e.g., Pāṇinian *Vyākaraṇa*, Apte, Monier-Williams).
- **Public Domain Citations**: All classical citations and literary passages must be from public domain traditional texts (*Upaniṣads*, *Gītā*, *Epics*, *Subhāṣitas*).
- **Constructive Collaboration**: Treat fellow contributors with respect and patience.

---

## 🛠️ Contribution Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/Sanskrit-Digital-Reader.git
cd Sanskrit-Digital-Reader
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/add-new-lexicon-entries
```

### 3. Install Dependencies & Develop
```bash
npm install
npm run dev
```

### 4. Verify & Build
Before submitting your changes, ensure that TypeScript compiles without errors:
```bash
npm run lint
npm run build
```

---

## 📚 Ways to Contribute

### 1. Adding New Dictionary Words
- Edit `src/data/sanskritDictionary.ts`.
- Follow the `SanskritEntry` schema documented in [`DATA_STRUCTURE.md`](./DATA_STRUCTURE.md).
- Ensure that the entry includes:
  - Accurate Devanagari and IAST spelling
  - Clear English meaning
  - Verbal root (*dhātu*) with meaning and *Gaṇa* (for verbs and root-derived nouns)
  - Grammatical case/tense categorization
  - Step-by-step Pāṇinian morphological decomposition (*prakṛti-pratyaya*)
  - A real classical citation with source attribution and translation

### 2. Adding New Passages to the Reader
- Edit `src/data/passages.ts`.
- Tokenize the verse word-by-word into a 2D array (`tokens: PassageWordToken[][]`).
- Provide Sandhi resolutions (*padaccheda*) for any concatenated words.
- Provide the reconstructed prose order (*Anvaya*) and metrical name.

### 3. Improving Transliteration Engine
- Edit `src/lib/transliteration.ts`.
- Ensure bidirectional mappings (Devanagari ⇄ IAST) remain deterministic.
- Add test words to the benchmark suite in `src/components/TransliterationTool.tsx`.

---

## 🎨 Coding & Design Guidelines

- **TypeScript Strictness**: Avoid `any` types. Utilize explicit interfaces from `src/data/`.
- **Zero-Pill Typography Discipline**: Adhere to the frontend design guidelines:
  - Do **not** wrap static metadata in colored badge capsules or pill boxes.
  - Render metadata as clean, unboxed text separated by typographic separators (`·`, `/`).
  - Reserve styled pill/segment buttons strictly for interactive filter controls.
- **Palette Consistency**: Maintain the archival warm paper palette (`#FBF9F5`, `#FAF7F2`, `#8C4A2F`, `#2C241E`).
- **Responsive Design**: Ensure all cards, tables, and buttons function on mobile viewports.

---

## 🚀 Pull Request Guidelines

1. **Descriptive Title**: Use clear prefixes (e.g. `feat(lexicon): add 5 new philosophical verbs`, `fix(transliteration): correct vocalic r matra mapping`).
2. **Summary of Changes**: Briefly explain what words or features were added or modified.
3. **Verification**: Confirm that `npm run lint` and `npm run build` pass successfully.
