import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useProgress } from "@/contexts/ProgressContext";
import { motion, AnimatePresence } from "framer-motion";
import BadgeCard from "@/components/badge-card";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Share, RotateCcw, Star, Award, Sparkles, Gift, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTurningCard from '@/components/PageTurningCard';
import GachaModal from '@/components/GachaModal';

export default function Reward() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const { sections } = useMultipleChoiceQuiz();
  const { allSectionsCompleted } = useProgress();
  const [isGachaModalOpen, setIsGachaModalOpen] = useState(false);
  const [hasReceivedReward, setHasReceivedReward] = useState(false);

  // Check if reward has been received from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPrize = localStorage.getItem('birthdayGachaPrize');
      setHasReceivedReward(!!storedPrize);
    }
  }, []);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  if (!allSectionsCompleted()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md p-6 text-center shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Chưa mở khóa phần thưởng!</h2>
          <p className="mb-6 text-gray-600">Bạn cần hoàn thành tất cả các phần thi với điểm số cao (≥90%) để xem nội dung này.</p>
          <Link href="/quiz-selection">
            <Button className="bg-primary hover:bg-primary/90 text-white">Quay lại làm bài</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Personalized birthday message text
  const personalizedBirthdayMessage = "Chúc em có 1 ngày sinh nhật vui vẻ hạnh phúc.\n\n Ấn quay quà và nhắn cho anh nhé!";

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 py-6 sm:py-10 overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-100/50"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Confetti 
              width={width} 
              height={height} 
              recycle={false} 
              numberOfPieces={500}
              colors={['#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#f9a8d4']}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-hidden p-4 sm:p-6 relative z-10">
        <div className="max-w-2xl mx-auto overflow-hidden">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-4 sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-3 shadow-lg border-2 border-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Star className="text-purple-500 w-8 h-8 sm:w-10 sm:h-10 fill-current" />
              <Sparkles className="absolute text-yellow-400 w-4 h-4 sm:w-5 sm:h-5 -top-1 -right-1 animate-pulse" />
            </motion.div>
            <motion.h1 
              className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Tuyệt Vời! Xin Chúc Mừng!
            </motion.h1>
            <motion.p 
              className="text-base text-purple-700/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Bạn đã chinh phục tất cả các thử thách lịch sử!
            </motion.p>
          </motion.div>
          
          {/* Replaced Reward Image with BirthdayCard */}
          <motion.div 
            className="mb-10 sm:mb-12 flex justify-center items-center min-h-[500px]" // Added min-height to ensure full display
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <PageTurningCard 
              message={personalizedBirthdayMessage}
              recipientName="Bạn"
              cardWidth="300px"
              cardHeight="420px"
              hasReceivedReward={hasReceivedReward}
              onGachaButtonClick={() => setIsGachaModalOpen(true)}
            />
          </motion.div>
          <p className="text-center mt-4 text-sm text-purple-500/80 font-medium mb-8">
            Một lời nhắn đặc biệt dành cho bạn!
          </p>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/quiz-selection" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full py-6 text-base border-purple-200 bg-white/80 hover:bg-white text-purple-700 hover:text-purple-800 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back to quiz selection page
                </Button>
              </Link>
            </motion.div>
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/quiz-selection" className="block w-full">
                <Button className="w-full py-6 text-base bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <RotateCcw className="mr-2 h-5 w-5" /> Làm lại thử thách
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <GachaModal isOpen={isGachaModalOpen} onOpenChange={setIsGachaModalOpen} />
    </section>
  );
}
