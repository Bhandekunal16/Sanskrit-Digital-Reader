# Features & Capabilities

**Sanskrit Digital Reader** is structured into five integrated functional modules, delivering a comprehensive educational experience.

---

## 1. 📖 Digital Sanskrit Lexicon & Word Analysis

The lexicon module provides deep grammatical, morphological, and contextual information for Sanskrit terms.

### Key Capabilities:
- **Multi-Modal Search**:
  - **Devanagari Search**: Search directly in native script (e.g., `धर्मः`, `ज्ञानम्`).
  - **IAST Diacritic Search**: Search with diacritics (e.g., `dharmaḥ`, `jñānam`).
  - **Diacritic-Insensitive Search**: Search using standard Latin characters (e.g., `dharma`, `jnana`, `samskrtam`).
  - **Semantic Meaning Search**: Search by English keywords (e.g., `truth`, `knowledge`, `duty`, `peace`).
- **Instant Auto-Suggest**: Real-time dropdown suggestions displaying headword, IAST, part of speech, and primary meaning.
- **Fuzzy Fallback & Suggestions**: If an entered term is not present in the baseline lexicon, the engine calculates Levenshtein string distances and recommends the closest valid entries.
- **Detailed Morphological Card**:
  - **Headword & IAST**: Rendered in high-contrast typography.
  - **Audio Pronunciation**: Text-to-speech pronunciation trigger using native speech synthesis.
  - **Primary Meaning**: Clear, comprehensive definitions covering philosophical and daily usage.
  - **Root (*Dhātu*) Breakdown**: Displays root in Devanagari and IAST, English root meaning, and Pāṇinian *Gaṇa* (e.g., *Bhvādi*, *Kryādi*).
  - **Grammatical Categorization**: Gender (*Liṅga*), Number (*Vacana*), Case (*Vibhakti*), or Verbal Tense (*Lakāra*).
  - **Pāṇinian Morphological Decomposition**: Step-by-step *prakṛti-pratyaya* derivation (e.g., `धृ + मन्/घञ् → धर्म + सुँ → धर्मः`).
  - **Etymological Cognates**: Historical Indo-European linguistic roots and derivations.
  - **Literary Context & Citation**: Real verses from the *Manusmṛti*, *Bhagavad Gītā*, *Hitopadeśa*, or *Upaniṣads* with IAST romanization and English translations.
  - **Related Derivatives**: Interactive buttons to inspect cognate words (e.g., `धार्मिक`, `अधर्म`, `धारणा`).

---

## 2. 🔤 Bidirectional Transliteration Tool

A dedicated phonological converter supporting both Devanagari script and the International Alphabet of Sanskrit Transliteration (IAST).

### Key Capabilities:
- **Devanagari → IAST**: Deterministic rule-based conversion respecting independent vowels, dependent vowel signs (*mātrās*), inherent 'a' suppression via *halanta/virāma* (्), *anusvāra* (ं → ṃ), *visarga* (ः → ḥ), and *avagraha* (ऽ → ').
- **IAST → Devanagari**: Reverse mapping converting romanized strings with diacritics into syntactically valid Devanagari ligatures and conjuncts.
- **One-Click Benchmark Suite**: Quick-fill buttons for standard phonetic test cases:
  - `धर्मः` → `dharmaḥ`
  - `रामः` → `rāmaḥ`
  - `कृष्णः` → `kṛṣṇaḥ`
  - `योगः` → `yogaḥ`
  - `ज्ञानम्` → `jñānam`
  - `संस्कृतम्` → `saṃskṛtam`
  - `विद्या` → `vidyā`
  - `शान्तिः` → `śāntiḥ`
- **Clipboard Integration**: One-click copying with active confirmation state.
- **Sanskrit Phonetic Articulation Map (*Sthāna-Taxonomy*)**: Interactive chart categorizing phonemes into Guttural (*Kaṇṭhya*), Palatal (*Tālavya*), Retroflex (*Mūrdhanya*), Dental (*Dantya*), and Labial (*Oṣṭhya*).

---

## 3. 📜 Interactive Sanskrit Reader

An interactive reader that transforms classical Sanskrit verses into annotated, clickable learning canvases.

### Key Capabilities:
- **Curated Classical Passages**:
  - *Hitopadeśa / Subhāṣita*: "विद्या ददाति विनयं..." (The Chain of Virtue and Learning).
  - *Bhagavad Gītā 2.47*: "कर्मण्येवाधिकारस्ते..." (The Doctrine of Selfless Action).
  - *Taittirīya Upaniṣad*: "ॐ सह नाववतु..." (Peace Invocation for Teacher and Disciple).
- **Interactive Word Tokenization**: Click any individual word token to trigger a dedicated side inspection panel.
- **Active Visual Focus**: Highlighted word tokens with subtle focus rings.
- **Token Analysis Panel**: Displays the selected word's Devanagari form, IAST romanization, contextual meaning, root (*dhātu*), grammatical inflection, and Sandhi resolution (*padaccheda*).
- **English Translation**: Complete literary translation of the full verse.
- **Prose Reconstruction (*Anvaya*)**: Toggleable view displaying the traditional grammatical prose word order.
- **Full Verse Audio Recitation**: Trigger audio recitation of the entire passage.

---

## 4. 🤖 Language Technology Educational Section

A comprehensive academic overview explaining how digital tools advance Sanskrit computational linguistics.

### Key Topics:
1. **Digital Lexicons & Dictionaries**: Structured lexical databases, Monier-Williams, Apte, and the Cologne Digital Sanskrit Project.
2. **Phonetic Transliteration & Encoding**: Unicode standard (0900–097F), IAST, ISO 15919, SLP1, and ITRANS.
3. **Morphological Analyzers & Rule Engines**: Pāṇini’s 3,959 algebraic sūtras as the world's first formal generative grammar, finite-state transducers (FSTs), and nominal/verbal generators.
4. **Digital Preservation & Manuscript Informatics**: TEI XML encoding, optical character recognition (OCR) for palm-leaf manuscripts, and open corpuses.
5. **NLP & Computational Linguistics**: Sandhi splitting, compound deconstruction (*Samāsa vigraha*), dependency parsing (*Kāraka* theory), and machine translation.
6. **The 5-Stage Digital Pipeline**: Visual workflow mapping: `Sanskrit Text → Word Selection → Digital Analysis → Meaning / Grammar → Human Understanding`.

---

## 5. 🏛️ Digital Preservation & Manuscript Heritage

An informative archival section highlighting the scale and urgency of Sanskrit digital preservation.

### Key Topics:
- **Scale of Heritage**: Overview of the estimated 30+ million extant manuscripts.
- **Preservation Vulnerabilities**: Physical decay of palm leaves, birch bark (*Bhūrjapatra*), and acid-paper manuscripts in tropical climates.
- **Democratization of Knowledge**: Overcoming geographical restrictions through open-access digital repositories.
- **Computational Graph Integration**: Linking philosophical, astronomical, and medical treatises via standardized semantic metadata.

---

## 6. 🎨 User Interface & Accessibility

- **Curatorial Paper Palette**: Warm archival colors (`#FBF9F5`, `#FAF7F2`, `#8C4A2F`, `#2C241E`) designed to evoke parchment and scholarly libraries.
- **Zero-Pill Typography Discipline**: Clean, unboxed metadata separated by typographic dots (`·`) and slashes.
- **Responsive Layout**: Fluid experience across desktop, tablet, and mobile devices.
- **Keyboard Friendly**: Full keyboard navigation across search inputs and reader controls.
