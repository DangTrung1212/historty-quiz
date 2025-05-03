import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {  QuizSection } from '@/lib/quiz-data';
import { saveProgress, loadProgress } from '@/lib/storage';
import { useLocation } from "wouter";

interface QuizContextType {
  sections: QuizSection[];
  userAnswers: Record<number, Record<number, string>>;
  startTime: Record<number, number>;
  endTime: Record<number, number>;
  completedSections: number;
  previousRevealLevel: number;
  personalLetter: string;
  
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
  getImageRevealLevel: () => number;
  allSectionsCompleted: () => boolean;
  loadStoredProgress: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<QuizSection[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, Record<number, string>>>({});
  const [startTime, setStartTime] = useState<Record<number, number>>({});
  const [endTime, setEndTime] = useState<Record<number, number>>({});
  const [completedSections, setCompletedSections] = useState(0);
  const [previousRevealLevel, setPreviousRevealLevel] = useState(0);
  const [personalLetter, setPersonalLetter] = useState(`Gửi bạn,

Chúc mừng bạn đã hoàn thành thành công tất cả các phần thi lịch sử! Đây không chỉ là kiến thức để chuẩn bị cho kỳ thi THPT Quốc gia, mà còn là hành trang giúp bạn hiểu sâu sắc hơn về lịch sử dân tộc và thế giới.

Mỗi sự kiện trong lịch sử đều có những bài học quý giá, và việc bạn dành thời gian nghiêm túc học tập như vậy thực sự đáng ngưỡng mộ. Hi vọng những điều bạn học được sẽ không chỉ giúp bạn trong kỳ thi sắp tới mà còn theo bạn trên mọi chặng đường trong tương lai.

Chúc bạn đạt được kết quả cao nhất trong kỳ thi!

Trân trọng`);
  const [location] = useLocation();

  // Helper function to calculate the reveal level
  const calculateRevealLevel = (sectionsArr: QuizSection[]) => {
    const completed = sectionsArr.filter(s => s.completed && s.score >= 90).length;
    return Math.min(completed * 25, 100);
  };

  // Get current section by ID
  const getCurrentSection = useCallback((sectionId: number) => {
    return sections.find(section => section.id === sectionId);
  }, [sections]);

  // Get next section ID
  const getNextSectionId = useCallback((currentSectionId: number) => {
    const currentIndex = sections.findIndex(s => s.id === currentSectionId);
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1].id;
    }
    return -1; // No next section
  }, [sections]);

  // Start a quiz
  const startQuiz = useCallback((sectionId: number) => {
    setStartTime(prev => ({
      ...prev,
      [sectionId]: Date.now()
    }));
    
    // Reset section's current question to 0
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, currentQuestion: 0 }
        : section
    ));
  }, []);

  // Answer a question
  const answerQuestion = useCallback((sectionId: number, questionIndex: number, optionId: string) => {
    // Save user's answer
    setUserAnswers(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [questionIndex]: optionId
      }
    }));
    
    // Update current question (move to next)
    setSections(prev => {
      const newSections = prev.map(section => {
        if (section.id === sectionId) {
          const isLastQuestion = questionIndex === section.questions.length - 1;
          if (isLastQuestion) {
            // If this is the last question, record end time
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

  // Calculate score for a section
  const calculateScore = useCallback((sectionId: number) => {
    const section = sections.find(s => s.id === sectionId);
    const sectionAnswers = userAnswers[sectionId] || {};
    
    if (!section) {
      return { correct: 0, incorrect: 0, total: 0, percent: 0, timeMinutes: '00', timeSeconds: '00' };
    }
    
    let correct = 0;
    let total = section.questions.length;
    
    for (let i = 0; i < total; i++) {
      const question = section.questions[i];
      const userAnswer = sectionAnswers[i];
      
      if (userAnswer && userAnswer === question.correctOptionId) {
        correct++;
      }
    }
    
    const incorrect = total - correct;
    const percent = (correct / total) * 100;
    
    // Calculate time taken
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

  // Get image reveal level (0, 25, 50, 75, 100)
  const getImageRevealLevel = useCallback(() => {
    return calculateRevealLevel(sections);
  }, [sections]);

  // Complete a section
  const completeSection = useCallback((sectionId: number, score: number) => {
    setPreviousRevealLevel(calculateRevealLevel(sections));
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
  }, [sections]);

  // Check if all sections are completed
  const allSectionsCompleted = useCallback(() => {
    return sections.every(section => section.completed && section.score >= 90);
  }, [sections]);

  // Go to previous question
  const goToPreviousQuestion = useCallback((sectionId: number, currentQuestionIndex: number) => {
    if (currentQuestionIndex > 0) {
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, currentQuestion: currentQuestionIndex - 1 }
          : section
      ));
    }
  }, []);

  // Load progress from localStorage
  const loadStoredProgress = useCallback(() => {
    // No need to restore questions, currentQuestion, or userAnswers
    // Only restore completed and score for each section if needed elsewhere
    // (Currently, this is not used for restoring questions or currentQuestion)
  }, []);

  useEffect(() => {
    const { loadedSections } = loadProgress();

    async function fetchAndSetDynamicSections() {
      // Fetch Trắc Nghiệm 1
      const res1 = await fetch("/api/questions/combined/trac_nghiem_1");
      const questions1 = await res1.json();

      // Fetch Trắc Nghiệm 2
      const res2 = await fetch("/api/questions/combined/trac_nghiem_2");
      const questions2 = await res2.json();

      // Map to QuizSection format
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
        }
        // Add Đúng Sai section here later if needed
      ];

      // If we have loadedSections, only restore completed and score
      if (loadedSections && loadedSections.length > 0) {
        const mergedSections = newSections.map((section) => {
          const existing = loadedSections.find((s: any) => s.id === section.id);
          if (existing) {
            return {
              ...section,
              completed: existing.completed,
              score: existing.score,
              currentQuestion: 0, // always start at first question
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
    previousRevealLevel,
    personalLetter,
    getCurrentSection,
    getNextSectionId,
    startQuiz,
    answerQuestion,
    goToPreviousQuestion,
    calculateScore,
    completeSection,
    getImageRevealLevel,
    allSectionsCompleted,
    loadStoredProgress
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}