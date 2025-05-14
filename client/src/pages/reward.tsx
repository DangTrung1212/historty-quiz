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
import { Share, RotateCcw, Star, Award } from "lucide-react";

// Define image sources for each reward part (consistent with ProgressModal)
const rewardImageParts = [
  '/assets/images/reward/modal-part1.png', 
  '/assets/images/reward/modal-part2.png',
  '/assets/images/reward/modal-part3.png',
];

// Static Congratulatory Letter Component
const CongratulatoryLetter: React.FC = () => (
  <div className="bg-yellow-50 border-2 border-yellow-300 p-6 sm:p-8 rounded-lg shadow-xl text-gray-700 leading-relaxed">
    <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-6 text-center flex items-center justify-center">
      <Award className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-yellow-500" /> Thư Chúc Mừng!
    </h2>
    <p className="mb-4 text-base sm:text-lg">
      Bạn thật sự xuất sắc! Chúng tôi vô cùng tự hào về những nỗ lực và thành tích tuyệt vời mà bạn đã đạt được.
    </p>
    <p className="mb-4 text-base sm:text-lg">
      Việc bạn hoàn thành tất cả các thử thách không chỉ cho thấy kiến thức vững vàng về lịch sử, mà còn thể hiện sự kiên trì, ham học hỏi và tinh thần quyết tâm đáng ngưỡng mộ. Đây là những phẩm chất quý giá sẽ giúp bạn gặt hái nhiều thành công hơn nữa trên con đường học vấn cũng như trong cuộc sống.
    </p>
    <p className="mb-4 text-base sm:text-lg">
      Phần thưởng này là một sự ghi nhận nhỏ cho những cố gắng không ngừng của bạn. Mong rằng nó sẽ là nguồn động viên để bạn tiếp tục khám phá những trang sử hào hùng của dân tộc và chinh phục những đỉnh cao tri thức mới.
    </p>
    <p className="font-semibold text-yellow-700 text-base sm:text-lg">
      Hãy luôn giữ vững ngọn lửa đam mê và không ngừng tiến bước nhé!
    </p>
    <hr className="my-6 sm:my-8 border-yellow-300" />
    <p className="text-sm text-gray-600 italic text-center">
      Trân trọng,<br />Đội ngũ Sử Nhanh App
    </p>
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
    <section className="min-h-screen bg-gray-100 flex flex-col">
      {/* Confetti Container */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 shadow">
              <Star className="text-green-500 text-4xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Tuyệt Vời! Xin Chúc Mừng!</h1>
            <p className="text-gray-600 text-lg">Bạn đã chinh phục tất cả các thử thách lịch sử!</p>
          </motion.div>
          
          {/* Modified Unlocked Image Display */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-8 sm:mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 text-center">Phần Thưởng Của Bạn</h2>
            <div className="flex flex-col sm:flex-row justify-center items-stretch gap-1 bg-gray-700 p-1 rounded-lg shadow-inner max-w-xl mx-auto overflow-hidden">
              {rewardImageParts.map((src, index) => (
                <div key={index} className="w-full sm:w-1/3 h-40 sm:h-52 bg-gray-600 flex-shrink-0">
                  <img 
                    src={src} 
                    alt={`Reward part ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
             <p className="text-center mt-3 text-sm text-gray-500 italic">
              (Hình ảnh phần thưởng đầy đủ đã được mở khóa)
            </p>
          </motion.div>
          
          {/* Personal Letter (Static) */}
          <motion.div 
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            <CongratulatoryLetter />
          </motion.div>
          
          {/* Achievement Badges */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-4 sm:p-6 mb-8 sm:mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Thành Tích Đạt Được</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
          
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="flex-1 py-3 text-base border-gray-300 hover:bg-gray-50"
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
            <Link href="/quiz-selection" className="flex-1">
              <Button className="w-full py-3 text-base bg-blue-600 hover:bg-blue-700 text-white">
                <RotateCcw className="mr-2 h-5 w-5" /> Làm lại thử thách
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
