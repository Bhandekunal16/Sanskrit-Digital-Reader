import { SANSKRIT_DICTIONARY } from './sanskritDictionary';
import { SANSKRIT_PHONEMES } from './phonology';
import { SANSKRIT_PASSAGES } from './passages';
import { SANSKRIT_TRANSLATIONS } from './translations';

export type QuizCategory =
  | 'vocabulary'
  | 'grammar'
  | 'sandhi'
  | 'samasa'
  | 'transliteration'
  | 'phonology'
  | 'translation'
  | 'reading'
  | 'mixed';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuestionType = 'single' | 'multiple' | 'true-false';

export interface QuizOption {
  id: string;
  text: string;
  devanagari?: string;
  iast?: string;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  questionDevanagari?: string;
  questionContext?: string;
  type: QuestionType;
  options: QuizOption[];
  correctAnswers: string[]; // array of option IDs
  explanation: string;
  explanationDevanagari?: string;
  hint?: string;
  sourceReference?: string;
}

export interface QuizCategoryInfo {
  id: QuizCategory;
  name: string;
  devanagari: string;
  description: string;
  iconName: string;
}

export const QUIZ_CATEGORIES: QuizCategoryInfo[] = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    devanagari: 'शब्दार्थः',
    description: 'Word meanings, nominal stems, verbal roots, and multilingual definitions.',
    iconName: 'BookMarked'
  },
  {
    id: 'grammar',
    name: 'Grammar & Morphology',
    devanagari: 'व्याकरणम्',
    description: 'Vibhakti (cases), Liṅga (gender), Vacana (number), and Lakāra (tense/mood).',
    iconName: 'Layers'
  },
  {
    id: 'sandhi',
    name: 'Sandhi Rules',
    devanagari: 'सन्धि-विचारः',
    description: 'Svara (vowel), Vyañjana (consonant), and Visarga junction splitting and joining.',
    iconName: 'Splits'
  },
  {
    id: 'samasa',
    name: 'Samāsa (Compounds)',
    devanagari: 'समास-परिचयः',
    description: 'Tatpuruṣa, Karmadhāraya, Dvandva, Bahuvrīhi, and Avyayībhāva identification.',
    iconName: 'Network'
  },
  {
    id: 'transliteration',
    name: 'Transliteration',
    devanagari: 'लिप्यन्तरणम्',
    description: 'Lossless script conversion between Devanagari, IAST, and phonetic diacritics.',
    iconName: 'ArrowRightLeft'
  },
  {
    id: 'phonology',
    name: 'Phonology (Śikṣā)',
    devanagari: 'उच्चारण-स्थानम्',
    description: 'Sthāna (place of articulation), Prayatna, Svara vowels, and Sparśa consonants.',
    iconName: 'Volume2'
  },
  {
    id: 'translation',
    name: 'Translation & Comprehension',
    devanagari: 'अनुवादः',
    description: 'Sentence translation across Sanskrit, Hindi, Marathi, and English.',
    iconName: 'Globe'
  },
  {
    id: 'reading',
    name: 'Passage Reading',
    devanagari: 'पठन-बोधनम्',
    description: 'Classical verse comprehension from Hitopadeśa, Gītā, and Upaniṣads.',
    iconName: 'ScrollText'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // 1. VOCABULARY (शब्दार्थः)
  // ==========================================
  {
    id: 'vocab-01',
    category: 'vocabulary',
    difficulty: 'beginner',
    question: 'What is the primary English meaning of the Sanskrit word "धर्मः" (dharmaḥ)?',
    questionDevanagari: 'धर्मः',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Righteousness, duty, moral order, intrinsic nature' },
      { id: 'opt-b', text: 'Wealth and financial prosperity' },
      { id: 'opt-c', text: 'Physical strength and valor' },
      { id: 'opt-d', text: 'Illusion and worldly ignorance' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'धर्मः (from root धृ - to sustain/uphold) signifies cosmic order, righteousness, inherent virtue, and duty.',
    hint: 'Think of the root "dhṛ" which means to hold, sustain, or support.'
  },
  {
    id: 'vocab-02',
    category: 'vocabulary',
    difficulty: 'beginner',
    question: 'Which of the following is the meaning of "सत्यम्" (satyam)?',
    questionDevanagari: 'सत्यम्',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Truth, reality, unconditioned fact' },
      { id: 'opt-b', text: 'Desire and longing' },
      { id: 'opt-c', text: 'Action and consequence' },
      { id: 'opt-d', text: 'Peace and tranquility' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'सत्यम् (from सत् - being/existence) denotes truth, reality, and unalterable truth.',
    hint: 'Related to "Sat" (being, existence).'
  },
  {
    id: 'vocab-03',
    category: 'vocabulary',
    difficulty: 'intermediate',
    question: 'Select ALL synonyms for "जलम्" (water / jalam) in classical Sanskrit lexicon:',
    questionDevanagari: 'जलम् (पर्यायवाचिनः शब्दाः)',
    type: 'multiple',
    options: [
      { id: 'opt-a', text: 'तोयम् (toyam)' },
      { id: 'opt-b', text: 'अम्बु (ambu)' },
      { id: 'opt-c', text: 'वारि (vāri)' },
      { id: 'opt-d', text: 'अनलः (analaḥ)' }
    ],
    correctAnswers: ['opt-a', 'opt-b', 'opt-c'],
    explanation: 'तोयम्, अम्बु, and वारि are traditional synonyms for water (जलम्) in Amarakośa. अनलः means fire (अग्निः).',
    hint: 'Three options mean water; one means fire.'
  },
  {
    id: 'vocab-04',
    category: 'vocabulary',
    difficulty: 'intermediate',
    question: 'What is the verbal root (धातु) of the word "विद्या" (vidyā)?',
    questionDevanagari: 'विद्यायाः मूलधातुः कः?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'विद् (vid - to know, understand)' },
      { id: 'opt-b', text: 'दा (dā - to give)' },
      { id: 'opt-c', text: 'दृश् (dṛś - to see)' },
      { id: 'opt-d', text: 'भू (bhū - to become)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'विद्या is derived from root विद् (vid - to know) with the feminine suffix ष्टाप्.',
    hint: 'The root is shared with the word "Veda" (वेद).'
  },
  {
    id: 'vocab-05',
    category: 'vocabulary',
    difficulty: 'advanced',
    question: 'True or False: The word "अहिंसा" (ahiṃsā) is formed with the privative prefix "अञ्/अ" (nañ) preceding "हिंसा" (injury/violence).',
    questionDevanagari: 'अहिंसा इति नञ्-समासयुक्तं पदम् अस्ति।',
    type: 'true-false',
    options: [
      { id: 'opt-t', text: 'True' },
      { id: 'opt-f', text: 'False' }
    ],
    correctAnswers: ['opt-t'],
    explanation: 'Correct. न हिंसा इति अहिंसा — formed by negative prefix (nañ-tatpuruṣa) signifying non-violence.',
    hint: 'Consider the prefix "a-" negation.'
  },

  // ==========================================
  // 2. GRAMMAR & MORPHOLOGY (व्याकरणम्)
  // ==========================================
  {
    id: 'gram-01',
    category: 'grammar',
    difficulty: 'beginner',
    question: 'How many primary case inflections (विभक्तयः / vibhaktis) exist in Sanskrit nominal declension?',
    questionDevanagari: 'संस्कृतव्याकरणे कति विभक्तयः सन्ति?',
    type: 'single',
    options: [
      { id: 'opt-a', text: '7 primary cases + Sambodhana (Vocative)' },
      { id: 'opt-b', text: '4 cases only' },
      { id: 'opt-c', text: '12 cases' },
      { id: 'opt-d', text: '3 cases (subject, object, verb)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Sanskrit has 7 cases: Prathamā (Nom), Dvitīyā (Acc), Tṛtīyā (Inst), Caturthī (Dat), Pañcamī (Abl), Ṣaṣṭhī (Gen), Saptamī (Loc), plus Sambodhana (Vocative).',
    hint: 'Pāṇinian grammar lists प्रथमा to सप्तमी plus सम्बोधन.'
  },
  {
    id: 'gram-02',
    category: 'grammar',
    difficulty: 'beginner',
    question: 'Identify the gender (लिङ्गम्) of the word "पुस्तकम्" (pustakam):',
    questionDevanagari: 'पुस्तकम् इत्यस्य लिङ्गं किम्?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Neuter (नपुंसकलिङ्गम्)' },
      { id: 'opt-b', text: 'Masculine (पुंलिङ्गम्)' },
      { id: 'opt-c', text: 'Feminine (स्त्रीलिङ्गम्)' },
      { id: 'opt-d', text: 'Dual gender' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'पुस्तकम् ends in -am in nominative singular, following the a-stem neuter paradigm (फलम्, वनम्, पुस्तकम्).',
    hint: 'Ends in -am like phalam (फलम्).'
  },
  {
    id: 'gram-03',
    category: 'grammar',
    difficulty: 'intermediate',
    question: 'What is the case and number of "रामेण" (rāmeṇa)?',
    questionDevanagari: 'रामेण — विभक्तिः वचनं च किम्?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Tṛtīyā Vibhakti (Instrumental), Singular (एकवचनम्)' },
      { id: 'opt-b', text: 'Prathamā Vibhakti (Nominative), Plural (बहुवचनम्)' },
      { id: 'opt-c', text: 'Pañcamī Vibhakti (Ablative), Singular (एकवचनम्)' },
      { id: 'opt-d', text: 'Ṣaṣṭhī Vibhakti (Genitive), Dual (द्विवचनम्)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'रामेण is the 3rd case singular (Instrumental: "by/with Rama") of the masculine noun राम.',
    hint: 'Used in the sense of "by means of Rama" or "with Rama".'
  },
  {
    id: 'gram-04',
    category: 'grammar',
    difficulty: 'intermediate',
    question: 'Which of the following verb forms belong to Lat Lakāra (लट् लकारः - Present Tense, 3rd Person Singular)?',
    questionDevanagari: 'लट्-लकार-प्रथमपुरुष-एकवचन-रूपाणि चिन्वन्तु:',
    type: 'multiple',
    options: [
      { id: 'opt-a', text: 'पठति (paṭhati - reads)' },
      { id: 'opt-b', text: 'गच्छति (gacchati - goes)' },
      { id: 'opt-c', text: 'अपठत् (apaṭhat - read)' },
      { id: 'opt-d', text: 'करोति (karoti - does)' }
    ],
    correctAnswers: ['opt-a', 'opt-b', 'opt-d'],
    explanation: 'पठति, गच्छति, and करोति are all present tense (लट्) 3rd person singular forms. अपठत् is past tense (लङ्).',
    hint: 'Look for the characteristic -ti suffix in present indicative.'
  },
  {
    id: 'gram-05',
    category: 'grammar',
    difficulty: 'advanced',
    question: 'True or False: In Sanskrit, unlike modern European languages, there are THREE grammatical numbers: Singular (एकवचनम्), Dual (द्विवचनम्), and Plural (बहुवचनम्).',
    questionDevanagari: 'संस्कृते त्रीणि वचनानि सन्ति — एकवचनं, द्विवचनं, बहुवचनं च।',
    type: 'true-false',
    options: [
      { id: 'opt-t', text: 'True' },
      { id: 'opt-f', text: 'False' }
    ],
    correctAnswers: ['opt-t'],
    explanation: 'True. Sanskrit rigorously distinguishes pairs using the dual number (द्विवचनम्), e.g., नरः (one man), नरौ (two men), नराः (many men).',
    hint: 'Dual number applies specifically to pairs of items.'
  },

  // ==========================================
  // 3. SANDHI (सन्धि-विचारः)
  // ==========================================
  {
    id: 'sandhi-01',
    category: 'sandhi',
    difficulty: 'beginner',
    question: 'What is the correct Sandhi join of "विद्या + आलयः" (vidyā + ālayaḥ)?',
    questionDevanagari: 'विद्या + आलयः = ?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'विद्यालयः (vidyālayaḥ) — Dīrgha Sandhi' },
      { id: 'opt-b', text: 'विद्ययालयः (vidyayālayaḥ)' },
      { id: 'opt-c', text: 'विद्यौलयः (vidyaulayaḥ)' },
      { id: 'opt-d', text: 'विद्येत्यलयः (vidyetyalayaḥ)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Savarna Dīrgha Sandhi: ā + ā combines into long ā (आ), yielding विद्यालयः.',
    hint: 'Two similar vowels (सवर्ण) merge into their lengthened form (दीर्घ).'
  },
  {
    id: 'sandhi-02',
    category: 'sandhi',
    difficulty: 'intermediate',
    question: 'How is the compound sandhi "सूर्योदयः" (sūryodayaḥ) correctly split?',
    questionDevanagari: 'सूर्योदयः इत्यस्य सन्धिच्छेदः कः?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'सूर्य + उदयः (sūrya + udayaḥ) — Guṇa Sandhi' },
      { id: 'opt-b', text: 'सूर्यो + दयः (sūryo + dayaḥ)' },
      { id: 'opt-c', text: 'सूर्ये + उदयः (sūrye + udayaḥ)' },
      { id: 'opt-d', text: 'सूर्यम् + उदयः (sūryam + udayaḥ)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Guṇa Sandhi rule: a + u combines to form o (ओ), e.g., सूर्य (a) + उदयः (u) = सूर्योदयः.',
    hint: 'Vowel "a" followed by "u" merges into "o" (गुण सन्धि).'
  },
  {
    id: 'sandhi-03',
    category: 'sandhi',
    difficulty: 'intermediate',
    question: 'What is the result of the Vṛddhi Sandhi in "सदा + एव" (sadā + eva)?',
    questionDevanagari: 'सदा + एव = ?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'सदैव (sadaiva)' },
      { id: 'opt-b', text: 'सदेव (sadeva)' },
      { id: 'opt-c', text: 'सदाएव (sadāeva)' },
      { id: 'opt-d', text: 'सदाव (sadāva)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Vṛddhi Sandhi (वृद्धि सन्धिः): ā + e results in ai (ऐ), producing सदैव.',
    hint: 'Look for the diphthong "ai" (ऐ).'
  },
  {
    id: 'sandhi-04',
    category: 'sandhi',
    difficulty: 'advanced',
    question: 'Select ALL examples of Yan Sandhi (यण् सन्धिः / i, u, ṛ + dissimilar vowel → y, v, r):',
    questionDevanagari: 'यण्-सन्धेः उदाहरणानि चिन्वन्तु:',
    type: 'multiple',
    options: [
      { id: 'opt-a', text: 'इति + आदि = इत्यादि (iti + ādi = ityādi)' },
      { id: 'opt-b', text: 'सु + आगतम् = स्वागतम् (su + āgatam = svāgatam)' },
      { id: 'opt-c', text: 'प्रति + एकम् = प्रत्येकम् (prati + ekam = pratyekam)' },
      { id: 'opt-d', text: 'महा + उत्सवः = महोत्सवः (mahā + utsavaḥ = mahotsavaḥ)' }
    ],
    correctAnswers: ['opt-a', 'opt-b', 'opt-c'],
    explanation: 'इत्यादि (i+ā→yā), स्वागतम् (u+ā→vā), and प्रत्येकम् (i+e→ye) are Yan Sandhis. महोत्सवः is Guṇa Sandhi (ā+u→o).',
    hint: 'Yan converts i→y and u→v before dissimilar vowels.'
  },

  // ==========================================
  // 4. SAMĀSA (समास-परिचयः)
  // ==========================================
  {
    id: 'samasa-01',
    category: 'samasa',
    difficulty: 'beginner',
    question: 'What type of compound (समासः) is "रामलक्ष्मणौ" (Rāma-Lakṣmaṇau)?',
    questionDevanagari: 'रामलक्ष्मणौ — कः समासः?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Dvandva Samāsa (द्वन्द्व समासः - Copulative "and" compound)' },
      { id: 'opt-b', text: 'Bahuvrīhi Samāsa (बहुव्रीहि समासः)' },
      { id: 'opt-c', text: 'Avyayībhāva Samāsa (अव्ययीभाव समासः)' },
      { id: 'opt-d', text: 'Karmadhāraya Samāsa (कर्मधारय समासः)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'रामश्च लक्ष्मणश्च इति रामलक्ष्मणौ — a Dvandva (pair/and) compound combining two coordinate nouns in dual number.',
    hint: 'Expands as "Rama and Lakshmana" (चार्थे द्वन्द्वः).'
  },
  {
    id: 'samasa-02',
    category: 'samasa',
    difficulty: 'intermediate',
    question: 'In which compound type is the PRIOR word (पूर्वपद) an indeclinable / prefix (अव्ययम्)?',
    questionDevanagari: 'यस्मिन् समासे पूर्वपदम् अव्ययं भवति, सः कः?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Avyayībhāva (अव्ययीभावः, e.g. प्रतिदिनम्, यथार्थम्)' },
      { id: 'opt-b', text: 'Tatpuruṣa (तत्पुरुषः)' },
      { id: 'opt-c', text: 'Dvandva (द्वन्द्वः)' },
      { id: 'opt-d', text: 'Bahuvrīhi (बहुव्रीहिः)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Avyayībhāva compounds have an avyaya as their initial element and function adverbially (e.g. यथाशक्ति, प्रतिदिनम्).',
    hint: 'The name itself contains "Avyaya" (अव्यय).'
  },
  {
    id: 'samasa-03',
    category: 'samasa',
    difficulty: 'advanced',
    question: 'True or False: "पीताम्बरः" (Pītāmbaraḥ) meaning "He who wears yellow garments (Lord Krishna/Viṣṇu)" is an example of Bahuvrīhi Samāsa.',
    questionDevanagari: 'पीताम्बरः (विष्णुः) — अयं बहुव्रीहि-समासः अस्ति।',
    type: 'true-false',
    options: [
      { id: 'opt-t', text: 'True' },
      { id: 'opt-f', text: 'False' }
    ],
    correctAnswers: ['opt-t'],
    explanation: 'True. पीतं अम्बरं यस्य सः पीताम्बरः — Bahuvrīhi refers to an external entity (अन्यपदार्थ-प्रधान) not mentioned directly.',
    hint: 'Points to a third person (the deity who wears the yellow cloth).'
  },

  // ==========================================
  // 5. TRANSLITERATION (लिप्यन्तरणम्)
  // ==========================================
  {
    id: 'trans-01',
    category: 'transliteration',
    difficulty: 'beginner',
    question: 'What is the correct IAST transliteration of the Sanskrit word "संस्कृतम्"?',
    questionDevanagari: 'संस्कृतम् → IAST',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'saṃskṛtam' },
      { id: 'opt-b', text: 'sanskritam' },
      { id: 'opt-c', text: 'samskrutam' },
      { id: 'opt-d', text: 'sam-skrtam' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'In academic IAST: अं is ṃ (anusvāra) and ऋ is ṛ (vocalic r), giving "saṃskṛtam".',
    hint: 'Look for underdot on m (ṃ) and r (ṛ).'
  },
  {
    id: 'trans-02',
    category: 'transliteration',
    difficulty: 'intermediate',
    question: 'Which Devanagari character corresponds to the IAST long vowel "ū"?',
    questionDevanagari: 'IAST "ū" = ?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'ऊ (dīrgha ū)' },
      { id: 'opt-b', text: 'उ (hrasva u)' },
      { id: 'opt-c', text: 'ओ (o)' },
      { id: 'opt-d', text: 'औ (au)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Macron above u (ū) indicates the long vowel ऊ (as in रूपम् / rūpam).',
    hint: 'Macron (horizontal bar) denotes lengthening (दीर्घ).'
  },
  {
    id: 'trans-03',
    category: 'transliteration',
    difficulty: 'advanced',
    question: 'Match the retroflex (मूर्धन्य) consonants with their correct IAST diacritic:',
    questionDevanagari: 'मूर्धन्य-वर्णाः (Retroflexes in IAST):',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Underdot: ṭ, ṭh, ḍ, ḍh, ṇ, ṣ, ṛ' },
      { id: 'opt-b', text: 'Acute accent: ś, ć, ź' },
      { id: 'opt-c', text: 'Tilde: ñ' },
      { id: 'opt-d', text: 'Overdot: ṅ' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'In IAST, all retroflex (cerebral) sounds produced with tongue curled to hard palate use underdots (ट=ṭ, ठ=ṭh, ड=ḍ, ढ=ḍh, ण=ṇ, ष=ṣ).',
    hint: 'Retroflexes use a dot below the consonant.'
  },

  // ==========================================
  // 6. PHONOLOGY (उच्चारण-स्थानम्)
  // ==========================================
  {
    id: 'phon-01',
    category: 'phonology',
    difficulty: 'beginner',
    question: 'What is the articulation place (उच्चारण-स्थानम्) of the velar/guttural varga "क, ख, ग, घ, ङ"?',
    questionDevanagari: 'कु-वर्गस्य (क-ख-ग-घ-ङ) उच्चारण-स्थानं किम्?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Kaṇṭha / Guttural / Throat (अकुहविसर्जनीयानां कण्ठः)' },
      { id: 'opt-b', text: 'Tālu / Palatal (इचुयशानां तालु)' },
      { id: 'opt-c', text: 'Mūrdhā / Retroflex (ऋटुरषाणां मूर्धा)' },
      { id: 'opt-d', text: 'Oṣṭha / Labial (उपूपध्मानीयानाम् ओष्ठौ)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'According to Pāṇinīya Śikṣā: अकुहविसर्जनीयानां कण्ठः — the vowels a, ā, ka-varga, h, and visarga are articulated at the throat (कण्ठ).',
    hint: 'Produced from the back of the throat.'
  },
  {
    id: 'phon-02',
    category: 'phonology',
    difficulty: 'intermediate',
    question: 'Select ALL phonemes that are classified as Palatal (तालव्य - Tālavya):',
    questionDevanagari: 'तालव्य-वर्णाः चिन्वन्तु (इचुयशानां तालु):',
    type: 'multiple',
    options: [
      { id: 'opt-a', text: 'इ, ई (i, ī)' },
      { id: 'opt-b', text: 'च, छ, ज, झ, ञ (ca, cha, ja, jha, ña)' },
      { id: 'opt-c', text: 'य, श (ya, śa)' },
      { id: 'opt-d', text: 'प, फ, ब, भ, म (pa, pha, ba, bha, ma)' }
    ],
    correctAnswers: ['opt-a', 'opt-b', 'opt-c'],
    explanation: 'इचुयशानां तालु — i, ī, ca-varga, y, and ś are all articulated against the hard palate (तालु). pa-varga is labial (ओष्ठ्य).',
    hint: 'The rule states: "इचुयशानां तालु".'
  },
  {
    id: 'phon-03',
    category: 'phonology',
    difficulty: 'advanced',
    question: 'True or False: The consonant "व" (va) is unique in having two articulation points: teeth and lips (दन्तोष्ठम् - Dantauṣṭham).',
    questionDevanagari: 'वकारस्य दन्तोष्ठम् उच्चारण-स्थानम् अस्ति।',
    type: 'true-false',
    options: [
      { id: 'opt-t', text: 'True' },
      { id: 'opt-f', text: 'False' }
    ],
    correctAnswers: ['opt-t'],
    explanation: 'True. वकारस्य दन्तोष्ठम् — "va" is articulated by touching the upper teeth to the lower lip.',
    hint: 'Pāṇinian rule explicitly states: "वकारस्य दन्तोष्ठम्".'
  },

  // ==========================================
  // 7. TRANSLATION (अनुवादः)
  // ==========================================
  {
    id: 'transl-01',
    category: 'translation',
    difficulty: 'beginner',
    question: 'Translate "सत्यमेव जयते नानृतम्" into English:',
    questionDevanagari: 'सत्यमेव जयते नानृतम्',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Truth alone triumphs, not falsehood (Muṇḍaka Upaniṣad).' },
      { id: 'opt-b', text: 'Righteousness is victory, courage is immortal.' },
      { id: 'opt-c', text: 'Knowledge gives discipline, wealth gives peace.' },
      { id: 'opt-d', text: 'The whole earth is one single family.' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'सत्यम् (Truth) + एव (alone) + जयते (wins/triumphs) + न (not) + अनृतम् (falsehood).',
    hint: 'Famous national motto of India from Muṇḍaka Upaniṣad 3.1.6.'
  },
  {
    id: 'transl-02',
    category: 'translation',
    difficulty: 'intermediate',
    question: 'What is the Hindi & Marathi meaning of "वसुधैव कुटुम्बकम्"?',
    questionDevanagari: 'वसुधैव कुटुम्बकम् — अर्थः कः?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'सम्पूर्ण पृथ्वी ही एक परिवार है (संपूर्ण पृथ्वी हेच एक कुटुंब आहे)' },
      { id: 'opt-b', text: 'धर्म की रक्षा करने वाले की रक्षा होती है' },
      { id: 'opt-c', text: 'अहिंसा ही परम धर्म है' },
      { id: 'opt-d', text: 'कर्म ही पूजा है' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'वसुधा (Earth) + एव (indeed) + कुटुम्बकम् (one family) — Mahā Upaniṣad 6.71.',
    hint: 'Vasudhā means Earth, and Kuṭumbakam means family.'
  },
  {
    id: 'transl-03',
    category: 'translation',
    difficulty: 'advanced',
    question: 'Which of the following phrases expresses: "Dharma protects those who protect it"?',
    questionDevanagari: '"धर्म की रक्षा करने वाले की धर्म रक्षा करता है" — संस्कृतवाक्यं किम्?',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'धर्मो रक्षति रक्षितः (dharmo rakṣati rakṣitaḥ)' },
      { id: 'opt-b', text: 'अहिंसा परमो धर्मः (ahiṃsā paramo dharmaḥ)' },
      { id: 'opt-c', text: 'योगः कर्मसु कौशलम् (yogaḥ karmasu kauśalam)' },
      { id: 'opt-d', text: 'तमसो मा ज्योतिर्गमय (tamaso mā jyotirgamaya)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'धर्मो रक्षति रक्षितः from Manusmṛti 8.15 / Mahābhārata means "Dharma, when safeguarded, safeguards."',
    hint: 'Contains the root "rakṣ" (to protect).'
  },

  // ==========================================
  // 8. READING (पठन-बोधनम्)
  // ==========================================
  {
    id: 'read-01',
    category: 'reading',
    difficulty: 'beginner',
    question: 'Based on the verse "विद्या ददाति विनयं विनयाद् याति पात्रताम्", what is the first fruit of Vidyā (knowledge)?',
    questionContext: 'विद्या ददाति विनयं विनयाद् याति पात्रताम् । पात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम् ॥',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Vinayam (विनयम् - Humility & discipline)' },
      { id: 'opt-b', text: 'Dhanam (धनम् - Wealth)' },
      { id: 'opt-c', text: 'Sukham (सुखम् - Pleasure)' },
      { id: 'opt-d', text: 'Krodham (क्रोधम् - Anger)' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'The verse explicitly begins: "विद्या ददाति विनयं" (Knowledge bestows humility/discipline).',
    hint: 'Look at the first hemistich: "vidyā dadāti..."'
  },
  {
    id: 'read-02',
    category: 'reading',
    difficulty: 'intermediate',
    question: 'In the Upaniṣadic prayer "असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ॥", what do "तमस्" (tamas) and "ज्योतिस्" (jyotis) symbolize?',
    questionContext: 'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥ (बृहदारण्यकोपनिषत्)',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Tamas = Darkness/Ignorance; Jyotis = Light/Knowledge/Enlightenment' },
      { id: 'opt-b', text: 'Tamas = Fire; Jyotis = Water' },
      { id: 'opt-c', text: 'Tamas = War; Jyotis = Peace' },
      { id: 'opt-d', text: 'Tamas = Night time; Jyotis = Day time' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'In Vedāntic metaphor, Tamas represents ignorance (avidyā/moha), and Jyotis represents illumination and spiritual realization.',
    hint: 'Tamas literally means darkness/obscurity, while Jyoti is illumination.'
  },
  {
    id: 'read-03',
    category: 'reading',
    difficulty: 'advanced',
    question: 'In the Bhagavad Gītā verse "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", what is the grammatical form of "मा"?',
    questionContext: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ (गीता २.४७)',
    type: 'single',
    options: [
      { id: 'opt-a', text: 'Prohibitive particle / Avyaya ("do not", "let not")' },
      { id: 'opt-b', text: 'First person pronoun accusative ("me")' },
      { id: 'opt-c', text: 'Feminine vocative particle' },
      { id: 'opt-d', text: 'Interrogative pronoun' }
    ],
    correctAnswers: ['opt-a'],
    explanation: 'Here "मा" is the prohibitive indeclinable particle (निषेधार्थकम् अव्ययम्), meaning "do not" (do not attach to fruits).',
    hint: 'Used with imperative and subjunctive senses to prohibit an action.'
  }
];
