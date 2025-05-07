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
  const [, setLocation] = useLocation();
  const { sections, getCurrentSection, startQuiz, answerQuestion, goToPreviousQuestion, userAnswers } = useMultipleChoiceQuiz();
  const { dungSaiSection, setDungSaiSection, isCurrentQuestionAnswered, answerDungSaiQuestion } = useDungSaiQuiz(); // Added answerDungSaiQuestion
  
  const currentSection = getCurrentSection(Number(sectionId));
  const isDungSai = currentSection?.title === "Trắc Nghiệm Đúng Sai";

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
  
  const statements = question.options.map(opt => ({
    id: opt.id,
    label: opt.text
  }));
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Short delay before moving to next question to show the selection
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
  }
  
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      {/* Progress Indicators */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <Link href="/quiz-selection">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <ChevronLeft />
              </Button>
            </Link>
            <h2 className="font-semibold text-primary">{currentSection.title}</h2>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentQuestionIndex === 0}
                onClick={handlePrev}
                className="h-8 w-8 text-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm font-medium flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <span className="text-gray-700">{currentQuestionIndex + 1}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-700">{totalQuestions}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                disabled={
                  isDungSai
                    ? !isCurrentQuestionAnswered() || currentQuestionIndex >= totalQuestions - 1
                    : !selectedOption || currentQuestionIndex >= totalQuestions - 1
                }
                onClick={handleNext}
                className="h-8 w-8 text-gray-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Question Progress Bar */}
          <Progress
            value={questionProgress}
            className="mt-2 h-1.5 bg-gray-200"
          />
        </div>
      </div>
      
      {isDungSai ? (
        dsQuestion && (
          <DungSaiQuiz
            passage={dsQuestion.passage}
            statements={Object.entries(dsQuestion.statements).map(([id, label]) => ({ id, label }))}
            onBack={handlePrev}
            onNext={(answers) => {
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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
                Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
              </span>
              <h2 className="text-lg font-medium mb-5">{question.text}</h2>

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
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
