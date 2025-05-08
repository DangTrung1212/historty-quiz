import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMultipleChoiceQuiz } from './MultipleChoiceQuizContext'; // Import MultipleChoiceQuizContext
import { calculateDungSaiScore, isDungSaiQuestionAnswered } from "../lib/quiz-dungsai";

export interface DungSaiQuestion {
  id: number;
  passage: string;
  statements: { [key: string]: string };
  correctMap: { [key: string]: boolean };
  explanationMap: { [key: string]: string };
}

interface DungSaiQuizContextType {
  dungSaiSection: {
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
    userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>;
    currentQuestion: number; // Added currentQuestion
  } | null;
  setDungSaiSection: React.Dispatch<React.SetStateAction<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
    userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>;
    currentQuestion: number; // Added currentQuestion
  } | null>>;
  answerDungSaiQuestion: (questionIndex: number, answers: Record<string, 'Đúng' | 'Sai'>) => void;
  calculateDungSaiScore: () => number;
  isCurrentQuestionAnswered: () => boolean; // Added
  resetDungSaiSection: () => void;
}

const DungSaiQuizContext = createContext<DungSaiQuizContextType | undefined>(undefined);

export function DungSaiQuizProvider({ children }: { children: ReactNode }) {
  const [dungSaiSection, setDungSaiSection] = useState<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
    userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>;
    currentQuestion: number; // Added currentQuestion
  } | null>(null);
  const [location] = useLocation();
  const { completeSection } = useMultipleChoiceQuiz(); // Get completeSection from MC context

  // Function to check if the current question is fully answered
  const isCurrentQuestionAnswered = () => {
    if (!dungSaiSection) return false;
    const currentQuestionData = dungSaiSection.questions[dungSaiSection.currentQuestion];
    if (!currentQuestionData) return false;
    return isDungSaiQuestionAnswered(currentQuestionData, dungSaiSection.userAnswers[dungSaiSection.currentQuestion] || {});
  };

  useEffect(() => {
    async function fetchDungSaiSection() {
      const res = await fetch("/api/questions/combined/trac_nghiem_dung_sai");
      const questions = await res.json();
      const dungSaiQuestions: DungSaiQuestion[] = questions.map((q: any, idx: number) => ({
        id: idx + 1,
        passage: q.question,
        statements: q.statements,
        correctMap: q.answer_boolean_map,
        explanationMap: q.explanation_map,
      }));

      // Initialize with empty user answers, as they are not persisted individually
      setDungSaiSection({
        questions: dungSaiQuestions,
        completed: false, // Completed status will be managed by MC context
        score: 0, // Score will be calculated on results page and managed by MC context
        userAnswers: {}, // User answers are not persisted individually
        currentQuestion: 0, // Initialize currentQuestion
      });
    }
    fetchDungSaiSection();
  }, []);

  // Store answers for a question
  const answerDungSaiQuestion = (questionIndex: number, answers: Record<string, 'Đúng' | 'Sai'>) => {
    setDungSaiSection(prev => {
      if (!prev) return prev;
      const updatedAnswers = {
        ...prev.userAnswers,
        [questionIndex]: answers,
      };
      console.log("DungSaiQuizContext: User answers updated", updatedAnswers); // Log user answers update
      return {
        ...prev,
        userAnswers: updatedAnswers,
      };
    });
  };

  // Reset DungSai section state
  const resetDungSaiSection = () => {
    setDungSaiSection(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        userAnswers: {},
        currentQuestion: 0,
        completed: false,
        score: 0,
      };
    });
  };

  // Calculate score with penalty rules
  const calculateDungSaiScoreWrapper = () => {
    if (!dungSaiSection) return 0;
    return calculateDungSaiScore(dungSaiSection.questions, dungSaiSection.userAnswers);
  };

  // Effect to complete the section when the last question is answered
  useEffect(() => {
    if (dungSaiSection && dungSaiSection.currentQuestion >= dungSaiSection.questions.length && !dungSaiSection.completed) {
      const score = calculateDungSaiScoreWrapper();
      completeSection(3, score);
      setDungSaiSection(prev => prev ? { ...prev, completed: true, score: score } : null);
    }
  }, [dungSaiSection?.currentQuestion, dungSaiSection?.questions.length, dungSaiSection?.completed, calculateDungSaiScoreWrapper, completeSection]);


  return (
    <DungSaiQuizContext.Provider value={{ dungSaiSection, setDungSaiSection, answerDungSaiQuestion, calculateDungSaiScore: calculateDungSaiScoreWrapper, isCurrentQuestionAnswered, resetDungSaiSection }}>
      {children}
    </DungSaiQuizContext.Provider>
  );
}

export function useDungSaiQuiz() {
  const context = useContext(DungSaiQuizContext);
  if (context === undefined) {
    throw new Error('useDungSaiQuiz must be used within a DungSaiQuizProvider');
  }
  return context;
}
