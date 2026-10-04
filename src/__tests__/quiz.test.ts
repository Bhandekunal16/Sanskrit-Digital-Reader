import { describe, it, expect } from 'vitest';
import { 
  isAnswerCorrect, 
  calculateScore, 
  filterQuestions, 
  getPerformanceFeedback 
} from '../lib/quiz';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizzes';

describe('Sanskrit Quiz Engine', () => {
  it('should load question dataset with valid options and correct answers', () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(15);
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.id).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctAnswers.length).toBeGreaterThanOrEqual(1);
      expect(q.explanation).toBeTruthy();
    });
  });

  it('correctly evaluates single-choice questions', () => {
    const mockQuestion: QuizQuestion = {
      id: 'test-1',
      category: 'vocabulary',
      difficulty: 'beginner',
      question: 'What is satyam?',
      type: 'single',
      options: [
        { id: 'a', text: 'Truth' },
        { id: 'b', text: 'Falsehood' }
      ],
      correctAnswers: ['a'],
      explanation: 'Satyam means truth'
    };

    expect(isAnswerCorrect(mockQuestion, ['a'])).toBe(true);
    expect(isAnswerCorrect(mockQuestion, ['b'])).toBe(false);
    expect(isAnswerCorrect(mockQuestion, [])).toBe(false);
    expect(isAnswerCorrect(mockQuestion, ['a', 'b'])).toBe(false);
  });

  it('correctly evaluates multiple-choice questions requiring all correct answers', () => {
    const mockMultiQuestion: QuizQuestion = {
      id: 'test-2',
      category: 'grammar',
      difficulty: 'intermediate',
      question: 'Select synonyms',
      type: 'multiple',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' }
      ],
      correctAnswers: ['a', 'b'],
      explanation: 'A and B are correct'
    };

    expect(isAnswerCorrect(mockMultiQuestion, ['a', 'b'])).toBe(true);
    expect(isAnswerCorrect(mockMultiQuestion, ['b', 'a'])).toBe(true); // order independent
    expect(isAnswerCorrect(mockMultiQuestion, ['a'])).toBe(false); // incomplete
    expect(isAnswerCorrect(mockMultiQuestion, ['a', 'b', 'c'])).toBe(false); // excess
  });

  it('filters questions accurately by category, difficulty, and count', () => {
    const grammarQuestions = filterQuestions({
      category: 'grammar',
      difficulty: 'all',
      count: 5,
      shuffle: false
    });

    expect(grammarQuestions.length).toBeLessThanOrEqual(5);
    grammarQuestions.forEach(q => {
      expect(q.category).toBe('grammar');
    });
  });

  it('calculates score and accuracy percentage correctly', () => {
    const sampleQuestions = QUIZ_QUESTIONS.slice(0, 4);
    const answers: Record<string, string[]> = {
      [sampleQuestions[0].id]: sampleQuestions[0].correctAnswers,
      [sampleQuestions[1].id]: sampleQuestions[1].correctAnswers,
      [sampleQuestions[2].id]: ['invalid_answer'],
      [sampleQuestions[3].id]: []
    };

    const { score, total, percentage } = calculateScore(sampleQuestions, answers);
    expect(total).toBe(4);
    expect(score).toBe(2);
    expect(percentage).toBe(50);
  });

  it('provides performance feedback across percentage tiers', () => {
    expect(getPerformanceFeedback(100).tier).toBe('excellent');
    expect(getPerformanceFeedback(80).tier).toBe('very-good');
    expect(getPerformanceFeedback(60).tier).toBe('good');
    expect(getPerformanceFeedback(40).tier).toBe('needs-practice');
  });
});
