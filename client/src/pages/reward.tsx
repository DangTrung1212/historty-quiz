import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useProgress } from "@/contexts/ProgressContext";
import { motion } from "framer-motion";
import BadgeCard from "@/components/badge-card";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { Share, RotateCcw, Star } from "lucide-react";

export default function Reward() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const { sections } = useMultipleChoiceQuiz();
  const { allSectionsCompleted, personalLetter } = useProgress();

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
      color: "text-yellow-500",
      title: "Chuyên gia Lịch sử"
    },
    {
      icon: "bolt",
      color: "text-warning",
      title: "Siêu tốc"
    },
    {
      icon: "bullseye",
      color: "text-error",
      title: "Chính xác tuyệt đối"
    },
    {
      icon: "book",
      color: "text-success",
      title: "Học giả toàn diện"
    }
  ];

  if (!allSectionsCompleted()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Chưa mở khóa</h2>
          <p className="mb-4">Bạn cần hoàn thành tất cả các phần thi với điểm số ≥90% để mở khóa phần thưởng.</p>
          <Link href="/quiz-selection">
            <Button>Quay lại làm bài</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 flex flex-col">
      {/* Confetti Container */}
      {showConfetti && <Confetti width={width} height={height} />}
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-4">
              <Star className="text-primary text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Chúc mừng!</h1>
            <p className="text-gray-600">Bạn đã hoàn thành tất cả các phần thi</p>
          </motion.div>
          
          {/* Unlocked Image */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-semibold mb-4">Hình ảnh đã mở khóa</h2>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img 
                src="/assets/rewards/final-reward.png"
                alt="Unlocked reward image" 
                className="w-full h-64 object-cover rounded-lg reveal-100"
              />
            </div>
          </motion.div>
          
          {/* Personal Letter */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-semibold mb-4">Thư cá nhân</h2>
            <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {personalLetter}
              </p>
            </div>
          </motion.div>
          
          {/* Achievement Badges */}
          <motion.div 
            className="bg-white rounded-lg shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-semibold mb-4">Thành tích của bạn</h2>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <BadgeCard 
                  key={index}
                  icon={badge.icon}
                  color={badge.color}
                  title={badge.title}
                />
              ))}
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div 
            className="flex space-x-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium"
              onClick={() => {
                // Sharing functionality
                if (navigator.share) {
                  navigator.share({
                    title: 'Sử Nhanh - Tôi đã hoàn thành toàn bộ bài thi!',
                    text: 'Tôi đã hoàn thành toàn bộ bài thi lịch sử với điểm số cao. Thử xem bạn làm được không nhé!',
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share className="mr-2 h-4 w-4" /> Chia sẻ
            </Button>
            <Link href="/quiz-selection">
              <Button className="flex-1 px-4 py-3 bg-primary text-white font-medium">
                <RotateCcw className="mr-2 h-4 w-4" /> Làm lại tất cả
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
