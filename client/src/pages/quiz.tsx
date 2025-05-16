import { useParams, useLocation, Link } from "wouter";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import QuizOption from "@/components/quiz-option";
import ProgressIndicator from "@/components/progress-indicator";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DungSaiQuiz from "@/components/DungSaiQuiz";
import { useDungSaiQuiz } from "@/contexts/DungSaiQuizContext";

export default function Quiz() {
  const { sectionId } = useParams();
  const sectionIdNum = Number(sectionId); // Get numeric ID
  const [, setLocation] = useLocation();
  const { sections, getCurrentSection, startQuiz, answerQuestion, goToPreviousQuestion, userAnswers, resetSection } = useMultipleChoiceQuiz();
  const { 
    dungSaiSection, 
    setDungSaiSection, 
    isCurrentQuestionAnswered, 
    answerDungSaiQuestion, 
    resetDungSaiSection // Import reset function
  } = useDungSaiQuiz(); 
  
  const currentSection = getCurrentSection(sectionIdNum);
  const isDungSai = currentSection?.title === "Trắc Nghiệm Đúng Sai";

  // Effect to reset DungSai state when navigating to section 3
  useEffect(() => {
    if (isDungSai) {
      console.log("[Quiz Page Effect] Resetting DungSai section state.");
      resetDungSaiSection();
    }
    // Add dependencies: sectionIdNum to re-run if the section changes,
    // isDungSai to ensure the check is up-to-date,
    // resetDungSaiSection as it's called within the effect.
  }, [sectionIdNum, isDungSai, resetDungSaiSection]);

  const currentQuestionIndex = isDungSai ? dungSaiSection?.currentQuestion || 0 : currentSection?.currentQuestion || 0;
  const totalQuestions = isDungSai ? dungSaiSection?.questions.length || 0 : currentSection?.questions.length || 0;
  const questionProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<Record<string, 'Đúng' | 'Sai'> | null>(null);
  
  useEffect(() => {
    if (sectionId) {
      startQuiz(Number(sectionId));
    }
  }, [sectionId, startQuiz]);
  
  useEffect(() => {
    // Reset selected option when moving to a new question
    // This useEffect is primarily for multiple choice, will need separate logic for DungSai if needed
    if (!isDungSai) {
      setSelectedOption(
        userAnswers[currentSection?.id || 0]?.[currentQuestionIndex] || null
      );
    }
  }, [currentQuestionIndex, currentSection?.id, userAnswers, isDungSai]);
  
  useEffect(() => {
    if (
      submitting &&
      pendingAnswers &&
      dungSaiSection?.userAnswers[currentQuestionIndex] &&
      Object.entries(pendingAnswers).every(
        ([k, v]) => dungSaiSection.userAnswers[currentQuestionIndex][k] === v
      )
    ) {
      setSubmitting(false);
      setPendingAnswers(null);
      setLocation(`/results/${sectionId}`);
    }
  }, [submitting, pendingAnswers, dungSaiSection, currentQuestionIndex, setLocation, sectionId]);
  
  if (!currentSection) {
    return <div>Section not found</div>;
  }
  
  const question = currentSection.questions[currentQuestionIndex];
  
  // --- TESTING LOG --- Log current MCQ question data
  if (!isDungSai && question) {
    console.log(`[TEST] Current MCQ Question (${currentQuestionIndex+1}):`, question);
    console.log(`[TEST] Correct Option ID: ${question.correctOptionId}`);
  }
  // --- END TESTING LOG ---
  
  const statements = question.options.map(opt => ({
    id: opt.id,
    label: opt.text
  }));
  
  const handleOptionSelect = (optionId: string) => {
    console.log(`[MCQ Click] handleOptionSelect called with optionId: ${optionId}`);
    setSelectedOption(optionId);
    
    // --- TESTING LOG --- Log selected vs correct MCQ answer
    console.log(`[TEST] User selected MCQ Option ID: ${optionId}`);
    console.log(`[TEST] Correct Option ID for question ${currentQuestionIndex+1} was: ${question.correctOptionId}`);
    // --- END TESTING LOG ---
    
    setTimeout(() => {
      answerQuestion(currentSection.id, currentQuestionIndex, optionId);
      
      if (currentQuestionIndex >= totalQuestions - 1) {
        // Quiz completed, go to results
        setLocation(`/results/${sectionId}`);
      }
      // No need to handle "else" case as answerQuestion handles moving to the next question
    }, 500); // 500ms delay gives user visual feedback of selection
  };
  
  const handlePrev = () => {
    if (isDungSai) {
      // Logic for previous question in DungSaiQuizContext
      setDungSaiSection(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestion: Math.max(0, prev.currentQuestion - 1),
        };
      });
    } else {
      // Go to previous question if not at the start
      if (currentQuestionIndex > 0) {
        goToPreviousQuestion(currentSection.id, currentQuestionIndex);
      }
    }
  };
  
  const handleNext = () => {
    if (isDungSai) {
      // Logic for next question in DungSaiQuizContext
      // The actual answer storage and navigation to results is handled in DungSaiQuiz's onNext
      setDungSaiSection(prev => {
        if (!prev) return prev;
        // Only increment if not on the last question
        const nextQuestion = Math.min(prev.questions.length - 1, prev.currentQuestion + 1);
        return {
          ...prev,
          currentQuestion: nextQuestion,
        };
      });
    } else {
      // This handleNext is for multiple choice
      if (selectedOption) {
        answerQuestion(currentSection.id, currentQuestionIndex, selectedOption);
        
        if (currentQuestionIndex >= totalQuestions - 1) {
          // Quiz completed, go to results
          setLocation(`/results/${sectionId}`);
        }
      }
    }
  };
  
  if (isDungSai && !dungSaiSection) {
    return <div>Loading...</div>;
  }
  
  let dsQuestion = null;
  if (isDungSai && dungSaiSection) {
    dsQuestion = dungSaiSection.questions[currentQuestionIndex];
    // --- TESTING LOG --- Log current DungSai question data
    console.log(`[TEST] Current DungSai Question (${currentQuestionIndex+1}):`, dsQuestion);
    console.log(`[TEST] Correct Map:`, dsQuestion.correctMap);
    // --- END TESTING LOG ---
  }
  
  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Progress Indicators */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <Link href="/quiz-selection">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-purple-600 hover:bg-purple-100/50" 
                onClick={() => { if (!isDungSai) resetSection(currentSection.id); }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="font-heading font-semibold text-purple-800">{currentSection.title}</h2>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrev}
                className="h-8 w-8 text-purple-600 hover:bg-purple-100/50 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="text-sm font-medium flex items-center bg-purple-100/50 px-3 py-1 rounded-full border border-purple-200">
                <span className="text-purple-800">{currentQuestionIndex + 1}</span>
                <span className="text-purple-500 mx-1">/</span>
                <span className="text-purple-800">{totalQuestions}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                disabled={currentQuestionIndex >= totalQuestions - 1}
                onClick={handleNext}
                className="h-8 w-8 text-purple-600 hover:bg-purple-100/50 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Question Progress Bar */}
          <div className="w-full bg-purple-100/50 rounded-full h-2.5 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${questionProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      {isDungSai ? (
        dsQuestion && (
          <DungSaiQuiz
            passage={dsQuestion.passage}
            statements={Object.entries(dsQuestion.statements).map(([id, label]) => ({ id, label }))}
            onBack={handlePrev}
            onNext={(answers) => {
              // --- TESTING LOG --- Log selected vs correct DungSai answers
              console.log(`[TEST] User submitted DungSai Answers for question ${currentQuestionIndex+1}:`, answers);
              console.log(`[TEST] Correct Map for question ${currentQuestionIndex+1} was:`, dsQuestion.correctMap);
              // --- END TESTING LOG ---
              answerDungSaiQuestion(currentQuestionIndex, answers);
              if (currentQuestionIndex >= dungSaiSection!.questions.length - 1) {
                setPendingAnswers(answers);
                setSubmitting(true);
              } else {
                setDungSaiSection(prev => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    currentQuestion: currentQuestionIndex + 1,
                  };
                });
              }
            }}
          />
        )
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-md mx-auto">
            {/* Question */}
            <motion.div
              key={`question-${currentQuestionIndex}`}
              className="group relative p-0.5 rounded-xl bg-gradient-to-r from-purple-100/50 to-pink-100/50 hover:from-purple-200/50 hover:to-pink-200/50 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-purple-100/50 group-hover:border-purple-200 transition-colors duration-300">
                <h2 className="text-purple-900 font-medium text-lg leading-relaxed mb-6">
                  {question.text}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <QuizOption
                      key={option.id}
                      option={option}
                      index={index}
                      isSelected={selectedOption === option.id}
                      onSelect={() => handleOptionSelect(option.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
