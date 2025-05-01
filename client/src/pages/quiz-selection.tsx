import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/contexts/quiz-context";
import SectionCard from "@/components/section-card";
import ProgressModal from "@/components/progress-modal";
import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart2, ChevronRight } from "lucide-react";

export default function QuizSelection() {
  const { sections, getImageRevealLevel, completedSections } = useQuiz();
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  const totalSections = sections.length;
  const progressPercent = (completedSections / totalSections) * 100;
  const revealLevel = getImageRevealLevel();

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
        
        {/* Progress Widget */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button 
            variant="outline" 
            className="w-full py-6 bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
            onClick={() => setShowProgressModal(true)}
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-3 w-full">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">Tiến độ & Phần thưởng</span>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {completedSections}/{totalSections}
                </span>
              </div>
              
              <Progress 
                value={progressPercent} 
                className="h-2.5 bg-gray-200 mb-3" 
              />
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Phần thưởng đã mở khóa: {revealLevel}%</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Button>
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
