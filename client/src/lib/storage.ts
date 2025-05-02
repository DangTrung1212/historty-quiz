import { QuizSection } from './quiz-data';

const STORAGE_KEY = 'quiz_progress';

// Save quiz progress to localStorage
export function saveProgress(
  sections: QuizSection[]
) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sections,
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
} {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        loadedSections: parsedData.sections || null,
      };
    }
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
  }
  return {
    loadedSections: null,
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
