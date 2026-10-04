# Sanskrit Vani (संस्कृत-वाणी)
### Sanskrit Digital Reader & Language Technology Platform

> A modern, comprehensive educational Sanskrit language technology web application demonstrating lexical analysis, phonological articulation, vocal tract visualization, audio pronunciation, transliteration, multilingual translation, interactive passage reading, and knowledge assessment.

---

## 📌 Project Overview

**Sanskrit Vani** (formerly Sanskrit Digital Reader) is an interactive, open-source educational platform designed to showcase how computational linguistics, phonetic science, and digital humanities support the study, pedagogy, and preservation of Sanskrit literature.

The platform unites a deterministic baseline lexicon, a complete 52-varṇa vocal tract articulation and audio studio, a bidirectional Devanagari ⇄ IAST transliteration tool, a multilingual translation engine (Sanskrit → Hindi, Marathi, English), an interactive Sanskrit reader with word-level morphological inspection, an 8-category quiz and assessment engine, and in-depth educational resources exploring computational linguistics and manuscript preservation.

---

## ✨ Key Functional Modules

1. **📖 Digital Sanskrit Lexicon (`/dictionary`)**: Search Sanskrit vocabulary by Devanagari, diacritic-insensitive IAST, or English meanings. Inspect root (*dhātu*), grammatical case (*vibhakti*), verbal tense (*lakāra*), Pāṇinian morphological decomposition (*prakṛti-pratyaya*), etymology, contextual citations, and parallel Hindi/Marathi definitions.
2. **🔊 Sanskrit Vowels & Consonants (`/vowels-consonants`)**: Comprehensive 52-varṇa Varṇamālā explorer with dual-engine audio pronunciation (Web Audio API resonant formant synthesis + Web Speech API Indic voice), vocal tract anatomical articulation taxonomy (*Kaṇṭha*, *Tālu*, *Mūrdhā*, *Danta*, *Oṣṭha*, *Nāsikā*), Bāraha-khaḍī 13-mātrā studio, Pāṇinian Śikṣā recitation verses, and interactive ear-training practice.
3. **🔤 Phonetic Transliteration Engine (`/transliteration`)**: Convert Devanagari script to IAST (International Alphabet of Sanskrit Transliteration, ISO 15919) and vice-versa losslessly, complete with phoneme articulation mapping.
4. **🌐 Multilingual Sanskrit Translation (`/translation`)**: Translate Sanskrit words, phrases, and classical verses into **Hindi (हिन्दी)**, **Marathi (मराठी)**, and **English** with side-by-side comparative views and tokenized word glosses.
5. **📜 Interactive Sanskrit Reader (`/reader`)**: Read classical verses (*Hitopadeśa*, *Bhagavad Gītā* 2.47, *Taittirīya Upaniṣad*), toggle translations dynamically between Hindi, Marathi, and English, select individual word tokens to inspect instant morphological breakdowns, and view reconstructed prose syntax (*Anvaya*).
6. **🎓 Sanskrit Quiz & Assessment (`/quiz`)**: Test and reinforce knowledge across 8 categories (Vocabulary, Grammar, Sandhi, Samāsa, Transliteration, Phonology, Translation, Reading) with 3 difficulty levels, hint assistance, and immediate feedback.
7. **🤖 Language Technology Insights (`/technology`)**: Structured explanations of how digital dictionaries, transliteration standards, finite-state morphological parsers, and NLP translation pipelines power modern Indic language computing.
8. **🏛️ Digital Preservation Hub (`/about`)**: Comprehensive exploration of Sanskrit textual heritage (est. 30+ million manuscripts), archival digitization challenges, TEI XML schemas, and long-term digital preservation strategies.

---

## 🛠️ Technology Stack

