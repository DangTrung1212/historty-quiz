// Modularized logic for Multiple Choice quiz type
import { QuizSection } from "../lib/quiz-data";

export function calculateMultipleChoiceScore(section: QuizSection, userAnswers: Record<number, string>) {
  let correct = 0;
  let total = section.questions.length;
  for (let i = 0; i < total; i++) {
    const question = section.questions[i];
    const userAnswer = userAnswers[i];
    if (userAnswer && userAnswer === question.correctOptionId) {
      correct++;
    }
  }
  const incorrect = total - correct;
  const percent = (correct / total) * 100;
  return { correct, incorrect, total, percent };
}