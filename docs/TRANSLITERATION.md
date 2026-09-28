# Transliteration Engine & Sanskrit Phonology

The **Sanskrit Digital Reader** transliteration module implements a deterministic, bidirectional converter between the native **Devanagari** script and the **IAST (International Alphabet of Sanskrit Transliteration)** standard (ISO 15919).

---

## 🎯 Purpose of Transliteration

Sanskrit literature was historically written across multiple regional scripts (including *Devanagari*, *Grantha*, *Śāradā*, *Newar*, *Bengali*, and *Tigalari*). In computational linguistics and international scholarship:
- **IAST** provides a standardized, lossless Romanization using diacritical marks.
- **Unambiguous Phonology**: Unlike popular English phonetic spellings (e.g. "Krishna"), IAST (`kṛṣṇa`) distinguishes retroflex vowels (`ṛ`), retroflex consonants (`ṣ`, `ṇ`), and vowel lengths (`ā`, `ī`, `ū`).
- **Computational Processing**: Romanized transliterations facilitate ASCII-friendly search, tokenization, and morphological parsing across non-Indic software environments.

---

## 🔠 Character Mapping Tables

### 1. Vowels (*Svarāḥ* - स्वराः)

| Independent (Initial) | Dependent (*Mātrā*) | IAST | Phonetic Classification |
| :---: | :---: | :---: | :--- |
| **अ** | *(inherent)* | `a` | Short guttural |
| **आ** | **ा** | `ā` | Long guttural |
| **इ** | **ि** | `i` | Short palatal |
| **ई** | **ी** | `ī` | Long palatal |
| **उ** | **ु** | `u` | Short labial |
| **ऊ** | **ू** | `ū` | Long labial |
| **ऋ** | **ृ** | `ṛ` | Vocalic retroflex |
| **ॠ** | **ॄ** | `ṝ` | Long vocalic retroflex |
| **ऌ** | **ॢ** | `ḷ` | Vocalic dental |
| **ए** | **े** | `e` | Diphthong (palatal-guttural) |
| **ऐ** | **ै** | `ai` | Long diphthong |
| **ओ** | **ो** | `o` | Diphthong (labial-guttural) |
| **औ** | **ौ** | `au` | Long diphthong |

---

### 2. Consonants (*Vyañjanāni* - व्यञ्जनानि)

| Place of Articulation (*Sthāna*) | Unvoiced Stop | Voiced Stop | Nasal | Semivowel / Sibilant |
| :--- | :---: | :---: | :---: | :---: |
| **Guttural (*Kaṇṭhya*)** | क (`ka`), ख (`kha`) | ग (`ga`), घ (`gha`) | ङ (`ṅa`) | ह (`ha`) |
| **Palatal (*Tālavya*)** | च (`ca`), छ (`cha`) | ज (`ja`), झ (`jha`) | ञ (`ña`) | य (`ya`), श (`śa`) |
| **Retroflex (*Mūrdhanya*)** | ट (`ṭa`), ठ (`ṭha`) | ड (`ḍa`), ढ (`ḍha`) | ण (`ṇa`) | र (`ra`), ष (`ṣa`) |
| **Dental (*Dantya*)** | त (`ta`), थ (`tha`) | द (`da`), ध (`dha`) | न (`na`) | ल (`la`), स (`sa`) |
| **Labial (*Oṣṭhya*)** | प (`pa`), फ (`pha`) | ब (`ba`), भ (`bha`) | म (`ma`) | व (`va`) |

---

### 3. Special Diacritics & Modifiers

| Symbol | Devanagari | IAST | Description |
| :---: | :---: | :---: | :--- |
| **Anusvāra** | **ं** | `ṃ` | Pure nasal modifier following a vowel (e.g. `ज्ञानम्` → `jñānam`) |
| **Visarga** | **ः** | `ḥ` | Unvoiced post-vocalic aspiration (e.g. `धर्मः` → `dharmaḥ`) |
| **Virāma / Halanta** | **्** | *(suppresses inherent 'a')* | Removes the inherent short vowel 'a' from a consonant (e.g. `क्` → `k`) |
| **Avagraha** | **ऽ** | `'` | Marks elision of initial 'a' after 'e' or 'o' due to Sandhi (e.g. `सङ्गोऽस्तु` → `saṅgo'stu`) |
| **Pūrṇavirāma** | **।** | `.` | Single verse boundary marker / full stop |
| **Dīrghavirāma** | **॥** | `..` | Double verse or section boundary marker |

---

## ⚡ Algorithm Implementation Details

### Devanagari → IAST (`devanagariToIast`)
1. Iterates character-by-character through the Devanagari string.
2. If a consonant is encountered, the lookahead character is inspected:
   - If followed by a **Virāma** (`्`), the base consonant is output without any trailing vowel (`k`).
   - If followed by a **Dependent Vowel Sign** (`ा`, `ि`, etc.), the corresponding vowel is appended (`kā`, `ki`).
   - If followed by another consonant or whitespace, the default inherent `a` is appended (`ka`).
3. Handles multi-character conjuncts (`क्ष` → `kṣ`, `ज्ञ` → `jñ`).

### IAST → Devanagari (`iastToDevanagari`)
1. Tokenizes multi-character sequences (`kṣ`, `jñ`, `ṭh`, `dh`, `ai`, `au`, `ṛ`).
2. Matches independent vowels when appearing at the start of words or after whitespace.
3. Automatically attaches dependent *mātrās* when vowels follow consonants.

---

## ⚠️ Limitations of the Demo Engine

- **Scope**: This is an educational, deterministic client-side implementation designed for standard classical Sanskrit prose and poetry.
- **Vedic Accents**: It does not currently parse Vedic pitch accents (*Udātta*, *Anudātta*, *Svarita*).
- **Complex Rare Ligatures**: Rare historical epigraphical ligatures are mapped to their standardized modern Devanagari equivalents.
