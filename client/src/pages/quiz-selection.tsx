import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMultipleChoiceQuiz } from "@/contexts/MultipleChoiceQuizContext";
import { useProgress } from "@/contexts/ProgressContext";
import SectionCard from "@/components/section-card";
import ProgressModal from "@/components/progress-modal";
import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart2, ChevronRight } from "lucide-react";

export default function QuizSelection() {
  const { sections } = useMultipleChoiceQuiz();
  const { getImageRevealLevel, completedSections } = useProgress();
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  const totalSections = sections.length;
  const progressPercent = (completedSections / totalSections) * 100;
  const revealLevel = getImageRevealLevel(sections);

  return (
    <section className="min-h-screen p-6 bg-gray-50">
      {/* Progress Modal - moved outside container for proper rendering */}
      <ProgressModal 
        open={showProgressModal} 
        onOpenChange={setShowProgressModal} 
      />
      
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
        
        {/* Progress Widget - New Card-based design */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => setShowProgressModal(true)}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Tiến độ & Phần thưởng</h3>
                </div>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {completedSections}/{totalSections}
                </span>
              </div>
              
              <Progress 
                value={progressPercent} 
                className="h-2.5 bg-gray-200 mb-4" 
              />
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-100">
              <span className="text-sm text-gray-600">Phần thưởng đã mở khóa: <span className="font-medium">{revealLevel}%</span></span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
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
