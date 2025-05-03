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
  } | null;
  setDungSaiSection: React.Dispatch<React.SetStateAction<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
  } | null>>;
}

const DungSaiQuizContext = createContext<DungSaiQuizContextType | undefined>(undefined);

export function DungSaiQuizProvider({ children }: { children: ReactNode }) {
  const [dungSaiSection, setDungSaiSection] = useState<{
    questions: DungSaiQuestion[];
    completed: boolean;
    score: number;
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
      });
    }
    fetchDungSaiSection();
  }, [location]);

  return (
    <DungSaiQuizContext.Provider value={{ dungSaiSection, setDungSaiSection }}>
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