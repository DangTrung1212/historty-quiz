import { useState } from 'react';
import { useMultipleChoiceQuiz } from '@/contexts/MultipleChoiceQuizContext';
import { useDungSaiQuiz, DungSaiQuestion } from '@/contexts/DungSaiQuizContext'; // Import DungSai context and types
import { QuizSection, Question as MultipleChoiceQuestion } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerReviewProps {
  sectionId: number;
  isDungSai: boolean; // Added isDungSai prop
}

export default function AnswerReview({ sectionId, isDungSai }: AnswerReviewProps) {
  console.log("AnswerReview: isDungSai prop", isDungSai); // Log isDungSai prop
  const { getCurrentSection: getMultipleChoiceSection, userAnswers: mcUserAnswers } = useMultipleChoiceQuiz();
  const { dungSaiSection } = useDungSaiQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const section = isDungSai ? dungSaiSection : getMultipleChoiceSection(Number(sectionId));
  const userAnswers = isDungSai ? dungSaiSection?.userAnswers : mcUserAnswers[Number(sectionId)];
  console.log("AnswerReview: section data", section); // Log section data
  console.log("AnswerReview: userAnswers data", userAnswers); // Log user answers data

  if (!section) {
    return null;
  }
  
  const totalQuestions = section.questions.length;
  const question = section.questions[currentQuestionIndex];
  
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  if (isDungSai) {
    const dsQuestion = question as DungSaiQuestion;
    const dsUserAnswers = userAnswers?.[currentQuestionIndex] as Record<string, 'Đúng' | 'Sai'> | undefined;
    console.log("AnswerReview (DungSai): dsUserAnswers for current question", dsUserAnswers); // Log DungSai user answers for current question

    // Calculate per-question score
    let incorrectCount = 0;
    let totalStatements = Object.keys(dsQuestion.statements).length;
    for (const key in dsQuestion.statements) {
      const correct = dsQuestion.correctMap[key] ? 'Đúng' : 'Sai';
      if (dsUserAnswers && dsUserAnswers[key]) {
        if (dsUserAnswers[key] !== correct) {
          incorrectCount++;
        }
      } else {
        // If not answered, treat as incorrect
        incorrectCount++;
      }
    }
    let questionScore = 0;
    if (incorrectCount === 0) questionScore = 20;
    else if (incorrectCount === 1) questionScore = 10;
    else if (incorrectCount === 2) questionScore = 5;
    else if (incorrectCount === 3) questionScore = 2;
    else if (incorrectCount === totalStatements) questionScore = 0;
    else questionScore = 0;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold mb-4">Xem đáp án - Trắc Nghiệm Đúng Sai</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</span>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Per-question score display */}
        <div className="mb-4 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full">
            Điểm cho câu này: {questionScore}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6"
          >
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 mb-4 max-h-40 overflow-y-auto">
              <strong className="text-gray-700 block mb-2">Tư liệu:</strong>
              <p className="text-sm text-gray-600 leading-relaxed">{dsQuestion.passage}</p>
            </div>
            <div className="space-y-3 mb-6">
              {Object.entries(dsQuestion.statements).map(([statementId, statementText]) => {
                const correctAnswer = dsQuestion.correctMap[statementId] ? 'Đúng' : 'Sai';
                const userAnswer = dsUserAnswers?.[statementId];
                const isCorrect = userAnswer === correctAnswer;
                
                let bgColor = 'bg-white';
                let borderColor = 'border-gray-200';
                let textColor = 'text-gray-700';

                if (userAnswer) {
                  if (isCorrect) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-200';
                    textColor = 'text-green-700';
                  } else {
                    bgColor = 'bg-red-50';
                    borderColor = 'border-red-200';
                    textColor = 'text-red-700';
                  }
                }
                
                return (
                  <div key={statementId} className={`p-3 border rounded-md ${bgColor} ${borderColor} ${textColor}`}>
                    <p className="mb-1">{statementText}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span>Đáp án của bạn: </span>
                        <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {userAnswer || 'Chưa trả lời'}
                        </span>
                      </div>
                      {userAnswer && (isCorrect ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />)}
                    </div>
                    {!isCorrect && userAnswer && (
                      <p className="text-xs mt-1 text-gray-600">Đáp án đúng: <span className="font-medium">{correctAnswer}</span></p>
                    )}
                     <p className="text-xs mt-1 text-gray-500">Giải thích: {dsQuestion.explanationMap[statementId]}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-4 py-2">Trước</Button>
          <Button variant="outline" onClick={handleNext} disabled={currentQuestionIndex === totalQuestions - 1} className="px-4 py-2">Tiếp theo</Button>
        </div>
      </div>
    );
  }

  // Logic for Multiple Choice Questions
  const mcQuestion = question as MultipleChoiceQuestion & { explanation?: string };
  const mcUserAnswer = userAnswers?.[currentQuestionIndex] as string | null | undefined;
  const isMcCorrect = mcUserAnswer === mcQuestion.correctOptionId;
  const correctOption = mcQuestion.options.find(option => option.id === mcQuestion.correctOptionId);
  const selectedOption = mcQuestion.options.find(option => option.id === mcUserAnswer);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-4">Xem đáp án</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</span>
          <span className={isMcCorrect ? 'text-success' : 'text-error'}>
            {isMcCorrect ? 'Đúng' : 'Sai'}
          </span>
        </div>
        
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <h4 className="font-medium text-gray-800 mb-4">{mcQuestion.text}</h4>
          
          <div className="space-y-3 mb-6">
            {mcQuestion.options.map(option => {
              const isCorrectOption = option.id === mcQuestion.correctOptionId;
              const isUserSelected = option.id === mcUserAnswer;
              
              let bgColor = 'bg-white';
              let borderColor = 'border-gray-200';
              let textColor = 'text-gray-700';
              
              if (isCorrectOption) {
                bgColor = 'bg-green-50';
                borderColor = 'border-green-200';
                textColor = 'text-green-700';
              } else if (isUserSelected) {
                bgColor = 'bg-red-50';
                borderColor = 'border-red-200';
                textColor = 'text-red-700';
              }
              
              return (
                <div 
                  key={option.id}
                  className={`p-3 border rounded-md ${bgColor} ${borderColor} ${textColor} flex items-center`}
                >
                  <div className="flex-1">{option.text}</div>
                  {isCorrectOption && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {!isCorrectOption && isUserSelected && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Explanation: now shown if mcQuestion.explanation exists, regardless of correctness */}
          {mcQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md"
            >
              <p className="text-sm text-yellow-700">
                <span className="font-semibold">Giải thích:</span> {mcQuestion.explanation}
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2"
        >
          Trước
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="px-4 py-2"
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
