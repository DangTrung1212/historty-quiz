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
    setSelectedOption(optionId);
  };
  
  const handleNext = () => {
    if (selectedOption) {
      answerQuestion(currentSection.id, currentQuestion, selectedOption);
      
      if (currentQuestion < totalQuestions - 1) {
        // No need to manually set section state - answerQuestion handles this
      } else {
        // Quiz completed, go to results
        setLocation(`/results/${sectionId}`);
        return;
      }
    }
  };
  
  const handlePrev = () => {
    // Go to previous question if not at the start
    if (currentQuestion > 0) {
      goToPreviousQuestion(currentSection.id, currentQuestion);
    }
  };
  
  return (
    <section className="min-h-screen flex flex-col bg-gray-50">
      {/* Progress Indicators */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/quiz-selection">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <ChevronLeft />
              </Button>
            </Link>
            <h2 className="font-semibold text-primary">{currentSection.title}</h2>
            <div className="text-sm font-medium flex items-center">
              <span className="text-gray-600">{currentQuestion + 1}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-600">{totalQuestions}</span>
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
        <div className="max-w-md mx-auto md:mr-72 md:ml-auto">
          {/* Reward Progress Sidebar (responsive) */}
          <div className="md:fixed md:right-6 md:top-24 md:w-60 bg-white p-4 rounded-lg shadow-md mb-6 md:mb-0">
            <h3 className="font-semibold mb-3">Phần thưởng</h3>
            <div className="aspect-w-1 aspect-h-1 mb-4 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1635476654563-9e4694de1e1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Mystery reward" 
                className={`w-full h-40 object-cover blur-image reveal-${getImageRevealLevel()}`}
              />
            </div>
            
            <div className="space-y-2">
              <ProgressIndicator sections={sections} currentSectionId={currentSection.id} />
            </div>
          </div>
          
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
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              disabled={currentQuestion === 0}
              onClick={handlePrev}
              className="px-4 py-2 text-gray-600"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Trước
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              className="px-6 py-2 bg-primary text-white font-medium"
            >
              {currentQuestion < totalQuestions - 1 ? 'Tiếp theo' : 'Hoàn thành'} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
