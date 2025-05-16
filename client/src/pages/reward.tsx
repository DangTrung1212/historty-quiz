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
import { Share, RotateCcw, Star, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Define image sources for each reward part (consistent with ProgressModal)
const rewardImageParts = [
  '/assets/images/reward/modal-part1.png', 
  '/assets/images/reward/modal-part2.png',
  '/assets/images/reward/modal-part3.png',
];

// Static Congratulatory Letter Component
const CongratulatoryLetter: React.FC = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 sm:p-8 rounded-2xl shadow-lg text-gray-700 leading-relaxed relative overflow-hidden">
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-20"></div>
    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-200 rounded-full opacity-20"></div>
    
    <div className="relative z-10">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center">
        <Award className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-purple-500" /> 
        <span className="drop-shadow-sm">Thư Chúc Mừng!</span>
      </h2>
      <div className="space-y-4">
        <p className="text-base sm:text-lg text-gray-700">
          Bạn thật sự xuất sắc! Chúng tôi vô cùng tự hào về những nỗ lực và thành tích tuyệt vời mà bạn đã đạt được.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          Việc bạn hoàn thành tất cả các thử thách không chỉ cho thấy kiến thức vững vàng về lịch sử, mà còn thể hiện sự kiên trì, ham học hỏi và tinh thần quyết tâm đáng ngưỡng mộ.
        </p>
        <p className="text-base sm:text-lg text-gray-700">
          Phần thưởng này là một sự ghi nhận cho những cố gắng không ngừng của bạn. Hãy tiếp tục khám phá những trang sử hào hùng của dân tộc và chinh phục những đỉnh cao tri thức mới.
        </p>
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-lg sm:text-xl mt-6 text-center">
          Hãy luôn giữ vững ngọn lửa đam mê!
        </p>
      </div>
      <hr className="my-6 sm:my-8 border-purple-100" />
      <p className="text-sm text-purple-600 italic text-center font-medium">
        Trân trọng,<br />Đội ngũ Sử Nhanh App
      </p>
    </div>
  </div>
);

export default function Reward() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const { sections } = useMultipleChoiceQuiz();
  const { allSectionsCompleted } = useProgress();

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const badges = [
    {
      icon: "crown",
      color: "text-yellow-400",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      title: "Chuyên gia Lịch sử"
    },
    {
      icon: "bolt",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      title: "Siêu tốc"
    },
    {
      icon: "bullseye",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      title: "Chính xác"
    },
    {
      icon: "book",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      title: "Học giả toàn diện"
    }
  ];

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

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col relative overflow-hidden">
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
      
      <div className="flex-1 overflow-auto p-4 sm:p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6 shadow-lg border-2 border-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Star className="text-purple-500 w-12 h-12 fill-current" />
              <Sparkles className="absolute text-yellow-400 w-6 h-6 -top-1 -right-1 animate-pulse" />
            </motion.div>
            <motion.h1 
              className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Tuyệt Vời! Xin Chúc Mừng!
            </motion.h1>
            <motion.p 
              className="text-lg text-purple-700/80 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Bạn đã chinh phục tất cả các thử thách lịch sử!
            </motion.p>
          </motion.div>
          
          {/* Reward Image Display */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-7 mb-8 sm:mb-12 border border-purple-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Phần Thưởng Của Bạn
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-2 bg-gradient-to-r from-purple-50 to-pink-50 p-2 rounded-xl shadow-inner max-w-xl mx-auto overflow-hidden border border-purple-100">
              {rewardImageParts.map((src, index) => (
                <motion.div 
                  key={index} 
                  className="w-full sm:w-1/3 h-40 sm:h-52 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <img 
                    src={src} 
                    alt={`Phần thưởng ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-4 text-sm text-purple-500/80 font-medium">
              Hình ảnh phần thưởng đã được mở khóa thành công!
            </p>
          </motion.div>
          
          {/* Personal Letter */}
          <motion.div 
            className="mb-10 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CongratulatoryLetter />
          </motion.div>
          
          {/* Achievement Badges */}
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-7 mb-10 sm:mb-12 border border-purple-100/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Thành Tích Đạt Được
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <BadgeCard 
                    icon={badge.icon}
                    color={badge.color}
                    title={badge.title}
                    className={cn(
                      'h-full transition-all duration-300 hover:shadow-lg',
                      badge.bgColor,
                      'border-2',
                      badge.borderColor
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
          
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
              <Button
                variant="outline"
                className="w-full py-6 text-base border-purple-200 bg-white/80 hover:bg-white text-purple-700 hover:text-purple-800 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Sử Nhanh - Tôi đã hoàn thành toàn bộ bài thi!',
                      text: 'Tôi đã hoàn thành toàn bộ bài thi lịch sử với điểm số cao. Thử xem bạn làm được không nhé!',
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share className="mr-2 h-5 w-5" /> Chia sẻ thành tích
              </Button>
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
    </section>
  );
}
