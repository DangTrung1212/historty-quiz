import { QuizSection } from './quiz-data';

const STORAGE_KEY = 'quiz_progress';

// Save only minimal quiz progress to localStorage
export function saveProgress(
  sections: QuizSection[]
) {
  try {
    // Only save id, completed, and score for each section
    const minimalSections = sections.map(s => ({
      id: s.id,
      completed: s.completed,
      score: s.score,
    }));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        sections: minimalSections,
        lastUpdated: new Date().toISOString(),
      })
    );
    return true;
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
    return false;
  }
}

// Load minimal quiz progress from localStorage
export function loadProgress(): {
  loadedSections: { id: number; completed: boolean; score: number }[] | null;
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
