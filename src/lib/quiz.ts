import { 
  QuizQuestion, 
  QuizCategory, 
  QuizDifficulty, 
  QUIZ_QUESTIONS, 
  QUIZ_CATEGORIES 
} from '../data/quizzes';

export interface QuizAttemptRecord {
  id: string;
  timestamp: number;
  category: QuizCategory | 'mixed';
  categoryLabel: string;
  difficulty: QuizDifficulty | 'all';
  score: number;
  total: number;
  percentage: number;
}

export interface PerformanceFeedback {
  tier: 'excellent' | 'very-good' | 'good' | 'needs-practice';
  headline: string;
  message: string;
  devanagariMessage: string;
  badgeColor: string;
}

/**
 * Determine if a user's selected answers match the question's correct answers exactly.
 * For multiple choice, all and only correct answers must be selected.
 */
export function isAnswerCorrect(question: QuizQuestion, selectedAnswerIds: string[]): boolean {
  if (!question || !selectedAnswerIds || selectedAnswerIds.length === 0) {
    return false;
  }

  const correctSet = new Set(question.correctAnswers);
  const selectedSet = new Set(selectedAnswerIds);

  if (correctSet.size !== selectedSet.size) {
    return false;
  }

  for (const id of selectedSet) {
    if (!correctSet.has(id)) {
      return false;
    }
  }

  return true;
}

/**
 * Deterministically or randomly shuffle an array using Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Filter and prepare questions based on user selections
 */
export function filterQuestions(options: {
  category: QuizCategory | 'mixed';
  difficulty: QuizDifficulty | 'all';
  count: number;
  shuffle?: boolean;
}): QuizQuestion[] {
  const { category, difficulty, count, shuffle = true } = options;

  let pool = [...QUIZ_QUESTIONS];

  if (category !== 'mixed') {
    pool = pool.filter(q => q.category === category);
  }

  if (difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // If specific difficulty filter yields fewer questions, fallback gracefully to include other difficulties
  if (pool.length === 0) {
    if (category !== 'mixed') {
      pool = QUIZ_QUESTIONS.filter(q => q.category === category);
    } else {
      pool = [...QUIZ_QUESTIONS];
    }
  }

  const processed = shuffle ? shuffleArray(pool) : pool;
  const selected = processed.slice(0, Math.min(count, processed.length));

  // Shuffle options for each question while maintaining option IDs
  return selected.map(q => ({
    ...q,
    options: shuffle ? shuffleArray(q.options) : q.options
  }));
}

/**
 * Calculate total score and accuracy percentage
 */
export function calculateScore(
  questions: QuizQuestion[],
  userAnswers: Record<string, string[]>
): { score: number; total: number; percentage: number } {
  let score = 0;
  const total = questions.length;

  questions.forEach(q => {
    const answers = userAnswers[q.id] || [];
    if (isAnswerCorrect(q, answers)) {
      score++;
    }
  });

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  return { score, total, percentage };
}

/**
 * Return structured performance feedback based on percentage
 */
export function getPerformanceFeedback(percentage: number): PerformanceFeedback {
  if (percentage >= 90) {
    return {
      tier: 'excellent',
      headline: 'उत्कृष्टम्! (Outstanding Mastery)',
      message: 'Exceptional Sanskrit comprehension. You demonstrate profound mastery of grammatical structures, vocabulary, and classical texts.',
      devanagariMessage: 'भवतः संस्कृतज्ञानम् अत्युत्तमं प्रशंसनीयं च वर्तते।',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300'
    };
  } else if (percentage >= 75) {
    return {
      tier: 'very-good',
      headline: 'शोभनम्! (Very Good Foundation)',
      message: 'Very strong foundation in Sanskrit linguistics. Keep practicing nuances of sandhi, morphology, and rare lexical derivations.',
      devanagariMessage: 'भवतः ज्ञानं सुदृढं वर्तते। निरन्तरं स्वाध्यायं कुर्वन्तु।',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-300'
    };
  } else if (percentage >= 50) {
    return {
      tier: 'good',
      headline: 'समीचीनम्! (Good Progress)',
      message: 'Good grasp of foundational concepts. Review the explanations and dictionary entries to strengthen morphology and sandhi recognition.',
      devanagariMessage: 'समीचीनः प्रयासः। पुनः अभ्यासेन सिद्धिः भविष्यति।',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-300'
    };
  } else {
    return {
      tier: 'needs-practice',
      headline: 'अभ्यासं कुरुत (Keep Learning)',
      message: 'Sanskrit is a rigorous language of precise rules. Use the Reader and Dictionary tools to review foundational grammar and retry.',
      devanagariMessage: 'अभ्यासेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः।',
      badgeColor: 'bg-stone-100 text-stone-800 border-stone-300'
    };
  }
}

const STORAGE_KEY = 'sanskrit_quiz_history_v1';

/**
 * Save quiz attempt record to localStorage
 */
export function saveQuizAttempt(attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: QuizAttemptRecord[] = raw ? JSON.parse(raw) : [];

    const newRecord: QuizAttemptRecord = {
      ...attempt,
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now()
    };

    const updated = [newRecord, ...history].slice(0, 20); // keep last 20 attempts
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Graceful fallback if localStorage is unavailable
  }
}

/**
 * Retrieve saved quiz history
 */
export function getQuizHistory(): QuizAttemptRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear saved quiz history
 */
export function clearQuizHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
