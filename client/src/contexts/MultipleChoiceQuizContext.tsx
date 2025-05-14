import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { QuizSection } from '@/lib/quiz-data';
import { saveMcqProgress, loadMcqProgress } from '@/lib/storage';
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
  resetSection: (sectionId: number) => void;
}

const MultipleChoiceQuizContext = createContext<MultipleChoiceQuizContextType | undefined>(undefined);

export function MultipleChoiceQuizProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, Record<number, string>>>({});
  const [startTime, setStartTime] = useState<Record<number, number>>({});
  const [endTime, setEndTime] = useState<Record<number, number>>({});
  const [completedSections, setCompletedSections] = useState(0);
  // const [location] = useLocation(); // No longer needed for the main data loading effect

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
    setSections(prevSections =>
      prevSections.map(section => {
        if (section.id === sectionId) {
          // Only reset to question 0 if it's effectively a new start.
          // A simple check: if there are no user answers for this section yet.
          const sectionAnswers = userAnswers[sectionId];
          const isNewStart = !sectionAnswers || Object.keys(sectionAnswers).length === 0;

          return {
            ...section,
            // Only set currentQuestion to 0 if it's a truly new start.
            // If answers exist, user is likely returning, so preserve currentQuestion.
            // If currentQuestion is already 0 and no answers, this is fine.
            // Ensure currentQuestion is at least 0 if it was undefined.
            currentQuestion: isNewStart ? 0 : (section.currentQuestion || 0),
          };
        }
        return section;
      })
    );

    // Set/update startTime regardless, as visiting the page implies activity.
    setStartTime(prev => ({
      ...prev,
      [sectionId]: Date.now()
    }));
  }, [userAnswers]);

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
      console.log("[MCQContext] completeSection: Intentionally not saving to quiz_progress anymore.");
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

  const resetSection = useCallback((sectionId: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [sectionId]: {},
    }));
    setSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, currentQuestion: 0 }
        : section
    ));
  }, []);

  useEffect(() => {
    // Use loadMcqProgress for MCQ context
    // const progressStorage = loadMcqProgress(); // Remove this load call
    console.log("[MCQContext Init] Intentionally not loading from quiz_progress anymore for initial section setup.");

    // userAnswers, startTime, endTime will start empty or be populated by in-session activity,
    // as we can't reliably load them with the current implied signature of loadMcqProgress.

    async function fetchAndInitializeSections() {
      try {
        const res1 = await fetch("/api/questions/combined/trac_nghiem_1");
        const questions1 = await res1.json();
        const res2 = await fetch("/api/questions/combined/trac_nghiem_2");
        const questions2 = await res2.json();
        const res3 = await fetch("/api/questions/combined/trac_nghiem_dung_sai");
        const questions3 = await res3.json();
        
        const apiSectionsStructure = [
          {
            id: 1,
            title: "Trắc Nghiệm 1",
            questions: questions1.map((q: any, idx: number) => ({
              id: idx + 1,
              text: q.question_text,
              options: Object.entries(q.options).map(([key, value]) => ({ id: key, text: value as string })),
              correctOptionId: q.correct_answer,
              explanation: q.explanation?.solution
            })),
          },
          {
            id: 2,
            title: "Trắc Nghiệm 2",
            questions: questions2.map((q: any, idx: number) => ({
              id: idx + 1,
              text: q.question_text,
              options: Object.entries(q.options).map(([key, value]) => ({ id: key, text: value as string })),
              correctOptionId: q.correct_answer,
              explanation: q.explanation?.solution
            })),
          },
          {
            id: 3,
            title: "Trắc Nghiệm Đúng Sai",
            questions: questions3.map((q: any, idx: number) => ({
              id: idx + 1,
              text: q.question, 
              options: Object.entries(q.statements).map(([key, value]) => ({ id: key, text: value as string })), 
              correctOptionId: q.answer_boolean_map, 
              explanationMap: q.explanation_map
            })),
          }
        ];

        const initializedSections = apiSectionsStructure.map(apiSection => {
          // const storedSectionInfo = loadedSectionsFromStorage.find((s: any) => s.id === apiSection.id);
          return {
            ...apiSection, 
            completed: false, // Default to false
            score: 0,       // Default to 0
            currentQuestion: 0, 
          };
        });

        setSections(initializedSections);
        setCompletedSections(initializedSections.filter(s => s.completed).length);
        
        // saveMcqProgress(minimalDataForInitialSave); // Remove this save call as well

      } catch (error) {
        console.error("Failed to fetch and initialize sections:", error);
      }
    }

    if (sections.length === 0) {
      fetchAndInitializeSections();
    }
  }, [sections]); // sections dependency is to prevent re-fetch if already populated

  useEffect(() => {
    if (sections.length > 0) {
      // const hasProgressOrLoadedStructure = sections.some(s => s.completed || s.currentQuestion > 0 || (s.questions && s.questions.length > 0));
      // if (hasProgressOrLoadedStructure) {
      //    saveMcqProgress(sections); 
      // }
      console.log("[MCQContext] Intentionally not saving full section data to localStorage anymore.");
    }
  }, [sections]); 

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
    loadStoredProgress,
    resetSection,
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