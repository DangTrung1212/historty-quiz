import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { QuizSection } from '@/lib/quiz-data';
import { saveProgress, loadProgress } from '@/lib/storage';
import { useLocation } from 'wouter';
import { calculateMultipleChoiceScore } from "../lib/quiz-multichoice";

interface MultipleChoiceQuizContextType {
  sections: QuizSection[];
  userAnswers: Record<number, Record<number, string>>;
  startTime: Record<number, number>;
  endTime: Record<number, number>;
  completedSections: number;
  getCurrentSection: (sectionId: number) => QuizSection | undefined;
  getNextSectionId: (currentSectionId: number) => number;
  startQuiz: (sectionId: number) => void;
  answerQuestion: (sectionId: number, questionIndex: number, optionId: string) => void;
  goToPreviousQuestion: (sectionId: number, currentQuestionIndex: number) => void;
  calculateScore: (sectionId: number) => {
    correct: number;
    incorrect: number;
    total: number;
    percent: number;
    timeMinutes: string;
    timeSeconds: string;
  };
  completeSection: (sectionId: number, score: number) => void;
  loadStoredProgress: () => void;
}

const MultipleChoiceQuizContext = createContext<MultipleChoiceQuizContextType | undefined>(undefined);

export function MultipleChoiceQuizProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, Record<number, string>>>({});
  const [startTime, setStartTime] = useState<Record<number, number>>({});
  const [endTime, setEndTime] = useState<Record<number, number>>({});
  const [completedSections, setCompletedSections] = useState(0);
  const [location] = useLocation();

  const getCurrentSection = useCallback((sectionId: number) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  const getNextSectionId = useCallback((currentSectionId: number) => {
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1].id;
    }
    return -1;
  }, [sections]);

  const startQuiz = useCallback((sectionId: number) => {
    setStartTime(prev => ({
      ...prev,
      [sectionId]: Date.now()
    }));
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, currentQuestion: 0 }
        : section
    ));
  }, []);

  const answerQuestion = useCallback((sectionId: number, questionIndex: number, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [questionIndex]: optionId
      }
    }));
    setSections(prev => {
      const newSections = prev.map(section => {
        if (section.id === sectionId) {
          const isLastQuestion = questionIndex === section.questions.length - 1;
          if (isLastQuestion) {
            setEndTime(prevTimes => ({
              ...prevTimes,
              [sectionId]: Date.now()
            }));
          }
          return {
            ...section,
            currentQuestion: isLastQuestion ? questionIndex : questionIndex + 1
          };
        }
        return section;
      });
      return newSections;
    });
  }, []);

  const calculateScore = useCallback((sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    const sectionAnswers = userAnswers[sectionId] || {};
    if (!section) {
      return { correct: 0, incorrect: 0, total: 0, percent: 0, timeMinutes: '00', timeSeconds: '00' };
    }
    const { correct, incorrect, total, percent } = calculateMultipleChoiceScore(section, sectionAnswers);
    const start = startTime[sectionId] || Date.now();
    const end = endTime[sectionId] || Date.now();
    const timeTakenMs = end - start;
    const minutes = Math.floor(timeTakenMs / 60000);
    const seconds = Math.floor((timeTakenMs % 60000) / 1000);
    return {
      correct,
      incorrect,
      total,
      percent,
      timeMinutes: minutes.toString().padStart(2, '0'),
      timeSeconds: seconds.toString().padStart(2, '0')
    };
  }, [sections, userAnswers, startTime, endTime]);

  const completeSection = useCallback((sectionId: number, score: number) => {
    setSections(prev => {
      const newSections = prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            completed: score >= 90,
            score,
          };
        }
        return section;
      });
      setCompletedSections(newSections.filter(s => s.completed).length);
      saveProgress(newSections);
      return newSections;
    });
  }, []);

  const goToPreviousQuestion = useCallback((sectionId: number, currentQuestionIndex: number) => {
    if (currentQuestionIndex > 0) {
      setSections(prev => prev.map(section =>
        section.id === sectionId
          ? { ...section, currentQuestion: currentQuestionIndex - 1 }
          : section
      ));
    }
  }, []);

  const loadStoredProgress = useCallback(() => {
    // No need to restore questions, currentQuestion, or userAnswers
    // Only restore completed and score for each section if needed elsewhere
  }, []);

  useEffect(() => {
    const { loadedSections } = loadProgress();
    async function fetchAndSetDynamicSections() {
      const res1 = await fetch("/api/questions/combined/trac_nghiem_1");
      const questions1 = await res1.json();
      const res2 = await fetch("/api/questions/combined/trac_nghiem_2");
      const questions2 = await res2.json();
      const res3 = await fetch("/api/questions/combined/trac_nghiem_dung_sai");
      const questions3 = await res3.json();
      const newSections = [
        {
          id: 1,
          title: "Trắc Nghiệm 1",
          questions: questions1.map((q: any, idx: number) => ({
            id: idx + 1,
            text: q.question_text,
            options: Object.entries(q.options).map(([key, value]) => ({
              id: key,
              text: value
            })),
            correctOptionId: q.correct_answer
          })),
          completed: false,
          score: 0,
          currentQuestion: 0,
        },
        {
          id: 2,
          title: "Trắc Nghiệm 2",
          questions: questions2.map((q: any, idx: number) => ({
            id: idx + 1,
            text: q.question_text,
            options: Object.entries(q.options).map(([key, value]) => ({
              id: key,
              text: value
            })),
            correctOptionId: q.correct_answer
          })),
          completed: false,
          score: 0,
          currentQuestion: 0,
        },
        {
          id: 3,
          title: "Trắc Nghiệm Đúng Sai",
          questions: questions3.map((q: any, idx: number) => ({
            id: idx + 1,
            text: q.question,
            options: Object.entries(q.statements).map(([key, value]) => ({
              id: key,
              text: value
            })),
            correctOptionId: q.answer_boolean_map,
            explanationMap: q.explanation_map
          })),
          completed: false,
          score: 0,
          currentQuestion: 0,
        }
      ];
      if (loadedSections && loadedSections.length > 0) {
        const mergedSections = newSections.map((section) => {
          const existing = loadedSections.find((s: any) => s.id === section.id);
          if (existing) {
            return {
              ...section,
              completed: existing.completed,
              score: existing.score,
              currentQuestion: 0,
            };
          }
          return section;
        });
        setSections(mergedSections);
        setCompletedSections(mergedSections.filter(s => s.completed).length);
      } else {
        setSections(newSections);
        setCompletedSections(0);
      }
    }
    fetchAndSetDynamicSections();
  }, [location]);

  const value = {
    sections,
    userAnswers,
    startTime,
    endTime,
    completedSections,
    getCurrentSection,
    getNextSectionId,
    startQuiz,
    answerQuestion,
    goToPreviousQuestion,
    calculateScore,
    completeSection,
    loadStoredProgress
  };

  return (
    <MultipleChoiceQuizContext.Provider value={value}>
      {children}
    </MultipleChoiceQuizContext.Provider>
  );
}

export function useMultipleChoiceQuiz() {
  const context = useContext(MultipleChoiceQuizContext);
  if (context === undefined) {
    throw new Error('useMultipleChoiceQuiz must be used within a MultipleChoiceQuizProvider');
  }
  return context;
}