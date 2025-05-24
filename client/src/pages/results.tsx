import { useParams, Link, useLocation } from "wouter";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useDungSaiQuiz } from "@/contexts/DungSaiQuizContext"; // Import DungSaiQuizContext
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { Trophy, Check, Eye, ChevronRight, X as XIcon, Star } from "lucide-react";
import AnswerReview from "@/components/answer-review";
import ProgressModal from '@/components/progress-modal';
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

// Define image sources and ordered section IDs for reward parts
// (Consider centralizing these if used in multiple places)
const rewardImageParts = [
  '/assets/images/reward/modal-part1.png', 
  '/assets/images/reward/modal-part2.png', 
  '/assets/images/reward/modal-part3.png', 
];
const orderedSectionIds = ['1', '2', '3'];

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
    progress,
    updateSectionProgress,
    getImageRevealLevel, 
    allSectionsCompleted, 
    getSectionStatus,
  } = useProgress();
  const [, setLocation] = useLocation();
  const { width, height } = useWindowSize();

  const [showAnswers, setShowAnswers] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFirstTimeUnlockCelebration, setShowFirstTimeUnlockCelebration] = useState(false);
  const answerReviewRef = useRef<HTMLDivElement>(null);
  const headerHeight = 80; // Approximate height of the fixed header

  // Determine if the current section is DungSai
  const isDungSai = useMemo(() => sectionIdNum === 3, [sectionIdNum]);

  // Get section data
  const sectionData = useMemo(() => {
    return isDungSai ? dungSaiSection : getMultipleChoiceSection(sectionIdNum);
  }, [isDungSai, dungSaiSection, getMultipleChoiceSection, sectionIdNum]);

  // Calculate score
  const scoreResult = useMemo(() => {
     return isDungSai ? calculateDungSaiScore() : calculateMultipleChoiceScore(sectionIdNum);
  }, [isDungSai, calculateDungSaiScore, calculateMultipleChoiceScore, sectionIdNum, dungSaiSection]);
  
  const scorePercent = useMemo(() => Math.round(isDungSai ? scoreResult : (scoreResult as any).percent), [isDungSai, scoreResult]);
  const isPassed = useMemo(() => scorePercent >= 90, [scorePercent]);

  // Get progress *before* update
  const oldRevealLevel = useMemo(() => getImageRevealLevel(), [getImageRevealLevel]);
  const wasAlreadyCompletedOverall = useMemo(() => allSectionsCompleted(), [allSectionsCompleted]);
  
  // Capture if this section already had a high score *before* this attempt's update
  const wasSectionHighScorePreviously = useMemo(() => progress.sections[sectionIdNum]?.highScoreAchieved || false,
    [sectionIdNum, progress.sections]);

  // State for managing reward unlock effect
  const [unlocked, setUnlocked] = useState(false);
  const [showRewardNavigation, setShowRewardNavigation] = useState(false);
  const [newlyUnlockedImageIndex, setNewlyUnlockedImageIndex] = useState<number | null>(null);
  
  // State to track if the effect has run for the *current* score calculation
  const [effectCompletedForScore, setEffectCompletedForScore] = useState<number | null>(null);

  useEffect(() => {
    const sectionExists = sections.some(s => s.id === sectionIdNum);
    const dataReady = sectionIdNum && sectionExists && (isDungSai ? dungSaiSection : true);
    
    if (dataReady && effectCompletedForScore !== scorePercent) { 
      console.log(`[Results Effect] Running effect for section ${sectionIdNum} with score ${scorePercent}%`);

      if (isDungSai) {
        completeDungSaiSection();
      } else {
        completeSection(sectionIdNum, scorePercent); 
      }
      
      // Use the memoized value which captures state before this effect runs for this score
      const hadHighScoreBeforeThisUpdate = wasSectionHighScorePreviously;

      // Update progress and get the direct result containing new calculated values
      const updateResult = updateSectionProgress(sectionIdNum, scorePercent);

      if (updateResult) {
        const { updatedProgress, newRevealLevel, newAllSectionsCompleted } = updateResult;
        const sectionProgressAfterUpdate = updatedProgress.sections[sectionIdNum];
        const hasHighScoreAfterThisUpdate = sectionProgressAfterUpdate?.highScoreAchieved || false;

        if (isPassed && hasHighScoreAfterThisUpdate && !hadHighScoreBeforeThisUpdate) {
          console.log(`[Results Effect] First time high score for section ${sectionIdNum}! Triggering celebration.`);
          setShowFirstTimeUnlockCelebration(true);
          const currentSectionStringId = String(sectionIdNum);
          const imageIndex = orderedSectionIds.indexOf(currentSectionStringId);
          if (imageIndex !== -1) {
            setNewlyUnlockedImageIndex(imageIndex);
          }
        }
        
        const newSliceUnlockedOverall = isPassed && newRevealLevel > oldRevealLevel;
        const finalCompletion = !wasAlreadyCompletedOverall && newAllSectionsCompleted;

        console.log(`[Results Check Inner] Section ${sectionIdNum}, Score ${scorePercent}%. Passed: ${isPassed}. Old Overall Reveal: ${oldRevealLevel}, New Overall Reveal: ${newRevealLevel}. New Slice Overall: ${newSliceUnlockedOverall}. Final Completion: ${finalCompletion}`);

        if (newSliceUnlockedOverall && !finalCompletion && !showFirstTimeUnlockCelebration) {
          setUnlocked(true);
          setShowProgressModal(true); 
          const currentSectionStringId = String(sectionIdNum);
          const imageIndex = orderedSectionIds.indexOf(currentSectionStringId);
          if (imageIndex !== -1 && isPassed) {
            setNewlyUnlockedImageIndex(imageIndex);
          }
        }
        
        if (finalCompletion) {
          setShowRewardNavigation(true);
          setTimeout(() => setLocation("/reward"), 2000);
        }
      } else {
        console.log(`[Results Effect] updateSectionProgress reported no change. Skipping further unlock checks.`);
      }
      setEffectCompletedForScore(scorePercent);
    } else if (dataReady && effectCompletedForScore === scorePercent) {
        console.log(`[Results Effect] Skipped: Effect already completed for score ${scorePercent}`);
    } else {
        console.log(`[Results Effect] Skipped: Data not ready (sectionExists: ${sectionExists}, dataReady: ${dataReady})`);
    }
  }, [
      sectionIdNum, isDungSai, dungSaiSection, sections, 
      scorePercent, isPassed, effectCompletedForScore,
      completeDungSaiSection, completeSection, updateSectionProgress, 
      // Memoized values and their dependencies (context functions are stable, progress.sections is a direct dep for wasSectionHighScorePreviously)
      oldRevealLevel, wasAlreadyCompletedOverall, wasSectionHighScorePreviously, 
      setLocation, progress.sections 
      // Removed getImageRevealLevel, allSectionsCompleted from here as their direct results for *new* state are now from updateResult
    ]); 
  
  // Effect to hide confetti after a delay
  useEffect(() => {
    if (showFirstTimeUnlockCelebration) {
      const timer = setTimeout(() => {
        setShowFirstTimeUnlockCelebration(false);
      }, 7000); // Confetti for 7 seconds
      return () => clearTimeout(timer);
    }
  }, [showFirstTimeUnlockCelebration]);

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

  const nextSectionIdValue = getNextSectionId(Number(sectionId));
  const nextQuizSection = getMultipleChoiceSection(nextSectionIdValue);

  return (
    <section className="min-h-screen p-6 bg-gradient-to-b from-purple-50 to-white">
      {showFirstTimeUnlockCelebration && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} initialVelocityY={12} colors={['#9d4edd', '#c77dff', '#e0aaff', '#7b2cbf', '#5a189a', '#f9c74f']} />
      )}
      <div className="max-w-md mx-auto">
        <motion.div 
          className="bg-white rounded-xl shadow-romantic p-6 mb-6 border border-purple-100 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 left-3 text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full w-8 h-8 p-0"
            onClick={() => {
              if (isDungSai) {
                resetDungSaiSection();
              } else {
                resetSection(sectionIdNum);
              }
              setLocation('/');
            }}
            title="Về trang chọn đề"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/>
              <path d="m12 19-7-7 7-7"/>
            </svg>
          </Button>
          <div className="text-center">
            <motion.div 
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-romantic-sm ${isPassed ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-rose-400 to-pink-500'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {isPassed ? (
                <Trophy className="text-white text-2xl drop-shadow-md" />
              ) : (
                <XIcon className="text-white text-2xl drop-shadow-md" />
              )}
            </motion.div>
            <h2 className={`text-2xl font-heading font-bold mb-2 ${isPassed ? 'bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent' : 'text-rose-500'}`}>
              {isPassed ? 'Đạt yêu cầu!' : 'Chưa đạt'}
            </h2>
            <p className="text-purple-600/80 mb-4">
              {isPassed
                ? 'Bạn đã vượt qua phần thi này!'
                : 'Bạn chưa đạt điểm tối thiểu. Hãy thử lại để cải thiện kết quả.'}
            </p>
            {/* Spacer if confetti is showing to prevent overlap with buttons */}
            {showFirstTimeUnlockCelebration && <div className="h-16"></div>}
            
            {/* Score */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-50 to-pink-50 shadow-inner"></div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path 
                    className="stroke-current text-purple-200" 
                    strokeWidth="3" 
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path 
                    className={`stroke-current ${isPassed ? 'text-purple-500' : 'text-pink-400'}`} 
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
                  <span className="text-4xl font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{scorePercent}%</span>
                  <span className="text-sm text-purple-500/80">Điểm số</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-3 sm:gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl shadow-romantic-sm border border-purple-100">
                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{correctCount}/{totalQuestionsDisplay}</div>
                <div className="text-xs text-purple-500/80 font-medium">Câu đúng</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl shadow-romantic-sm border border-purple-100">
                <div className="text-xl sm:text-2xl font-bold text-rose-500">{incorrectCount}/{totalQuestionsDisplay}</div>
                <div className="text-xs text-rose-500/80 font-medium">Câu sai</div>
              </div>
            </motion.div>
            
            {/* --- Reward Unlock Notice --- */}
            {unlocked && !showRewardNavigation && (
              <motion.div 
                className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 mb-6 cursor-pointer shadow-romantic-sm hover:shadow-romantic transition-all duration-300"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
                onClick={() => setShowProgressModal(true)} // Keep modal trigger
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center">
                  <Trophy className="w-6 h-6 mr-2 text-purple-500 drop-shadow-sm" />
                  <span className="font-heading font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Mảnh ghép mới đã được mở khóa!</span>
                </div>
                <p className="text-sm text-center mt-1 text-purple-500/80">Xem tiến độ của bạn.</p>
              </motion.div>
            )}
            {/* --- Final Completion Notice --- */}
            {showRewardNavigation && (
               <motion.div 
                className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 mb-6 text-white rounded-xl shadow-romantic"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center justify-center">
                  <Check className="w-6 h-6 mr-2 text-white" />
                  <span className="font-heading font-semibold">Chúc mừng! Bạn đã hoàn thành tất cả!</span>
                </div>
                <p className="text-sm text-center mt-1 text-white/90">Xem phần thưởng cuối cùng...</p>
              </motion.div>
            )}
            
            {/* View Answers Button */}
            <div className="mb-6">
              <motion.button 
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-purple-200 bg-white text-purple-700 font-medium shadow-romantic-sm hover:bg-purple-50 transition-all duration-200"
                onClick={() => {
                  const newShowAnswers = !showAnswers;
                  setShowAnswers(newShowAnswers);
                  
                  // Scroll to answer review after a short delay to allow it to render
                  if (newShowAnswers) {
                    setTimeout(() => {
                      if (answerReviewRef.current) {
                        const yOffset = -headerHeight - 20; // Adjust for header and add some padding
                        const y = answerReviewRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({
                          top: y,
                          behavior: 'smooth'
                        });
                      }
                    }, 150);
                  }
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {showAnswers ? 'Ẩn đáp án' : 'Xem đáp án'}
                </span>
              </motion.button>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                variant="secondary"
                className="w-full px-4 py-3 font-medium shadow-romantic-sm rounded-xl transition-all duration-200 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 hover:text-purple-800"
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
                <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <Button 
                    className="w-full shadow-romantic-sm py-3"
                    onClick={() => setLocation(`/quiz/${nextQuizSection.id}`)}
                  >
                    Phần tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              {!showRewardNavigation && !nextQuizSection && (
                <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  <Button 
                    className="w-full shadow-romantic-sm py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl transition-all duration-200"
                    onClick={() => setLocation("/")}
                  >
                    Về trang chủ
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        
        {showAnswers && sectionData && (
          <div ref={answerReviewRef} className="scroll-mt-24">
            <AnswerReview 
              sectionId={sectionIdNum} 
              isDungSai={isDungSai}
            />
          </div>
        )}
        
        <motion.div 
          className="bg-white rounded-xl shadow-romantic p-6 hover:shadow-romantic-lg transition-all duration-300 border border-purple-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h3 className="font-heading font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-xl">Chọn Phần Thi Khác</h3>
            <div className="space-y-3">
              {sections.filter(s => s.id !== Number(sectionId)).map(section => (
                <Link key={section.id} href={`/quiz/${section.id}`} className="block">
                  <div className="flex items-center transition-all duration-300 active:scale-98 rounded-xl cursor-pointer p-3 hover:bg-purple-50 border border-purple-100 hover:border-purple-200 shadow-romantic-sm hover:shadow-romantic">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-white border border-purple-200 rounded-xl flex items-center justify-center mr-4 shadow-sm">
                      <span className="text-2xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">📝</span> 
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">{section.title}</h4>
                      <p className="text-sm text-purple-500/80">{section.questions.length} câu hỏi</p>
                    </div>
                    <div className="ml-auto text-purple-400">
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
