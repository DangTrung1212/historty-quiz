// Modularized logic for DungSai (True/False) quiz type
import { DungSaiQuestion } from "../contexts/DungSaiQuizContext";

export function calculateDungSaiScore(questions: DungSaiQuestion[], userAnswers: Record<number, Record<string, 'Đúng' | 'Sai'>>): number {
  let incorrectCount = 0;
  let totalStatements = 0;
  questions.forEach((q, idx) => {
    const userAns = userAnswers[idx] || {};
    for (const key in q.statements) {
      totalStatements++;
      const correct = q.correctMap[key] ? 'Đúng' : 'Sai';
      if (userAns[key] && userAns[key] !== correct) {
        incorrectCount++;
      }
    }
  });
  if (incorrectCount === 0) return 100;
  if (incorrectCount === 1) return 50;
  if (incorrectCount === 2) return 25;
  if (incorrectCount === 3) return 10;
  if (incorrectCount === totalStatements) return 0;
  return 0;
}

export function isDungSaiQuestionAnswered(question: DungSaiQuestion, userAnswers: Record<string, 'Đúng' | 'Sai'>): boolean {
  const totalStatements = Object.keys(question.statements).length;
  const answeredStatements = Object.keys(userAnswers || {}).length;
  return answeredStatements === totalStatements;
}