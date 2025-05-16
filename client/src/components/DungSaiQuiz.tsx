import React, { useState, useEffect } from 'react';
import { useDungSaiQuiz } from '@/contexts/DungSaiQuizContext';
import { motion } from 'framer-motion'; // For animations

// Example props, replace with your actual data structure as needed
type Statement = {
  id: string;
  label: string;
};

type DungSaiQuizProps = {
  passage: string;
  statements: Statement[];
  onBack: () => void;
  onNext: (answers: Record<string, 'Đúng' | 'Sai'>) => void;
};

const DungSaiQuiz: React.FC<DungSaiQuizProps> = ({
  passage,
  statements,
  onBack,
  onNext,
}) => {
  const { dungSaiSection } = useDungSaiQuiz(); // Get context
  const currentQuestion = dungSaiSection?.currentQuestion || 0;
  const totalQuestions = dungSaiSection?.questions.length || 0;
  const isLast = currentQuestion >= totalQuestions - 1; // Calculate isLast from context

  const [answers, setAnswers] = useState<Record<string, 'Đúng' | 'Sai'>>({});

  // Reset answers or load previous answers when the question changes
  useEffect(() => {
    const newAnswers = dungSaiSection?.userAnswers[currentQuestion] || {};
    if (JSON.stringify(answers) !== JSON.stringify(newAnswers)) {
      setAnswers(newAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, dungSaiSection]);

  const handleSelect = (statementId: string, value: 'Đúng' | 'Sai') => {
    setAnswers((prev) => ({ ...prev, [statementId]: value }));
  };

  // Reference to the passage container
  const passageRef = React.useRef<HTMLDivElement>(null);

  const handleNext = () => {
    // First update to the next question
    onNext(answers);
    
    // Then scroll to top after a small delay to ensure the new question is rendered
    setTimeout(() => {
      // Scroll page to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Also scroll the passage to top
      if (passageRef.current) {
        passageRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  // Check if all statements have been answered
  const allAnswered = statements.every(s => answers[s.id]);

  return (
    <div className="dung-sai-quiz-container container max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-romantic p-6 space-y-6 border-2 border-purple-100/50 hover:shadow-romantic transition-all duration-300">
      {/* Passage */}
      <motion.div 
        ref={passageRef}
        className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-l-4 border-purple-400 rounded-xl p-5 max-h-60 overflow-y-auto shadow-sm relative overflow-hidden group"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <strong className="block mb-3 text-purple-800 font-medium text-sm uppercase tracking-wider flex items-center">
          <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tư liệu
        </strong>
        <p className="text-sm text-purple-800/90 leading-relaxed relative z-10">{passage}</p>
      </motion.div>

      {/* Statements */}
      <div className="space-y-4">
        {statements.map((statement, idx) => (
          <motion.div 
            className="group relative p-0.5 rounded-xl bg-gradient-to-r from-purple-100/50 to-pink-100/50 hover:from-purple-200/50 hover:to-pink-200/50 transition-all duration-300"
            key={statement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: idx * 0.05,
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-purple-100/50 group-hover:border-purple-200 transition-colors duration-300">
              <p className="text-purple-900 font-medium flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-sm flex-shrink-0 mt-0.5">
                  {String.fromCharCode(97 + idx)}
                </span>
                <span className="leading-relaxed">{statement.label}</span>
              </p>
              <div className="flex gap-3 mt-3 ml-9">
                {(['Đúng', 'Sai'] as const).map((option) => {
                  const isSelected = answers[statement.id] === option;
                  return (
                    <motion.button
                      key={option}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelect(statement.id, option)}
                      className={`option-btn flex-1 py-2 px-4 border-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden
                        ${isSelected
                          ? 'border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-romantic-sm'
                          : 'border-purple-100 text-purple-700 hover:border-purple-200 hover:bg-white/50'}`}
                    >
                      {isSelected && (
                        <motion.div 
                          className="absolute inset-0 bg-white/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center">
                        {option === 'Đúng' ? (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSelected ? 2 : 1.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSelected ? 2 : 1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {option}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Navigation Button at the bottom */}
      <div className="flex justify-end pt-2">
        <motion.button
          type="button"
          onClick={handleNext}
          disabled={!allAnswered}
          whileHover={allAnswered ? { scale: 1.02 } : {}}
          whileTap={allAnswered ? { scale: 0.98 } : {}}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
            allAnswered 
              ? 'text-white shadow-romantic hover:shadow-romantic-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {allAnswered && (
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300"
              initial={{ opacity: 1 }}
              whileHover={{ opacity: 0.9 }}
            />
          )}
          <span className="relative z-10 flex items-center">
            {isLast ? 'Xem kết quả' : 'Tiếp theo'}
            <svg 
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${allAnswered ? 'group-hover:translate-x-1' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLast ? "M13 7l5 5m0 0l-5 5m5-5H4" : "M14 5l7 7m0 0l-7 7m7-7H3"} />
            </svg>
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default DungSaiQuiz;
