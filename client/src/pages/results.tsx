import { useParams, Link } from "wouter";
import { useQuiz } from "@/contexts/quiz-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Check, Eye } from "lucide-react";
import AnswerReview from "@/components/answer-review";

export default function Results() {
  const { sectionId } = useParams();
  const { 
    getCurrentSection, 
    getNextSectionId, 
    calculateScore, 
    completeSection,
    getImageRevealLevel,
    previousRevealLevel
  } = useQuiz();
  
  const [showAnswers, setShowAnswers] = useState(false);
  
  const currentSection = getCurrentSection(Number(sectionId));
  const nextSectionId = getNextSectionId(Number(sectionId));
  const nextSection = getCurrentSection(nextSectionId);
  
  const score = calculateScore(Number(sectionId));
  const scorePercent = Math.round(score.percent);
  const currentRevealLevel = getImageRevealLevel();
  const unlocked = scorePercent >= 90 && currentRevealLevel > previousRevealLevel;
  
  useEffect(() => {
    if (currentSection && !currentSection.completed && scorePercent >= 90) {
      completeSection(Number(sectionId), scorePercent);
    }
  }, [currentSection, scorePercent, sectionId, completeSection]);
  
  if (!currentSection) {
    return <div>Section not found</div>;
  }
  
  return (
    <section className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Trophy className="text-success text-2xl" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Hoàn thành!</h2>
            <p className="text-gray-600 mb-4">Bạn đã hoàn thành phần thi "{currentSection.title}"</p>
            
            {/* Score */}
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path 
                    className="stroke-current text-gray-200" 
                    strokeWidth="3" 
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path 
                    className="stroke-current text-success" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray={`${scorePercent}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${scorePercent}, 100` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{scorePercent}%</span>
                  <span className="text-sm text-gray-500">Điểm số</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-primary">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">Câu đúng</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-error">{score.incorrect}/{score.total}</div>
                <div className="text-xs text-gray-500">Câu sai</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-gray-700">{score.timeMinutes}:{score.timeSeconds}</div>
                <div className="text-xs text-gray-500">Thời gian</div>
              </div>
            </motion.div>
            
            {/* Unlock Notice */}
            {unlocked && (
              <motion.div 
                className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-unlock-alt text-primary"></i>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-primary">Mở khóa thành công!</h3>
                    <p className="text-sm text-gray-600">Bạn đã mở khóa {currentRevealLevel}% hình ảnh bí mật</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* View Answers Button - Moved above the action buttons */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 py-3"
                onClick={() => setShowAnswers(!showAnswers)}
              >
                <Eye className="h-5 w-5" />
                {showAnswers ? 'Ẩn đáp án' : 'Xem đáp án'}
              </Button>
            </div>
            
            {/* Actions - Centered buttons */}
            <div className="flex justify-center space-x-4">
              <Link href={`/quiz/${sectionId}`} className="w-1/3">
                <Button 
                  variant="outline" 
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium"
                >
                  Làm lại
                </Button>
              </Link>
              
              {nextSection ? (
                <Link href={nextSection ? `/quiz/${nextSectionId}` : "/quiz-selection"} className="w-1/3">
                  <Button 
                    className="w-full px-4 py-3 bg-primary text-white font-medium"
                  >
                    Tiếp tục
                  </Button>
                </Link>
              ) : (
                <Link href="/reward" className="w-1/3">
                  <Button 
                    className="w-full px-4 py-3 bg-primary text-white font-medium"
                  >
                    Xem phần thưởng
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Answer Review Component */}
        {showAnswers && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <AnswerReview sectionId={Number(sectionId)} />
          </motion.div>
        )}
        
        {/* Next Section Preview */}
        {nextSection && (
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-3">Phần thi tiếp theo</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-flag text-primary text-xl"></i>
              </div>
              <div>
                <h4 className="font-medium">{nextSection.title}</h4>
                <p className="text-sm text-gray-600">{nextSection.questions.length} câu hỏi</p>
              </div>
              <Link href={`/quiz/${nextSectionId}`}>
                <Button className="ml-auto px-3 py-1 bg-primary text-white text-sm">
                  Bắt đầu
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
