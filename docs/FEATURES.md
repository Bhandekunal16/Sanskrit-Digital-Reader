# Features & Capabilities

**Sanskrit Vani** is structured into eight integrated functional modules, delivering a comprehensive educational experience.

---

## 1. 📖 Digital Sanskrit Lexicon & Word Analysis (`/dictionary`)

The lexicon module provides deep grammatical, morphological, and contextual information for Sanskrit terms.

### Key Capabilities:
- **Multi-Modal Search**:
  - **Devanagari Search**: Search directly in native script (e.g., `धर्मः`, `ज्ञानम्`).
  - **IAST Diacritic Search**: Search with diacritics (e.g., `dharmaḥ`, `jñānam`).
  - **Diacritic-Insensitive Search**: Search using standard Latin characters (e.g., `dharma`, `jnana`, `samskrtam`).
  - **Semantic Meaning Search**: Search by English keywords (e.g., `truth`, `knowledge`, `duty`, `peace`).
- **Instant Auto-Suggest**: Real-time dropdown suggestions displaying headword, IAST, part of speech, and primary meaning.
- **Fuzzy Fallback & Suggestions**: If an entered term is not present in the baseline lexicon, the engine calculates Levenshtein string distances and recommends the closest valid entries.
- **Multilingual Meaning Card**:
  - **Headword & IAST**: Rendered in high-contrast typography.
  - **Audio Pronunciation**: Text-to-speech pronunciation trigger using native speech synthesis.
  - **Multi-lingual Meanings**: Displays English, Hindi (हिन्दी), and Marathi (मराठी) definitions side-by-side.
  - **Root (*Dhātu*) Breakdown**: Displays root in Devanagari and IAST, English root meaning, and Pāṇinian *Gaṇa* (e.g., *Bhvādi*, *Kryādi*).
  - **Grammatical Categorization**: Gender (*Liṅga*), Number (*Vacana*), Case (*Vibhakti*), or Verbal Tense (*Lakāra*).
  - **Pāṇinian Morphological Decomposition**: Step-by-step *prakṛti-pratyaya* derivation (e.g., `धृ + मन्/घञ् → धर्म + सुँ → धर्मः`).
  - **Etymological Cognates**: Historical Indo-European linguistic roots and derivations.
  - **Literary Context & Citation**: Real verses from the *Manusmṛti*, *Bhagavad Gītā*, *Hitopadeśa*, or *Upaniṣads* with IAST romanization and English translations.
  - **Related Derivatives**: Interactive buttons to inspect cognate words (e.g., `धार्मिक`, `अधर्म`, `धारणा`).

---

## 2. 🔊 Vowels & Consonants (Varṇamālā: स्वर एवं व्यञ्जन) (`/vowels-consonants`)

A dedicated phonological and acoustic suite for mastering the 52 characters of the Sanskrit alphabet.

### Key Capabilities:
- **Complete Varṇamālā Explorer**: Browse all 14 vowels (*Svaras*), 33 consonants (*Vyañjanas*), and classical conjuncts/Vedic characters.
- **Dual-Engine Audio Pronunciation**:
  - Web Audio API acoustic formant synthesizer for instantaneous zero-latency human vocal tract resonance ($F_1, F_2, F_3$).
  - Web Speech API Indic speech synthesis for native cadence.
- **Guided Autoplay Tour (स्वर-गान / व्यञ्जन-गान)**: Auto-advancing auditory sequence with speed toggles (`0.5x`, `0.75x`, `1.0x`).
- **Watch: Vocal Tract Articulation Anatomy (*स्थान-दर्शन*)**:
  - Anatomical breakdown of the 8 traditional points of articulation: *Kaṇṭha* (Throat), *Tālu* (Hard Palate), *Mūrdhā* (Dome of Palate), *Danta* (Teeth), *Oṣṭha* (Lips), *Nāsikā* (Nasal Cavity), *Kaṇṭhatālu*, *Kaṇṭhoṣṭha*, and *Dantoṣṭha*.
- **Akṣara Syllable Construction**: Visual formula illustrating how pure halanta consonants combine with vocalic mātrās (e.g., `क्` + `ा` = `का`).
- **Bāraha-khaḍī Studio (बारहखड़ी)**: Interactive 13-mātrā combination generator for any selected consonant.
- **Pāṇinian Śikṣā Verses**: Traditional recitation chants (*अकुहविसर्जनीयानां कण्ठः*, etc.) with audio and translations.
- **Ear Training Listening Quiz**: Audio discrimination practice distinguishing subtle sounds (retroflex vs dental, aspirates, sibilants).

---

## 3. 🔤 Bidirectional Transliteration Tool (`/transliteration`)

A dedicated phonological converter supporting both Devanagari script and the International Alphabet of Sanskrit Transliteration (IAST).

