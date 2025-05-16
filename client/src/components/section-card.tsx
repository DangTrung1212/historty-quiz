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
      className="rounded-lg overflow-hidden shadow-romantic border border-primary-light/30 transition-all duration-300 hover:shadow-romantic-lg bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-5 border-b border-primary-light/20 flex justify-between items-center">
        <div>
          <h3 className="font-heading font-bold text-lg text-primary-dark">{section.title}</h3>
          <p className="text-sm text-primary/70">{section.questions.length} câu hỏi</p>
        </div>
        <div className="flex items-center space-x-2">
          {isCompleted && highestScore !== undefined && !highScoreAchieved && (
            <span className="text-sm font-medium text-orange-500">{highestScore}%</span>
          )}
          {highScoreAchieved && highestScore !== undefined && (
            <span className="text-sm font-medium text-success">{highestScore}%</span>
          )}
          
          {highScoreAchieved ? (
            <div className="text-accent animate-pulse-romantic">
              <Star className="h-7 w-7 fill-current drop-shadow-md" />
            </div>
          ) : isCompleted ? (
            <div className="text-secondary-light">
              <Star className="h-6 w-6 fill-current" /> 
            </div>
          ) : (
            <div className="text-primary-light">
              <Star className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 bg-gradient-to-b from-white to-primary-light/5">
        <Link href={`/quiz/${section.id}`}>
          <Button 
            variant={isCompleted ? "outline" : "default"}
            className="w-full py-2.5 font-medium"
          >
            {isCompleted ? "Làm Lại" : "Bắt Đầu"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
