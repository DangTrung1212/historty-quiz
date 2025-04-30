import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuiz } from "@/contexts/quiz-context";
import SectionCard from "@/components/section-card";
import { motion } from "framer-motion";

export default function QuizSelection() {
  const { sections, getImageRevealLevel, completedSections } = useQuiz();
  const totalSections = sections.length;
  const progressPercent = (completedSections / totalSections) * 100;
  const revealLevel = getImageRevealLevel();

  return (
    <section className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-primary">Chọn Phần Thi</h1>
          <p className="text-gray-600">Hoàn thành mỗi phần với điểm ≥90% để mở khóa phần thưởng</p>
        </motion.header>
        
        {/* Overall Progress */}
        <motion.div 
          className="mb-8 bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Tiến độ tổng quan</h2>
            <span className="text-sm text-gray-500">{completedSections}/{totalSections}</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2.5 bg-gray-200" 
          />
          
          {/* Mystery Image Preview */}
          <div className="mt-4 relative">
            <p className="text-sm text-gray-500 mb-2">Phần thưởng bí mật:</p>
            <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden">
              <img 
                src="https://via.placeholder.com/800x450?text=Complete+Quizzes+to+Reveal" 
                alt="Mystery reward" 
                className={`w-full h-48 object-cover blur-image reveal-${revealLevel}`}
              />
              {revealLevel < 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-lock text-white text-4xl opacity-70"></i>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Quiz Sections */}
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {sections.map((section, index) => (
            <SectionCard 
              key={section.id} 
              section={section} 
              previousCompleted={index === 0 || sections[index-1].completed}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
