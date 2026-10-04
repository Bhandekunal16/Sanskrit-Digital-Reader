# Sanskrit Quiz & Assessment System (संस्कृत-ज्ञान-परीक्षा)

The **Sanskrit Quiz & Assessment** module at `/quiz` provides an interactive, client-side testing engine to assess and reinforce Sanskrit linguistic knowledge across multiple domains.

---

## 🎯 1. Assessment Categories

The quiz system is powered by the single-source-of-truth dataset in `src/data/quizzes.ts` and supports 8 distinct linguistic categories plus a comprehensive **Mixed** mode:

| Category Key | Category Name (Sanskrit) | Focus & Linguistic Scope |
| :--- | :--- | :--- |
| `vocabulary` | **शब्दार्थ (Vocabulary)** | Sanskrit word meanings, roots (*dhātu*), and English/Hindi/Marathi glosses. |
| `grammar` | **व्याकरण (Grammar)** | Declensions (*vibhakti*), genders (*liṅga*), numbers (*vacana*), verb tenses (*lakāra*), and persons (*puruṣa*). |
| `sandhi` | **सन्धि (Sandhi / Euphony)** | Vowel sandhi (*svara-sandhi*), consonant sandhi (*vyañjana-sandhi*), and visarga rules. |
| `samasa` | **समास (Compounds)** | Compound classification: *Tatpuruṣa*, *Karmadhāraya*, *Dvandva*, *Bahuvrīhi*, and *Avyayībhāva*. |
| `transliteration` | **लिप्यन्तरण (Transliteration)** | Bidirectional Devanagari ⇄ IAST character conversions and diacritic accuracy. |
| `phonology` | **उच्चारण (Phonetics & Sthāna)** | Articulation places (*Sthāna*), active organs (*Karaṇa*), and Pāṇinian Śikṣā rules. |
| `translation` | **अनुवाद (Translation)** | Sentence comprehension, multilingual equivalents, and syntactic glosses. |
| `reading` | **पठन (Reading & Literature)** | Classical verse comprehension based on the *Hitopadeśa*, *Gītā*, and *Upaniṣads*. |
| `mixed` | **मिश्रित (Comprehensive Mixed)** | Randomized composite assessment covering all linguistic areas. |

---

## 📊 2. Difficulty Tiers & Question Length

### Difficulty Levels:
- **Beginner (प्रारम्भिक)**: Fundamental vocabulary, basic nominative/accusative cases, and simple vowel sandhi.
- **Intermediate (मध्यम)**: Complex verb forms (*lakāras*), compound classifications, and phonetic sūtras.
- **Advanced (प्रौढ)**: Intricate Pāṇinian derivations, rare declensions, and verse syntax (*Anvaya*).

### Question Counts:
Users can select between **5, 10, 15, or 20 questions** per quiz session.

---

## 🧩 3. Question Formats

1. **Single Choice (`single`)**: Exactly one correct answer option.
2. **Multiple Choice (`multiple`)**: Multiple correct answer choices (with clear "Select all correct answers" instruction and requirement for complete selection for full credit).
3. **True / False (`true-false`)**: Conceptual validation of Sanskrit grammar and phonetic principles.

---

## 💡 4. Hint System & Explanations

- **Hidden Hints**: Questions feature an optional **Show Hint (सङ्केतं पश्यतु)** toggle that provides scholarly reasoning without immediately giving away the answer.
- **Instant Explanations**: Immediately after submitting an answer, the interface locks selection, color-codes correct/incorrect options, and reveals an in-depth grammatical explanation grounded in Pāṇinian tradition.

---

## 📈 5. Scoring & Performance Feedback

Calculated as:
$$\text{Accuracy (\%)} = \left( \frac{\text{Correct Answers}}{\text{Total Questions}} \right) \times 100$$

### Feedback Tiers:
- **90–100% (उत्कृष्टम् - Outstanding)**: *"Excellent Sanskrit knowledge! Your foundation in grammar and vocabulary is exceptional."*
- **75–89% (अति उत्तमम् - Very Good)**: *"Very good! Your Sanskrit foundation is strong. A bit more practice will yield mastery."*
- **50–74% (उत्तमम् - Good Progress)**: *"Good effort! You have a solid grasp of core principles. Review the explanations to build deeper confidence."*
- **0–49% (अभ्यासं कुरु - Keep Learning)**: *"Keep practicing! Consistent study of roots, cases, and phonetics will steadily improve your accuracy."*

---

## 💾 6. Client-Side Attempt Tracking

Located in `src/lib/quiz.ts`, the quiz system locally tracks historical quiz attempts via `localStorage` (storing timestamp, category, difficulty, score, percentage, and date) without requiring external servers or accounts.
