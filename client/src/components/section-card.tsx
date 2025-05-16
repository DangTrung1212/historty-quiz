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
      className="rounded-xl overflow-hidden shadow-romantic border border-purple-200 transition-all duration-300 hover:shadow-romantic-lg bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-5 border-b border-purple-100 flex justify-between items-center">
        <div>
          <h3 className="font-heading font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{section.title}</h3>
          <p className="text-sm text-purple-600/80 font-medium">{section.questions.length} câu hỏi</p>
        </div>
        <div className="flex items-center space-x-2">
          {isCompleted && highestScore !== undefined && !highScoreAchieved && (
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">
              {highestScore}%
            </span>
          )}
          {highScoreAchieved && highestScore !== undefined && (
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-pink-400 bg-clip-text text-transparent drop-shadow">
              {highestScore}%
            </span>
          )}

          {highScoreAchieved ? (
            <div className="relative animate-pulse-romantic">
              <Star className="h-7 w-7 text-transparent" style={{fill: 'url(#romantic-star-gradient)'}} />
              <svg width="0" height="0">
                <linearGradient id="romantic-star-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </svg>
              <span className="absolute inset-0 rounded-full blur-[6px] opacity-60 bg-gradient-to-br from-purple-400/60 via-pink-300/50 to-pink-400/30"></span>
            </div>
          ) : isCompleted ? (
            <div className="text-purple-400">
              <Star className="h-6 w-6 fill-current" />
            </div>
          ) : (
            <div className="text-purple-200">
              <Star className="h-6 w-6" />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4 bg-gradient-to-b from-white to-purple-50">
        <Link href={`/quiz/${section.id}`}>
          <Button 
            variant={isCompleted ? "outline" : "default"}
            className={`w-full py-2.5 font-semibold ${isCompleted ? 'border-purple-200 text-purple-700 hover:bg-purple-50' : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-md'}`}
          >
            {isCompleted ? "Làm Lại" : "Bắt Đầu"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
