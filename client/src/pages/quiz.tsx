import { useParams, useLocation, Link } from "wouter";
import { useQuiz } from "@/contexts/quiz-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import QuizOption from "@/components/quiz-option";
import ProgressIndicator from "@/components/progress-indicator";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Quiz() {
  const { sectionId } = useParams();
  const [, setLocation] = useLocation();
  const { sections, getCurrentSection, startQuiz, answerQuestion, goToPreviousQuestion, userAnswers, getImageRevealLevel } = useQuiz();
  
  const currentSection = getCurrentSection(Number(sectionId));
  const currentQuestion = currentSection?.currentQuestion || 0;
  const totalQuestions = currentSection?.questions.length || 0;
  const questionProgress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  useEffect(() => {
    if (sectionId) {
      startQuiz(Number(sectionId));
    }
  }, [sectionId, startQuiz]);
  
  useEffect(() => {
    // Reset selected option when moving to a new question
    setSelectedOption(
      userAnswers[currentSection?.id || 0]?.[currentQuestion] || null
    );
  }, [currentQuestion, currentSection?.id, userAnswers]);
  
  if (!currentSection) {
    return <div>Section not found</div>;
  }
  
  const question = currentSection.questions[currentQuestion];
  
  const handleOptionSelect = (optionId: string) => {
    // Just set the selected option without automatic navigation
    setSelectedOption(optionId);
  };
  
  const handlePrev = () => {
    // Go to previous question if not at the start
    if (currentQuestion > 0) {
      goToPreviousQuestion(currentSection.id, currentQuestion);
    }
  };
  
  const handleNext = () => {
    // Only allow going to next if an option is selected
    if (selectedOption) {
      answerQuestion(currentSection.id, currentQuestion, selectedOption);
      
      if (currentQuestion >= totalQuestions - 1) {
        // Quiz completed, go to results
        setLocation(`/results/${sectionId}`);
      }
    }
  };
  
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
                disabled={currentQuestion === 0}
                onClick={handlePrev}
                className="h-8 w-8 text-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-sm font-medium flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <span className="text-gray-700">{currentQuestion + 1}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-700">{totalQuestions}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                disabled={!selectedOption || currentQuestion >= totalQuestions - 1}
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
      
      {/* Quiz Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto">
          {/* Question */}
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-3">
              Câu hỏi {currentQuestion + 1}/{totalQuestions}
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
    </section>
  );
}
