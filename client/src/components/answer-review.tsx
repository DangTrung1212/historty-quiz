import { useState } from 'react';
import { useMultipleChoiceQuiz } from '@/contexts/MultipleChoiceQuizContext';
import { QuizSection, Question } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerReviewProps {
  sectionId: number;
}

export default function AnswerReview({ sectionId }: AnswerReviewProps) {
  const { getCurrentSection, userAnswers } = useMultipleChoiceQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const section = getCurrentSection(Number(sectionId));
  const sectionAnswers = userAnswers[Number(sectionId)] || {};
  
  if (!section) {
    return null;
  }
  
  const totalQuestions = section.questions.length;
  const question = section.questions[currentQuestionIndex];
  const userAnswer = sectionAnswers[currentQuestionIndex] || null;
  const isCorrect = userAnswer === question.correctOptionId;
  
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
  
  // Find the correct option text
  const correctOption = question.options.find(option => option.id === question.correctOptionId);
  // Find the user's selected option text
  const selectedOption = question.options.find(option => option.id === userAnswer);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-4">Xem đáp án</h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}</span>
          <span className={isCorrect ? 'text-success' : 'text-error'}>
            {isCorrect ? 'Đúng' : 'Sai'}
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
          <h4 className="font-medium text-gray-800 mb-4">{question.text}</h4>
          
          <div className="space-y-3 mb-6">
            {question.options.map(option => {
              const isCorrectOption = option.id === question.correctOptionId;
              const isUserSelected = option.id === userAnswer;
              
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
          
          {!isCorrect && (
            <div className="text-sm bg-indigo-50 p-3 rounded-md">
              <p className="font-medium text-primary mb-1">Giải thích:</p>
              <p className="text-gray-700">
                Câu trả lời đúng là: <span className="font-medium">{correctOption?.text}</span>.
                {userAnswer ? ` Bạn đã chọn: ${selectedOption?.text}` : ' Bạn chưa chọn câu trả lời.'}
              </p>
            </div>
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