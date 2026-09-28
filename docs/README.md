# Sanskrit Digital Reader

> A modern, educational Sanskrit Language Technology web application demonstrating lexical analysis, phonological transliteration, multilingual translation, interactive passage reading, and digital preservation.

---

## 📌 Project Overview

**Sanskrit Digital Reader** is an interactive, open-source educational platform designed to showcase how computational linguistics and digital tools support the analysis, pedagogy, and preservation of Sanskrit literature. 

The application provides a deterministic baseline lexicon, a bidirectional Devanagari ⇄ IAST transliteration tool, a dedicated multilingual translation tool (Sanskrit → Hindi, Marathi, English), an interactive Sanskrit passage reader with word-level morphological inspection, and in-depth educational resources exploring computational linguistics and manuscript preservation.

---

## ✨ Key Features

- **📖 Digital Sanskrit Lexicon**: Search Sanskrit vocabulary by Devanagari, diacritic-insensitive IAST, or English meanings. Inspect root (*dhātu*), grammatical case (*vibhakti*), verbal tense (*lakāra*), Pāṇinian morphological decomposition (*prakṛti-pratyaya*), etymology, contextual literature citations, and parallel Hindi/Marathi meanings.
- **🔤 Phonetic Transliteration Engine**: Convert Devanagari script to IAST (International Alphabet of Sanskrit Transliteration, ISO 15919) and vice-versa, complete with a full Sanskrit phonological articulation map (*Sthāna & Prayatna*).
- **🌐 Multilingual Sanskrit Translation**: Translate Sanskrit words, phrases, and classical verses into **Hindi (हिन्दी)**, **Marathi (मराठी)**, and **English** with side-by-side comparative views and tokenized word glosses.
- **📜 Interactive Sanskrit Reader**: Read classical verses (such as the *Hitopadeśa*, *Bhagavad Gītā* 2.47, and *Taittirīya Upaniṣad* peace invocation), toggle translations between Hindi, Marathi, and English, select individual word tokens to inspect instant morphological breakdowns, and view reconstructed prose syntax (*Anvaya*).
- **🤖 Language Technology Insights**: Structured explanations of how digital dictionaries, transliteration standards, finite-state morphological parsers, and NLP translation pipelines power modern Indic language technologies.
- **🏛️ Digital Preservation Hub**: Comprehensive exploration of Sanskrit textual heritage (est. 30+ million manuscripts), archival digitization challenges, and long-term digital preservation strategies.
- **📱 Responsive & Accessible Design**: Built with Tailwind CSS, clean typography pairings for Devanagari and Latin text, keyboard navigation, and audio pronunciation synthesis.

---

## 🛠️ Technology Stack

- **Framework**: React / Next.js architecture with TypeScript
- **Styling**: Tailwind CSS with custom Devanagari typography
- **Icons**: Lucide React
- **Audio**: Web Speech API native synthesis
- **Data Layer**: Local, structured TypeScript lexical & translation datasets (zero backend latency)

---

## 📸 Screenshots & UI Preview

```text
+---------------------------------------------------------------------------------------------+
|  सं  Sanskrit Digital Reader   Dictionary  Convert  Translate  Reader  Tech  About  [Search]|
+---------------------------------------------------------------------------------------------+
|                                                                                             |
|                     Explore Sanskrit with Digital Language Technology                       |
|              Search words, explore translations, and discover preservation                  |
|                                                                                             |
|                [ 🔍 Enter a Sanskrit word, e.g. धर्मः                | Analyze ↵ ]          |
|                Examples: [धर्मः] [संस्कृतम्] [ज्ञानम्] [गच्छति] [रामः] [सत्यम्]              |
+---------------------------------------------------------------------------------------------+
|                                                                                             |
|  [ Translation Card: विद्या ददाति विनयं विनयाद् याति पात्रताम्। ]                           |
|  · Hindi:   विद्या विनय प्रदान करती है और विनय से मनुष्य योग्यता प्राप्त करता है।            |
|  · Marathi: विद्या विनय देते आणि विनयामुळे मनुष्य पात्रता प्राप्त करतो.                     |
|  · English: Knowledge gives humility, and through humility one attains worthiness.          |
+---------------------------------------------------------------------------------------------+
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

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

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the application.

---

## 📚 Documentation Index

| Document | Description |
| :--- | :--- |
| [**PROJECT_OVERVIEW.md**](./PROJECT_OVERVIEW.md) | High-level project objectives, educational mission, target audience, and scope. |
| [**FEATURES.md**](./FEATURES.md) | In-depth breakdown of all application features and capabilities. |
| [**INSTALLATION.md**](./INSTALLATION.md) | Setup instructions, environment requirements, and production build guides. |
| [**USAGE.md**](./USAGE.md) | Step-by-step user walkthroughs with examples and search tips. |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | System architecture, component hierarchy, and data flow diagrams. |
| [**DICTIONARY.md**](./DICTIONARY.md) | Lexical data model, search algorithms, and missing-entry handling. |
| [**TRANSLITERATION.md**](./TRANSLITERATION.md) | Phonotactic transliteration rules, ISO 15919 / IAST schemes, and phonetics. |
| [**TRANSLATION.md**](./TRANSLATION.md) | Multilingual translation engine (Sanskrit → Hindi, Marathi, English) and NLP scope. |
| [**READER.md**](./READER.md) | Interactive passage tokenization, *Anvaya* reconstruction, and metrical analysis. |
| [**LANGUAGE_TECHNOLOGY.md**](./LANGUAGE_TECHNOLOGY.md) | Educational guide on how digital tools support Sanskrit computational linguistics. |
| [**DIGITAL_PRESERVATION.md**](./DIGITAL_PRESERVATION.md) | Manuscript heritage, digitization challenges, TEI XML, and preservation ethics. |
| [**DATA_STRUCTURE.md**](./DATA_STRUCTURE.md) | TypeScript interface definitions, field schemas, and sample records. |
| [**CONTRIBUTING.md**](./CONTRIBUTING.md) | Contribution workflow for adding words, passages, or improving transliteration. |

---

## ⚖️ License & Attribution

This project is released under the **Apache-2.0 License**. Classical Sanskrit texts and examples are derived from public domain traditional literature (*Manusmṛti*, *Hitopadeśa*, *Bhagavad Gītā*, *Upaniṣads*).
