export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface QuizSection {
  id: number;
  title: string;
  questions: Question[];
  completed: boolean;
  score: number;
  currentQuestion: number;
}
