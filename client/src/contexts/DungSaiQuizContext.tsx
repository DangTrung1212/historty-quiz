import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';

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
  } | null;
  setDungSaiSection: React.Dispatch<React.SetStateAction<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
    userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>;
  } | null>>;
  answerDungSaiQuestion: (questionIndex: number, answers: Record<string, 'Đúng' | 'Sai'>) => void;
  calculateDungSaiScore: () => number;
}

const DungSaiQuizContext = createContext<DungSaiQuizContextType | undefined>(undefined);

export function DungSaiQuizProvider({ children }: { children: ReactNode }) {
  const [dungSaiSection, setDungSaiSection] = useState<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
    userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>;
  } | null>(null);
  const [location] = useLocation();

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
      setDungSaiSection({
        questions: dungSaiQuestions,
        completed: false,
        score: 0,
        userAnswers: {},
      });
    }
    fetchDungSaiSection();
  }, [location]);

  // Store answers for a question
  const answerDungSaiQuestion = (questionIndex: number, answers: Record<string, 'Đúng' | 'Sai'>) => {
    setDungSaiSection(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionIndex]: answers,
        },
      };
    });
  };

  // Calculate score with penalty rules
  const calculateDungSaiScore = () => {
    if (!dungSaiSection) return 0;
    let incorrectCount = 0;
    let totalStatements = 0;
    dungSaiSection.questions.forEach((q, idx) => {
      const userAns = dungSaiSection.userAnswers[idx] || {};
      for (const key in q.statements) {
        totalStatements++;
        const correct = q.correctMap[key] ? 'Đúng' : 'Sai';
        if (userAns[key] && userAns[key] !== correct) {
          incorrectCount++;
        }
      }
    });

    if (incorrectCount === 0) return 100;
    if (incorrectCount === 1) return 50;
    if (incorrectCount === 2) return 25;
    if (incorrectCount === 3) return 10;
    if (incorrectCount === totalStatements) return 0;
    return 0;
  };

  return (
    <DungSaiQuizContext.Provider value={{ dungSaiSection, setDungSaiSection, answerDungSaiQuestion, calculateDungSaiScore }}>
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