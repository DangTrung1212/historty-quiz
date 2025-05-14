import { useParams, Link, useLocation } from "wouter";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useDungSaiQuiz } from "@/contexts/DungSaiQuizContext"; // Import DungSaiQuizContext
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Trophy, Check, Eye, ChevronRight, X as XIcon } from "lucide-react";
import AnswerReview from "@/components/answer-review";
import ProgressModal from '@/components/progress-modal';

export default function Results() {
  const { sectionId } = useParams();
  const sectionIdNum = Number(sectionId);
  const { 
    sections, 
    getCurrentSection: getMultipleChoiceSection,
    getNextSectionId, 
    calculateScore: calculateMultipleChoiceScore,
    completeSection,
    resetSection,
  } = useMultipleChoiceQuiz();
  const { 
    dungSaiSection, 
    calculateDungSaiScore, 
    resetDungSaiSection, 
    completeDungSaiSection,
  } = useDungSaiQuiz(); 
  const { 
    updateSectionProgress,
    getImageRevealLevel, 
    allSectionsCompleted, 
    getSectionStatus,
  } = useProgress();
  const [, setLocation] = useLocation();
  
  const [showAnswers, setShowAnswers] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Determine if the current section is DungSai based on ID or potentially title from sections array
  // Use useMemo to stabilize this value if sections array reference is stable
  const isDungSai = useMemo(() => {
      // Section 3 is assumed to be DungSai based on previous context
      return sectionIdNum === 3; 
      // Alternatively, find title if needed, but ID is more stable:
      // const foundSection = sections.find(s => s.id === sectionIdNum);
      // return foundSection?.title === "Trắc Nghiệm Đúng Sai";
  }, [sectionIdNum]); // Depend only on sectionIdNum

  // Get section data - useMemo might help stabilize references if contexts are stable
  const sectionData = useMemo(() => {
    return isDungSai ? dungSaiSection : getMultipleChoiceSection(sectionIdNum);
  }, [isDungSai, dungSaiSection, getMultipleChoiceSection, sectionIdNum]);

  // Calculate score - useMemo to stabilize
  const scoreResult = useMemo(() => {
     console.log("[Results] Recalculating score..."); // Log score calculation
     return isDungSai ? calculateDungSaiScore() : calculateMultipleChoiceScore(sectionIdNum);
  }, [isDungSai, calculateDungSaiScore, calculateMultipleChoiceScore, sectionIdNum, dungSaiSection]); // Add dungSaiSection as dependency if needed
  
  const scorePercent = useMemo(() => Math.round(isDungSai ? scoreResult : (scoreResult as any).percent), [isDungSai, scoreResult]);
  const isPassed = useMemo(() => scorePercent >= 90, [scorePercent]);

  // Get progress *before* potential update - memoize if functions are stable
  const oldRevealLevel = useMemo(() => getImageRevealLevel(), [getImageRevealLevel]);
  const wasAlreadyCompleted = useMemo(() => allSectionsCompleted(), [allSectionsCompleted]);
  
  // State for managing reward unlock effect
  const [unlocked, setUnlocked] = useState(false);
  const [showRewardNavigation, setShowRewardNavigation] = useState(false);
  
  // State to track if the effect has run for the *current* score calculation
  const [effectCompletedForScore, setEffectCompletedForScore] = useState<number | null>(null);

  useEffect(() => {
    // Check if the necessary data exists and if the effect hasn't run for this score yet
    const sectionExists = sections.some(s => s.id === sectionIdNum);
    const dataReady = sectionIdNum && sectionExists && (isDungSai ? dungSaiSection : true); // Check dungSaiSection if relevant
    
    // Only run if data is ready AND the effect hasn't completed for the current scorePercent
    if (dataReady && effectCompletedForScore !== scorePercent) { 
      
      console.log(`[Results Effect] Running effect for section ${sectionIdNum} with score ${scorePercent}%`);

      // --- Get current section data INSIDE effect ---
      // This avoids depending on the potentially unstable sectionData object reference
      const currentSectionForEffect = isDungSai ? dungSaiSection : sections.find(s => s.id === sectionIdNum);
      if (!currentSectionForEffect) {
        console.error("[Results Effect] Section data disappeared unexpectedly inside effect.");
        return; // Should not happen if dataReady check passed, but good safety check
      }
      // --------------------------------------------

      // 1. Mark the specific quiz context as completed (internal state)
      if (isDungSai) {
        completeDungSaiSection();
      } else {
        completeSection(sectionIdNum, scorePercent); 
      }

      console.log(`[Results Effect] About to call updateSectionProgress for section ${sectionIdNum} with score ${scorePercent}%`);
      
      // 2. Update the overall progress in ProgressContext (persistent state)
      updateSectionProgress(sectionIdNum, scorePercent); 

      // 3. Check for reward unlock *after* updating progress
      const newRevealLevel = getImageRevealLevel(); // Get fresh values
      const isNowCompleted = allSectionsCompleted();
      const newSliceUnlocked = scorePercent >= 90 && newRevealLevel > oldRevealLevel;
      const finalCompletion = !wasAlreadyCompleted && isNowCompleted;

      console.log(`[Results Check Inner] Section ${sectionIdNum}, Score ${scorePercent}%. Passed: ${isPassed}. Old Reveal: ${oldRevealLevel}, New Reveal: ${newRevealLevel}. New Slice: ${newSliceUnlocked}. Final Completion: ${finalCompletion}`);

      if (newSliceUnlocked && !finalCompletion) {
        setUnlocked(true);
        setShowProgressModal(true);
      }
      if (finalCompletion) {
        setShowRewardNavigation(true);
        setTimeout(() => {
          setLocation("/reward");
        }, 2000);
      }

      // Mark effect as completed for this specific score
      setEffectCompletedForScore(scorePercent);

    } else if (dataReady && effectCompletedForScore === scorePercent) {
        console.log(`[Results Effect] Skipped: Effect already completed for score ${scorePercent}`);
    } else {
        console.log(`[Results Effect] Skipped: Data not ready (sectionExists: ${sectionExists}, dataReady: ${dataReady})`);
    }

  // Dependencies: Include primitives, stable functions, and potentially stable memoized values.
  // AVOID depending on objects like sectionData or functions that change reference unnecessarily.
  }, [sectionIdNum, isDungSai, dungSaiSection, sections, // Include sections array if needed for existence check
      scorePercent, isPassed, // Depend on calculated score/pass status
      effectCompletedForScore, // Depend on the completion flag for this score
      // Stable context functions (assuming wrapped in useCallback correctly):
      completeDungSaiSection, completeSection, updateSectionProgress, 
      getImageRevealLevel, allSectionsCompleted, 
      // Memoized values from above (may or may not be needed if functions are stable):
      oldRevealLevel, wasAlreadyCompleted, 
      setLocation]); 
  
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
    correctCount = (scoreResult as any).correct;
    incorrectCount = (scoreResult as any).incorrect;
    totalQuestionsDisplay = (scoreResult as any).total;
  }
  const timeDisplay = isDungSai ? 'N/A' : `${(scoreResult as any).timeMinutes}:${(scoreResult as any).timeSeconds}`; // Cast to any

  const nextSectionIdValue = getNextSectionId(Number(sectionId));
  const nextQuizSection = getMultipleChoiceSection(nextSectionIdValue);

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
            
            {/* --- Reward Unlock Notice --- */}
            {unlocked && !showRewardNavigation && (
              <motion.div 
                className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6 cursor-pointer text-indigo-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
                onClick={() => setShowProgressModal(true)} // Keep modal trigger
              >
                <div className="flex items-center justify-center">
                  <Trophy className="w-5 h-5 mr-2 text-indigo-500" />
                  <span className="font-semibold">Mảnh ghép mới đã được mở khóa!</span>
                </div>
                <p className="text-sm text-center mt-1">Xem tiến độ của bạn.</p>
              </motion.div>
            )}
            {/* --- Final Completion Notice --- */}
            {showRewardNavigation && (
               <motion.div 
                className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-6 text-emerald-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2 text-emerald-500" />
                  <span className="font-semibold">Chúc mừng! Bạn đã hoàn thành tất cả!</span>
                </div>
                <p className="text-sm text-center mt-1">Xem phần thưởng cuối cùng...</p>
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
              <Button
                variant="outline"
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium"
                onClick={() => {
                  if (isDungSai) {
                    resetDungSaiSection();
                    setLocation(`/quiz/${sectionId}`);
                  } else {
                    resetSection(sectionIdNum);
                    setLocation(`/quiz/${sectionId}`);
                  }
                }}
              >
                Làm lại
              </Button>
              
              {/* Conditional Next/Home Button */}            
              {!showRewardNavigation && nextQuizSection && (
                <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => setLocation(`/quiz/${nextQuizSection.id}`)}
                  >
                    Phần tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {!showRewardNavigation && !nextQuizSection && (
                <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => setLocation("/")}
                  >
                    Quay về trang chủ
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {showAnswers && sectionData && (
          <AnswerReview 
            sectionId={sectionIdNum} 
            isDungSai={isDungSai}
          />
        )}
        
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
                      {/* Placeholder for an icon, assuming you might add one later */}
                      <span className="text-primary text-xl">📝</span> 
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

        {showProgressModal && (
          <ProgressModal 
            open={showProgressModal}
            onOpenChange={setShowProgressModal}
          />
        )}
      </div>
    </section>
  );
}
