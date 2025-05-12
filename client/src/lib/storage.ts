// Removed QuizSection import as it's no longer directly used by save/load for OverallProgress

// Define the structures for progress, mirroring ProgressContext.tsx for clarity
interface SectionProgress {
  completed: boolean;
  highScoreAchieved: boolean;
  highestScore: number;
}

interface OverallProgress {
  sections: Record<number, SectionProgress>;
  // Optionally, you can add lastUpdated here if needed by the new structure
  // lastUpdated?: string;
}

// Save OverallProgress to localStorage under a specific key
export function saveProgress(key: string, data: OverallProgress): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving progress to localStorage (key: ${key}):`, error);
    return false;
  }
}

// Load OverallProgress from localStorage from a specific key
export function loadProgress(key: string): OverallProgress | null {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Basic validation for the OverallProgress structure
      if (parsedData && typeof parsedData.sections === 'object' && parsedData.sections !== null) {
        // Validate structure further - ensure sections have the required fields
        const sectionsAreValid = Object.values(parsedData.sections).every((section: any) => 
            typeof section === 'object' && 
            section !== null &&
            typeof section.completed === 'boolean' && 
            typeof section.highScoreAchieved === 'boolean' &&
            (typeof section.highestScore === 'number' || typeof section.highestScore === 'undefined') // Allow undefined initially
        );
        
        if (sectionsAreValid) {
            // If valid, cast and return. We handle potential undefined highestScore during load/init in context.
            return parsedData as OverallProgress;
        }
      }
      console.warn(`Data for key ${key} in localStorage does not match expected OverallProgress structure.`);
    }
  } catch (error) {
    console.error(`Error loading progress from localStorage (key: ${key}):`, error);
  }
  return null;
}

// Clear specific quiz progress from localStorage by key
export function clearProgress(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error clearing progress from localStorage (key: ${key}):`, error);
    return false;
  }
}

// --- Old functions below are now renamed and uncommented for MultipleChoiceQuizContext ---

const MCQ_STORAGE_KEY = 'quiz_progress'; // Original key for MCQ context

// To be used by MultipleChoiceQuizContext
export function saveMcqProgress(
  sections: { id: number; completed: boolean; score: number; }[] // Use simplified type matching old logic
): boolean {
  try {
    // The old saveProgress was already saving a minimal structure.
    // We keep this logic for saveMcqProgress.
    localStorage.setItem(
      MCQ_STORAGE_KEY,
      JSON.stringify({
        sections: sections, // Assumes sections passed in are already minimal
        lastUpdated: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error saving MCQ progress to localStorage:', error);
    return false;
  }
}

// To be used by MultipleChoiceQuizContext
export function loadMcqProgress(): {
  loadedSections: { id: number; completed: boolean; score: number }[] | null;
} {
  try {
    const storedData = localStorage.getItem(MCQ_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        loadedSections: parsedData.sections || null,
      };
    }
  } catch (error) {
    console.error('Error loading MCQ progress from localStorage:', error);
  }
  return {
    loadedSections: null,
  };
}

// Optional: If MultipleChoiceQuizContext used clearProgress before
// export function clearMcqProgress(): boolean {
//   try {
//     localStorage.removeItem(MCQ_STORAGE_KEY);
//     return true;
//   } catch (error) {
//     console.error('Error clearing MCQ progress from localStorage:', error);
//     return false;
//   }
// }

// Remove the QuizSection import if it was only for the old commented out saveProgress
// import { QuizSection } from './quiz-data'; // This was likely for the old saveProgress
