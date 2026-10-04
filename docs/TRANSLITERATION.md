# Transliteration Engine & Sanskrit Phonology

The **Sanskrit Vani** transliteration module at `/transliteration` implements a deterministic, bidirectional converter between the native **Devanagari** script and the **IAST (International Alphabet of Sanskrit Transliteration)** standard (ISO 15919).

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

## ⚡ Real-Time Transliteration Algorithm

The algorithm in `src/lib/transliteration.ts` traverses the input string using deterministic regular expressions:
1. Translates multi-character consonants (such as `kh`, `gh`, `ch`, `jh`, `ṭh`, `ḍh`, `th`, `dh`, `ph`, `bh`) before single plosives.
2. Manages vowel *mātrās* when preceded by consonants, and independent initial vowels when at word start or after other vowels.
3. Automatically suppresses inherent short `a` when a virāma (्) is present.