### Key Capabilities:
- **Devanagari → IAST**: Deterministic rule-based conversion respecting independent vowels, dependent vowel signs (*mātrās*), inherent 'a' suppression via *halanta/virāma* (्), *anusvāra* (ं → ṃ), *visarga* (ः → ḥ), and *avagraha* (ऽ → ').
- **IAST → Devanagari**: Reverse mapping converting romanized strings with diacritics into syntactically valid Devanagari ligatures and conjuncts.
- **Benchmark Suite**: Quick-fill buttons for standard phonetic test cases (`धर्मः`, `कृष्णः`, `ज्ञानम्`, `संस्कृतम्`, `शान्तिः`).
- **Clipboard Integration**: One-click copying with active confirmation state.

---

## 4. 🌐 Sanskrit Multilingual Translation Tool (`/translation`)

A dedicated translation interface providing cross-lingual translations between **Sanskrit, Hindi, Marathi, and English**.

### Key Capabilities:
- **Target Language Selector**: Instant switching between `Hindi (हिन्दी)`, `Marathi (मराठी)`, and `English`.
- **Representative Sentence Suite**: Quick-fill buttons for major classical Sanskrit maxims (`विद्या ददाति विनयं...`, `सत्यमेव जयते।`, `धर्मो रक्षति रक्षितः।`, `वसुधैव कुटुम्बकम्।`).
- **Side-by-Side Multi-Lingual Comparison**: Toggleable comparative view displaying Hindi, Marathi, and English translations simultaneously.
- **Word-Level Lexical Gloss**: Automated tokenization breakdown table showing individual word meanings across all three languages.
- **One-Click Clipboard & Audio**: Copy any translation and listen to native speech synthesis recitation.

---

## 5. 📜 Interactive Sanskrit Reader (`/reader`)

An interactive reader that transforms classical Sanskrit verses into annotated, clickable learning canvases.

### Key Capabilities:
- **Curated Classical Passages**:
  - *Hitopadeśa / Subhāṣita*: "विद्या ददाति विनयं..." (The Chain of Virtue and Learning).
  - *Bhagavad Gītā 2.47*: "कर्मण्येवाधिकारस्ते..." (The Doctrine of Selfless Action).
  - *Taittirīya Upaniṣad*: "ॐ सह नाववतु..." (Peace Invocation for Teacher and Disciple).
- **Multilingual Language Switcher**: Switch the passage translation between Hindi, Marathi, and English dynamically.
- **Interactive Word Tokenization**: Click any individual word token to trigger a dedicated inspection panel.
- **Token Analysis Panel**: Displays the selected word's Devanagari form, IAST romanization, contextual meaning, root (*dhātu*), grammatical inflection, and Sandhi resolution (*padaccheda*).
- **Prose Reconstruction (*Anvaya*)**: Toggleable view displaying traditional grammatical prose word order.
- **Full Verse Audio Recitation**: Trigger audio recitation of the entire passage.

---

## 6. 🎓 Sanskrit Quiz & Assessment (`/quiz`)

A comprehensive assessment engine designed to test, practice, and solidify Sanskrit understanding.

### Key Capabilities:
- **8 Categories + Mixed Mode**: Vocabulary, Grammar, Sandhi, Samāsa, Transliteration, Phonology, Translation, Reading.
- **3 Difficulty Tiers**: Beginner (प्रारम्भिक), Intermediate (मध्यम), Advanced (प्रौढ).
- **Configurable Length**: Select 5, 10, 15, or 20 questions.
- **Multiple Question Formats**: Single Choice, Multiple Choice (select all correct), and True/False.
- **Hint System**: Toggleable reasoning hints without spoiling the answer.
- **Immediate Grammatical Feedback**: In-depth explanations displayed after submission.
- **Performance Evaluation**: Accuracy scoring, tier badges, and local attempt history tracking.

---

## 7. 🤖 Language Technology Educational Section (`/technology`)

A comprehensive academic overview explaining how digital tools advance Sanskrit computational linguistics.

### Key Topics:
- **Digital Lexicons & Dictionaries**: Structured databases, Monier-Williams, Apte, Cologne Digital Sanskrit Project.
- **Phonetic Encoding**: Unicode (U+0900–U+097F), IAST, ISO 15919, SLP1, ITRANS.
- **Morphological Analyzers**: Pāṇini’s 3,959 sūtras as formal generative grammar, finite-state transducers (FSTs).
- **Machine Translation**: Tokenization, Sandhi splitting, Kāraka dependency parsing.
- **The 5-Stage Digital Pipeline**: `Sanskrit Text → Word Selection → Digital Analysis → Meaning / Grammar → Human Understanding`.

---

## 8. 🏛️ Digital Preservation & Manuscript Heritage (`/about`)

An informative archival section highlighting the scale and urgency of Sanskrit digital preservation.

### Key Topics:
- **Scale of Heritage**: Overview of the estimated 30+ million extant manuscripts.
- **Preservation Vulnerabilities**: Physical decay of palm leaves, birch bark (*Bhūrjapatra*), and paper manuscripts.
- **Democratization of Knowledge**: Overcoming geographical barriers through open-access digital repositories.
- **TEI XML Standards**: Encoding scholarly apparatus and digital critical editions.