- **Framework**: React / Next.js compatible SPA architecture with TypeScript
- **Styling**: Tailwind CSS with custom Devanagari and Latin typography
- **Icons**: Lucide React
- **Audio Engine**: Dual-engine architecture combining Web Audio API acoustic formant synthesis (zero-latency vocal resonance) with Web Speech API Indic text-to-speech
- **Routing**: Single-source-of-truth client-side router supporting 9 canonical routes and automatic alias normalization
- **Data Layer**: Structured TypeScript lexical, phonological, translation, and quiz datasets (zero backend latency)
- **Testing**: Vitest automated test suite (40+ unit and integration tests)

---

## 🗺️ Navigation & Route Architecture

| Route | View Name | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Hero search, feature modules overview, and platform capabilities |
| `/dictionary` | **Dictionary** | Searchable Sanskrit lexicon with Pāṇinian morphological parsing |
| `/vowels-consonants` | **Vowels & Consonants** | Watch articulatory anatomy, 52-varṇa audio player, Bāraha-khaḍī, and ear training |
| `/transliteration` | **Transliteration** | Bidirectional Devanagari ⇄ IAST phonetic script converter |
| `/translation` | **Translation** | Sanskrit to Hindi, Marathi, and English multilingual translator |
| `/reader` | **Reader** | Tokenized classical literature reader with morphological glosses |
| `/quiz` | **Quiz** | 8-category Sanskrit assessment system with immediate feedback |
| `/technology` | **Language Technology** | Computational linguistics, Pāṇinian grammar engines, and NLP |
| `/about` | **About** | Digital preservation, manuscript informatics, and TEI XML |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: Node 20 LTS)
- **npm**: `v9.0.0` or higher

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Bhandekunal16/Sanskrit-Digital-Reader.git

# 2. Navigate to project directory
cd Sanskrit-Digital-Reader

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests
```bash
npm test
```

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| [**PROJECT_OVERVIEW.md**](./PROJECT_OVERVIEW.md) | High-level project objectives, educational mission, target audience, and scope. |
| [**FEATURES.md**](./FEATURES.md) | Comprehensive breakdown of all application features and capabilities. |
| [**VOWELS_CONSONANTS.md**](./VOWELS_CONSONANTS.md) | In-depth guide to the Vowels & Consonants (Varṇamālā) audio/visual studio. |
| [**QUIZ.md**](./QUIZ.md) | Complete guide to the Sanskrit Quiz & Assessment engine. |
| [**DICTIONARY.md**](./DICTIONARY.md) | Lexical data model, search algorithms, and missing-entry handling. |
| [**TRANSLITERATION.md**](./TRANSLITERATION.md) | Phonotactic transliteration rules, ISO 15919 / IAST schemes, and phonetics. |
| [**TRANSLATION.md**](./TRANSLATION.md) | Multilingual translation engine (Sanskrit → Hindi, Marathi, English) and NLP scope. |
| [**READER.md**](./READER.md) | Interactive passage tokenization, *Anvaya* reconstruction, and metrical analysis. |
| [**LANGUAGE_TECHNOLOGY.md**](./LANGUAGE_TECHNOLOGY.md) | Educational guide on how digital tools support Sanskrit computational linguistics. |
| [**DIGITAL_PRESERVATION.md**](./DIGITAL_PRESERVATION.md) | Manuscript heritage, digitization challenges, TEI XML, and preservation ethics. |
| [**DATA_STRUCTURE.md**](./DATA_STRUCTURE.md) | TypeScript interface definitions, field schemas, and sample records. |
| [**INSTALLATION.md**](./INSTALLATION.md) | Setup instructions, environment requirements, and production build guides. |
| [**USAGE.md**](./USAGE.md) | Step-by-step user walkthroughs with examples and search tips. |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | System architecture, component hierarchy, and data flow diagrams. |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Contribution workflow for adding words, passages, or improving transliteration. |

---

## ⚖️ License & Attribution

This project is released under the **Apache-2.0 License**. Classical Sanskrit texts and examples are derived from public domain traditional literature (*Manusmṛti*, *Hitopadeśa*, *Bhagavad Gītā*, *Upaniṣads*, *Pāṇinīya Śikṣā*).
