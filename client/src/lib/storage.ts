import { QuizSection } from './quiz-data';

const STORAGE_KEY = 'quiz_progress';

// Save quiz progress to localStorage
export function saveProgress(
  sections: QuizSection[],
  userAnswers: Record<number, Record<number, string>>
) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sections,
        userAnswers,
        lastUpdated: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
}

// Load quiz progress from localStorage
export function loadProgress(): {
  loadedSections: QuizSection[] | null;
  loadedAnswers: Record<number, Record<number, string>> | null;
} {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        loadedSections: parsedData.sections || null,
        loadedAnswers: parsedData.userAnswers || null,
      };
    }
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
  }
  
  return {
    loadedSections: null,
    loadedAnswers: null,
  };
}

// Clear quiz progress from localStorage
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress from localStorage:', error);
    return false;
  }
}
