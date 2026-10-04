# Contributing to Sanskrit Vani

We welcome contributions from students, teachers, computational linguists, Indologists, and web developers!

Whether you are adding new vocabulary to the dictionary, expanding the 52-varṇa phonetics dataset, creating quiz questions, curating classical verses, or refining transliteration, this guide will help you get started.

---

## 📋 Code of Conduct & Academic Integrity

- **Factual & Verified**: All linguistic analyses, roots, and grammatical tags must be accurate and grounded in established Sanskrit grammatical tradition (e.g., Pāṇinian *Vyākaraṇa*, Apte, Monier-Williams, *Pāṇinīya Śikṣā*).
- **Public Domain Citations**: All classical citations and literary passages must be from public domain traditional texts (*Upaniṣads*, *Gītā*, *Epics*, *Subhāṣitas*).
- **Constructive Collaboration**: Treat fellow contributors with respect and scholarly rigor.

---

## 🛠️ Contribution Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/Sanskrit-Digital-Reader.git
cd Sanskrit-Digital-Reader
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/add-quiz-questions
```

### 3. Install Dependencies & Develop
```bash
npm install
npm run dev
```

### 4. Verify & Run Tests
Before submitting your changes, ensure that linting and unit tests pass:
```bash
npm run lint
npm test
npm run build
```

---

## 📚 Ways to Contribute

### 1. Adding New Dictionary Words
- Edit `src/data/sanskritDictionary.ts`.
- Follow the `SanskritEntry` schema in [`DATA_STRUCTURE.md`](./DATA_STRUCTURE.md).

### 2. Enhancing Varṇamālā & Phonetics Data
- Edit `src/data/varnamala.ts`.
- Follow the `VarnaLetter` schema for phonetic places (*Sthāna*), internal/external efforts (*Prayatna*), Pāṇinian sūtras, and audio frequency parameters.

### 3. Adding Sanskrit Quiz Questions
- Edit `src/data/quizzes.ts`.
- Follow the `QuizQuestion` schema, assigning appropriate category, difficulty tier, single/multiple/true-false type, reasoning hint, and detailed Pāṇinian explanation.

### 4. Adding Classical Passages to the Reader
- Edit `src/data/passages.ts`.
- Tokenize the verse word-by-word into a 2D array (`tokens: PassageWordToken[][]`).
- Provide Sandhi resolutions (*padaccheda*) and reconstructed prose order (*Anvaya*).

---

## 🎨 Coding & Design Guidelines

- **TypeScript Strictness**: Avoid `any` types; utilize explicit interfaces.
- **Single Source of Truth**: Never duplicate linguistic datasets across components; always reference centralized definitions in `src/data/`.
- **Zero-Pill Typography Discipline**: Maintain clean, unboxed metadata separated by typographic separators (`·`, `/`).
- **Warm Archival Palette**: Maintain consistent paper and terracotta tones (`#FBF9F5`, `#FAF7F2`, `#8C4A2F`, `#2C241E`).
