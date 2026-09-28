# Project Overview

## 🎯 Objectives

**Sanskrit Digital Reader** is designed to demonstrate how computational tools can facilitate the study, linguistic analysis, and long-term preservation of Sanskrit literature. 

The primary goals of the project are:
1. **Demystify Sanskrit Grammar**: Provide instant, accessible linguistic analysis for Sanskrit words, including root (*dhātu*), grammatical case (*vibhakti*), verbal tense (*lakāra*), and morphological decomposition (*prakṛti-pratyaya*).
2. **Promote Phonetic & Transliteration Literacy**: Demonstrate standardized Latin transliteration (IAST / ISO 15919) alongside traditional Devanagari script.
3. **Enhance Reading Comprehension**: Enable users to read classical verses interactively, clicking individual word tokens to reveal their contextual grammar, meaning, and syntactic role (*Anvaya*).
4. **Educate on Language Technology**: Clearly explain how computational lexicography, transliteration, morphological parsing, and Natural Language Processing (NLP) interconnect with traditional Sanskrit grammar (such as Pāṇini’s *Aṣṭādhyāyī*).
5. **Highlight Digital Preservation**: Raise awareness about the world's estimated 30+ million Sanskrit manuscripts, many of which face physical decay and require digital archiving.

---

## 🎓 Educational Purpose

Sanskrit is renowned for its mathematical precision and comprehensive grammatical tradition, established over two millennia ago by Pāṇini. However, beginners and modern readers often encounter significant barriers:
- **Complex Agglutination & Sandhi**: Words are frequently fused phonetically into continuous compounds.
- **Rich Inflectional Paradigms**: A single noun stem can have 24 distinct inflections (8 cases × 3 numbers), and a verbal root can produce dozens of forms across 10 tenses/moods (*lakāras*).
- **Script Familiarity**: International students and interdisciplinary researchers may not be fluent in Devanagari script.

Sanskrit Digital Reader bridges these gaps by providing an interactive learning environment that translates complex linguistic structures into transparent, human-readable visual representations.

---

## 👥 Target Users

- **Sanskrit Students & Beginners**: Learners seeking a digital companion to look up words, understand grammatical cases, and verify pronunciation.
- **Teachers & Educators**: Instructors looking for clean visual aids to explain morphological decomposition and verse analysis in classroom settings.
- **Linguists & NLP Researchers**: Computational linguists interested in how formal Pāṇinian rules map to digital language pipelines, tokenization, and transliteration standards.
- **Digital Humanities Enthusiasts**: Individuals interested in manuscript conservation, open-access archives, and the digital preservation of ancient literature.

---

## 💡 Problems Addressed

| Problem | Digital Solution in Sanskrit Digital Reader |
| :--- | :--- |
| **Obscure Grammatical Forms** | Structured breakdown of nominal/verbal forms with clear case and tense labels. |
| **Difficult Compound Resolution** | Word-by-word tokenization and Sandhi splitting in the reader module. |
| **Phonetic Ambiguity** | Live bidirectional conversion between Devanagari and standardized IAST diacritics. |
| **Isolated Vocabulary Learning** | Each lexical entry is paired with authentic literary examples (*Gītā*, *Subhāṣita*, *Upaniṣad*). |
| **Lack of Preservation Awareness** | Dedicated educational modules detailing manuscript challenges and archival solutions. |

---

## 🔬 How the Application Demonstrates Language Technology

1. **Digital Lexicography**: Demonstrates how structured JSON/TypeScript knowledge graphs can store and query headwords, roots, semantic classes, and grammatical parameters.
2. **Deterministic Transliteration**: Implements a client-side phonotactic mapping engine to convert between Devanagari script and IAST without external API latency.
3. **Interactive Syntactic Reading**: Transforms raw classical text into interactive tokens that provide on-demand grammatical annotations and prose order (*Anvaya*).
4. **Phonetic Articulation Taxonomy**: Illustrates the classical Pāṇinian categorization of phonemes by physiological place of articulation (*Sthāna*).

---

## ⚠️ Scope and Limitations

To maintain transparency and pedagogical integrity, this application explicitly acknowledges its scope:

- **Baseline Educational Lexicon**: The application uses a local curated dataset of representative Sanskrit entries. It is not an exhaustive replacement for multi-volume historical dictionaries like Monier-Williams or Apte.
- **Deterministic Rule-Based Transliteration**: The transliteration tool handles standard classical Sanskrit phonotactics. It is an educational demonstration rather than an exhaustive Vedic accentuation engine.
- **Rule-Based Reader Annotation**: The reader utilizes pre-tokenized, curated classical passages to ensure absolute linguistic accuracy rather than relying on experimental black-box AI parsers.
