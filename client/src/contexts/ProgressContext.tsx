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

// Define the return type for the refactored updateSectionProgress
interface UpdateProgressResult {
  updatedProgress: OverallProgress;
  newRevealLevel: number;
  newAllSectionsCompleted: boolean;
} 

interface ProgressContextType {
  progress: OverallProgress;
  updateSectionProgress: (sectionId: number, scorePercent: number) => UpdateProgressResult | null; // Modified return type
  getImageRevealLevel: () => number; // This will now primarily be used for initial/memoized values
  allSectionsCompleted: () => boolean; // Similar to above
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

  // Helper function to calculate reveal level based on a given progress object
  const calculateRevealLevelForProgress = useCallback((currentProgressData: OverallProgress) => {
    if (quizSections.length === 0) return 0;
    const completedWithHighScore = Object.values(currentProgressData.sections).filter(
      (s) => s.completed && s.highScoreAchieved
    ).length;
    return Math.min(Math.floor((completedWithHighScore / quizSections.length) * 100), 100);
  }, [quizSections]);

  // Helper function to calculate all sections completed based on a given progress object
  const calculateAllSectionsCompletedForProgress = useCallback((currentProgressData: OverallProgress) => {
    if (quizSections.length === 0) return false;
    return quizSections.every(
      (section) => currentProgressData.sections[section.id]?.completed && currentProgressData.sections[section.id]?.highScoreAchieved
    );
  }, [quizSections]);

  const updateSectionProgress = useCallback((sectionId: number, scorePercent: number): UpdateProgressResult | null => {
    let result: UpdateProgressResult | null = null;
    setProgress(currentProgress => {
      const sectionState = currentProgress.sections[sectionId];
      if (!sectionState) {
        console.warn(`[ProgressContext] Attempted to update progress for non-existent section ID: ${sectionId}. Current progress:`, currentProgress);
        // Ensure quizSections are loaded before trying to access them for default state
        if (quizSections.length > 0 && !quizSections.find(qs => qs.id === sectionId)) {
            console.error(`[ProgressContext] Section ID ${sectionId} does not exist in quizSections either.`);
            // Decide how to handle: return currentProgress or throw error, or try to initialize if safe
        }
        // If sectionState is truly missing, and we expect it, this indicates a sync issue.
        // For now, we prevent update to avoid further errors.
        return currentProgress; 
      }

      const isHighScore = scorePercent >= 90;
      const shouldUpdate = !sectionState.completed || (isHighScore && !sectionState.highScoreAchieved);

      if (shouldUpdate) {
        const currentHighest = sectionState.highestScore || 0;
        const newHighestScore = Math.max(currentHighest, scorePercent);

        const newProgressData: OverallProgress = {
          ...currentProgress,
          sections: {
            ...currentProgress.sections,
            [sectionId]: {
              completed: true,
              highScoreAchieved: sectionState.highScoreAchieved || isHighScore,
              highestScore: newHighestScore,
            },
          },
        };
        
        saveProgress(PROGRESS_STORAGE_KEY, newProgressData);
        console.log("[ProgressContext] Progress updated AND saved to localStorage:", newProgressData);
        
        // Calculate new reveal level and completion status based on newProgressData
        const newRevealLevel = calculateRevealLevelForProgress(newProgressData);
        const newAllSectionsCompleted = calculateAllSectionsCompletedForProgress(newProgressData);
        
        result = {
            updatedProgress: newProgressData,
            newRevealLevel,
            newAllSectionsCompleted
        };
        return newProgressData; // Update state
      } else {
        console.log(`[ProgressContext] Condition NOT met for section ${sectionId}. No update needed/saved.`);
        // Result remains null if no update
      }
      return currentProgress; // No state update
    });
    return result; // Return the captured result (or null if no update occurred)
  }, [quizSections, calculateRevealLevelForProgress, calculateAllSectionsCompletedForProgress]);

  // getImageRevealLevel and allSectionsCompleted now use the internal state primarily for on-load/display purposes
  const getImageRevealLevel = useCallback(() => {
    return calculateRevealLevelForProgress(progress); // Uses the helper with current state
  }, [progress, calculateRevealLevelForProgress]);

  const allSectionsCompleted = useCallback(() => {
    return calculateAllSectionsCompletedForProgress(progress); // Uses the helper with current state
  }, [progress, calculateAllSectionsCompletedForProgress]);

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