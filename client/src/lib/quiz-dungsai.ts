// Modularized logic for DungSai (True/False) quiz type
import { DungSaiQuestion } from "../contexts/DungSaiQuizContext";

export function calculateDungSaiScore(questions: DungSaiQuestion[], userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>): number {
  let totalScore = 0;
  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx] || {};
    let incorrectCount = 0;
    let totalStatements = Object.keys(q.statements).length;
    let correctCount = 0;
    for (const key in q.statements) {
      const correct = q.correctMap[key] ? 'Đúng' : 'Sai';
      if (userAns[key]) {
        if (userAns[key] !== correct) {
          incorrectCount++;
        } else {
          correctCount++;
        }
      } else {
        // If not answered, treat as incorrect
        incorrectCount++;
      }
    }
    // All correct
    if (incorrectCount === 0) totalScore += 20;
    // 1 incorrect
    else if (incorrectCount === 1) totalScore += 10;
    // 2 incorrect
    else if (incorrectCount === 2) totalScore += 5;
    // 3 incorrect
    else if (incorrectCount === 3) totalScore += 2;
    // All incorrect
    else if (incorrectCount === totalStatements) totalScore += 0;
    // Any other case (should not happen), treat as 0
    else totalScore += 0;
  });
  return totalScore;
}

export function isDungSaiQuestionAnswered(question: DungSaiQuestion, userAnswers: Record<string, 'Đúng' | 'Sai'>): boolean {
  const totalStatements = Object.keys(question.statements).length;
  const answeredStatements = Object.keys(userAnswers || {}).length;
  return answeredStatements === totalStatements;
}