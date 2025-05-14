import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { QuizSection } from "@/lib/quiz-data";
import { useProgress } from "@/contexts/ProgressContext";

interface SectionCardProps {
  section: QuizSection;
}

export default function SectionCard({ section }: SectionCardProps) {
  const { progress } = useProgress();

  const persistentSectionProgress = (progress.sections as Record<string, { completed?: boolean; highScoreAchieved?: boolean; highestScore?: number } | undefined>)[section.id];

  const isCompleted = persistentSectionProgress?.completed || false;
  const highScoreAchieved = persistentSectionProgress?.highScoreAchieved || false;
  const highestScore = persistentSectionProgress?.highestScore;

  const animationDelay = typeof section.id === 'number' ? 0.1 * section.id : 0.1;
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">{section.title}</h3>
          <p className="text-sm text-gray-500">{section.questions.length} câu hỏi</p>
        </div>
        <div className="flex items-center space-x-2">
          {isCompleted && highestScore !== undefined && !highScoreAchieved && (
            <span className="text-sm font-medium text-orange-500">{highestScore}%</span>
          )}
          {highScoreAchieved && highestScore !== undefined && (
            <span className="text-sm font-medium text-green-600">{highestScore}%</span>
          )}
          
          {highScoreAchieved ? (
            <div className="text-yellow-400">
              <Star className="h-6 w-6 fill-current" />
            </div>
          ) : isCompleted ? (
            <div className="text-gray-300">
              <Star className="h-6 w-6 fill-current" /> 
            </div>
          ) : (
            <div className="text-gray-300">
              <Star className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50">
        <Link href={`/quiz/${section.id}`}>
          <Button 
            variant={isCompleted ? "secondary" : "default"}
            className="w-full px-4 py-2"
          >
            {isCompleted ? "Làm Lại" : "Bắt Đầu"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
