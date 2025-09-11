import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { loadProgress, saveProgress } from '@/lib/storage';
import { useMultipleChoiceQuiz } from './MultipleChoiceQuizContext';

interface SectionProgress {
  completed: boolean;
  highScoreAchieved: boolean;
  highestScore: number;
}

interface OverallProgress {
  sections: Record<number, SectionProgress>;
}

interface ProgressContextType {
  progress: OverallProgress;
  updateSectionProgress: (sectionId: number, scorePercent: number) => void;
  getImageRevealLevel: () => number;
  allSectionsCompleted: () => boolean;
  personalLetter: string;
  getSectionStatus: (sectionId: number) => SectionProgress | undefined;
  getSectionHighestScore: (sectionId: number) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const PROGRESS_STORAGE_KEY = 'overallQuizProgress';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { sections: quizSections } = useMultipleChoiceQuiz();

  const [progress, setProgress] = useState<OverallProgress>(() => {
    const savedProgress = loadProgress(PROGRESS_STORAGE_KEY);
    console.log("[ProgressContext Init] Attempting initial load:", savedProgress);
    const initialState: OverallProgress = { sections: {} };
    if (savedProgress) {
        Object.keys(savedProgress.sections).forEach(key => {
            const sectionId = Number(key);
            const savedSection = savedProgress.sections[sectionId];
            initialState.sections[sectionId] = {
                completed: savedSection.completed || false,
                highScoreAchieved: savedSection.highScoreAchieved || false,
                highestScore: savedSection.highestScore || 0
            };
        });
    }
    console.log("[ProgressContext Init] Computed initial state:", initialState);
    return initialState;
  });

  useEffect(() => {
    const sectionsAvailable = quizSections.length > 0;
    if (!sectionsAvailable) {
      console.log("[ProgressContext Effect] Skipping sync, quizSections not yet available.");
      return;
    }

    const needsInitializationOrSync = quizSections.some(qs => !progress.sections[qs.id]);

    if (needsInitializationOrSync) {
      console.log("[ProgressContext Effect] quizSections available and progress needs sync. Syncing state...", quizSections);
      setProgress(currentProgress => {
        const latestSavedProgress = loadProgress(PROGRESS_STORAGE_KEY);
        const newProgressState: OverallProgress = { sections: {} };

        quizSections.forEach(section => {
          const sectionId = section.id;
          const existingState = currentProgress.sections[sectionId];
          const savedState = latestSavedProgress?.sections[sectionId];

          newProgressState.sections[sectionId] = 
            existingState || 
            savedState || 
            { completed: false, highScoreAchieved: false, highestScore: 0 };
        });

        console.log("[ProgressContext Effect] Synced progress state computed:", newProgressState);
        
        if (JSON.stringify(newProgressState.sections) !== JSON.stringify(currentProgress.sections)) {
           saveProgress(PROGRESS_STORAGE_KEY, newProgressState);
           console.log("[ProgressContext Effect] Saved synced state to localStorage.");
           return newProgressState;
        } else {
          console.log("[ProgressContext Effect] No change detected after sync computation, state remains the same.");
          return currentProgress;
        }
      });
    } else {
       console.log("[ProgressContext Effect] Progress state already seems synced with quizSections.");
    }
  }, [quizSections]);

  const [personalLetter] = useState(`Gửi bạn,

Chúc mừng bạn đã hoàn thành thành công tất cả các phần thi lịch sử! Đây không chỉ là kiến thức để chuẩn bị cho kỳ thi THPT Quốc gia, mà còn là hành trang giúp bạn hiểu sâu sắc hơn về lịch sử dân tộc và thế giới.

Mỗi sự kiện trong lịch sử đều có những bài học quý giá, và việc bạn dành thời gian nghiêm túc học tập như vậy thực sự đáng ngưỡng mộ. Hi vọng những điều bạn học được sẽ không chỉ giúp bạn trong kỳ thi sắp tới mà còn theo bạn trên mọi chặng đường trong tương lai.

Chúc bạn đạt được kết quả cao nhất trong kỳ thi!

Trân trọng`);

  const updateSectionProgress = useCallback((sectionId: number, scorePercent: number) => {
    console.log(`[ProgressContext] updateSectionProgress called for section ${sectionId} with score ${scorePercent}%`);
    
    setProgress(currentProgress => {
      const sectionExists = currentProgress.sections[sectionId];
      if (!sectionExists) {
        console.warn(`[ProgressContext] Attempted to update progress for non-existent section ID: ${sectionId}`);
        return currentProgress;
      }

      const isHighScore = scorePercent >= 90;

      console.log(`[ProgressContext] Checking condition for section ${sectionId}:`);
      console.log(`  - Current state for section ${sectionId} BEFORE check:`, sectionExists);
      console.log(`  - sectionExists.completed: ${sectionExists.completed}`);
      console.log(`  - isHighScore (score >= 90%): ${isHighScore}`);
      console.log(`  - sectionExists.highScoreAchieved: ${sectionExists.highScoreAchieved}`);
      const shouldUpdate = !sectionExists.completed || (isHighScore && !sectionExists.highScoreAchieved);
      console.log(`  - Should update/save?: ${shouldUpdate}`);

      if (shouldUpdate) {
        console.log(`[ProgressContext] Condition met for section ${sectionId}. Preparing to save.`);
        
        // Calculate the new highest score
        const currentHighest = sectionExists.highestScore || 0; // Default to 0 if undefined
        const newHighestScore = Math.max(currentHighest, scorePercent);

        const newProgressData: OverallProgress = {
          ...currentProgress,
          sections: {
            ...currentProgress.sections,
            [sectionId]: {
              completed: true, 
              highScoreAchieved: sectionExists.highScoreAchieved || isHighScore,
              highestScore: newHighestScore,
            },
          },
        };
        console.log("[ProgressContext] >>> Reached point of saving data:", newProgressData);
        saveProgress(PROGRESS_STORAGE_KEY, newProgressData); 
        console.log("[ProgressContext] Progress updated AND saved to localStorage:", newProgressData);
        return newProgressData;
      } else {
        console.log(`[ProgressContext] Condition NOT met for section ${sectionId}. No update needed/saved.`);
      }
      return currentProgress;
    });
  }, []);

  const getImageRevealLevel = useCallback(() => {
    const completedWithHighScore = Object.values(progress.sections).filter(
      (s) => s.completed && s.highScoreAchieved
    ).length;
    const totalSections = quizSections.length;
    if (totalSections === 0) return 0;
    return Math.min(Math.floor((completedWithHighScore / totalSections) * 100), 100);
  }, [progress, quizSections]);

  const allSectionsCompleted = useCallback(() => {
    if (quizSections.length === 0) return false;
    return quizSections.every(
      (section) => progress.sections[section.id]?.completed && progress.sections[section.id]?.highScoreAchieved
    );
  }, [progress, quizSections]);

  const getSectionStatus = useCallback((sectionId: number): SectionProgress | undefined => {
    return progress.sections[sectionId];
  }, [progress]);

  const getSectionHighestScore = useCallback((sectionId: number): number => {
    return progress.sections[sectionId]?.highestScore || 0;
  }, [progress]);

  const value = {
    progress,
    updateSectionProgress,
    getImageRevealLevel,
    allSectionsCompleted,
    personalLetter,
    getSectionStatus,
    getSectionHighestScore,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 