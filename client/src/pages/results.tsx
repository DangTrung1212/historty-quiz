import { useParams, Link, useLocation } from "wouter";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useDungSaiQuiz } from "@/contexts/DungSaiQuizContext"; // Import DungSaiQuizContext
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Check, Eye, ChevronRight, X as XIcon } from "lucide-react";
import AnswerReview from "@/components/answer-review";
import ProgressModal from '@/components/progress-modal';

export default function Results() {
  const { sectionId } = useParams();
  const { 
    getCurrentSection: getMultipleChoiceSection, // Renamed to avoid conflict
    getNextSectionId, 
    calculateScore: calculateMultipleChoiceScore, // Renamed to avoid conflict
    completeSection,
    sections,
  } = useMultipleChoiceQuiz();
  const { dungSaiSection, calculateDungSaiScore, resetDungSaiSection } = useDungSaiQuiz(); // Get DungSaiQuiz context and add resetDungSaiSection
  // const { getImageRevealLevel, previousRevealLevel } = useProgress(); // Commented for fast release
  const [, setLocation] = useLocation();
  
  const [showAnswers, setShowAnswers] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  const currentSection = getMultipleChoiceSection(Number(sectionId));
  const isDungSai = currentSection?.title === "Trắc Nghiệm Đúng Sai";
  console.log("Results Page: isDungSai", isDungSai); // Log isDungSai

  // Conditionally get section data and calculate score based on quiz type
  const sectionData = isDungSai ? dungSaiSection : currentSection;
  const score = isDungSai ? calculateDungSaiScore() : calculateMultipleChoiceScore(Number(sectionId));
  console.log("Results Page: Score", score); // Log score
  if (isDungSai) {
    console.log("DungSaiQuiz: dungSaiSection", dungSaiSection);
    console.log("DungSaiQuiz: userAnswers", dungSaiSection?.userAnswers);
    console.log("DungSaiQuiz: questions", dungSaiSection?.questions);
  }
  const scorePercent = Math.round(isDungSai ? score : (score as any).percent); // Score is already percent for DungSai
  console.log("Results Page: Score Percent", scorePercent); // Log scorePercent
  
  // Pass compatible section data to getImageRevealLevel
  // const sectionsForReveal = sectionData ? [{ 
  //   id: Number(sectionId), 
  //   title: currentSection?.title || '',
  //   questions: sectionData.questions, // Include questions
  //   completed: sectionData.completed, // Include completed
  //   score: sectionData.score, // Include score
  //   currentQuestion: isDungSai ? (sectionData as any).currentQuestion : currentSection?.currentQuestion || 0 // Include currentQuestion
  // }] : [];
  // const currentRevealLevel = getImageRevealLevel(sectionsForReveal as any); // Cast to any for now, will fix type later
  
  // const unlocked = scorePercent >= 90 && currentRevealLevel > previousRevealLevel; // Commented for fast release
  const isPassed = scorePercent >= 90;
  
  useEffect(() => {
    if (!sectionData) return;
    // Only update if the new score is higher, or if not completed and passed
    // Need to adjust this logic for DungSaiQuiz if its score is not stored in the same way
    if (!isDungSai && ((scorePercent > (sectionData.score || 0)) || (!sectionData.completed && scorePercent >= 90))) {
       completeSection(Number(sectionId), scorePercent);
    }
    // TODO: Add logic to update progress for DungSaiQuiz
  }, [sectionData, scorePercent, sectionId, completeSection, isDungSai]);
  
  if (!sectionData) {
    return <div>Section not found</div>;
  }
  console.log("Results Page: Section Data", sectionData); // Log sectionData
  console.log("Results Page: User Answers (from DungSaiContext if isDungSai)", dungSaiSection?.userAnswers); // Log DungSai user answers
  
  // Adjust score display for DungSaiQuiz
  let correctCount, incorrectCount, totalQuestionsDisplay;
  if (isDungSai && dungSaiSection) {
    // Calculate correct/incorrect for DungSai
    let correct = 0;
    let incorrect = 0;
    let total = 0;
    dungSaiSection.questions.forEach((q, idx) => {
      const userAns = dungSaiSection.userAnswers[idx] || {};
      for (const key in q.statements) {
        total++;
        const correctAnswer = q.correctMap[key] ? 'Đúng' : 'Sai';
        if (userAns[key]) {
          if (userAns[key] === correctAnswer) {
            correct++;
          } else {
            incorrect++;
          }
        }
      }
    });
    correctCount = correct;
    incorrectCount = incorrect;
    totalQuestionsDisplay = total;
  } else {
    correctCount = (score as any).correct;
    incorrectCount = (score as any).incorrect;
    totalQuestionsDisplay = (score as any).total;
  }
  const timeDisplay = isDungSai ? 'N/A' : `${(score as any).timeMinutes}:${(score as any).timeSeconds}`; // Cast to any

  const nextSectionId = getNextSectionId(Number(sectionId));
  const nextSection = getMultipleChoiceSection(nextSectionId); // Still use multiple choice context for next section

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
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {isPassed ? (
                <Trophy className="text-success text-2xl" />
              ) : (
                <XIcon className="text-error text-2xl" />
              )}
            </motion.div>
            <h2 className={`text-xl font-bold mb-2 ${isPassed ? 'text-success' : 'text-error'}`}>
              {isPassed ? 'Đạt yêu cầu!' : 'Chưa đạt'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isPassed
                ? 'Bạn đã vượt qua phần thi này!'
                : 'Bạn chưa đạt điểm tối thiểu. Hãy thử lại để cải thiện kết quả.'}
            </p>
            
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
                <div className="text-xl font-bold text-primary">{correctCount}/{totalQuestionsDisplay}</div>
                <div className="text-xs text-gray-500">Câu đúng</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-error">{incorrectCount}/{totalQuestionsDisplay}</div>
                <div className="text-xs text-gray-500">Câu sai</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xl font-bold text-gray-700">{timeDisplay}</div>
                <div className="text-xs text-gray-500">Thời gian</div>
              </div>
            </motion.div>
            
            {/* Unlock Notice */}
            {/*
            {unlocked && (
              <motion.div 
                className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 cursor-pointer"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
                onClick={() => setShowProgressModal(true)}
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
            */}
            
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
              {isDungSai ? (
                <Button
                  variant="outline"
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium"
                  onClick={() => {
                    resetDungSaiSection();
                    setLocation(`/quiz/${sectionId}`);
                  }}
                >
                  Làm lại
                </Button>
              ) : (
                <Link href={`/quiz/${sectionId}`} className="w-1/3">
                  <Button
                    variant="outline"
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium"
                  >
                    Làm lại
                  </Button>
                </Link>
              )}
              
              {nextSection ? (
                <Link href={nextSection ? `/quiz/${nextSectionId}` : "/quiz-selection"} className="w-1/3">
                  <Button 
                    className="w-full px-4 py-3 bg-primary text-white font-medium"
                  >
                    Tiếp tục
                  </Button>
                </Link>
              ) : (
                <>
                {/*
                <Link href="/reward" className="w-1/3">
                  <Button 
                    className="w-full px-4 py-3 bg-primary text-white font-medium"
                  >
                    Xem phần thưởng
                  </Button>
                </Link>
                */}
                </>
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
            {/* Pass sectionId and isDungSai to AnswerReview */}
            <AnswerReview sectionId={Number(sectionId)} isDungSai={isDungSai} />
          </motion.div>
        )}
        
        {/* Next Section Preview - Made Entire Section Clickable */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h3 className="font-semibold mb-3 text-gray-800">Chọn Phần Thi Khác</h3>
            <div className="space-y-3">
              {sections.filter(s => s.id !== Number(sectionId)).map(section => (
                <Link key={section.id} href={`/quiz/${section.id}`} className="block">
                  <div className="flex items-center transition active:scale-95 active:bg-primary/10 rounded-lg cursor-pointer p-3 hover:bg-primary/5">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-flag text-primary text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-gray-600">{section.questions.length} câu hỏi</p>
                    </div>
                    <div className="ml-auto text-primary">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      {/* Progress Modal */}
      {/* <ProgressModal open={showProgressModal} onOpenChange={setShowProgressModal} /> */}
    </section>
  );
}
