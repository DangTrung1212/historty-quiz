import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { QuizSection } from "@/lib/quiz-data";

interface SectionCardProps {
  section: QuizSection;
  previousCompleted: boolean;
}

export default function SectionCard({ section, previousCompleted }: SectionCardProps) {
  // Removed the section locking logic
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * section.id }}
    >
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{section.title}</h3>
          <p className="text-sm text-gray-500">{section.questions.length} câu hỏi</p>
        </div>
        <div className="flex items-center">
          {section.completed ? (
            <>
              <span className="text-sm font-medium text-success mr-2">{section.score}%</span>
              <div className="bg-success text-white rounded-full w-8 h-8 flex items-center justify-center">
                <Check className="h-4 w-4" />
              </div>
            </>
          ) : (
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
              {/* Removed the lock icon */}
              <span className="text-gray-400 text-xs font-medium">NEW</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50">
        {section.completed ? (
          <Link href={`/quiz/${section.id}`}>
            <Button 
              variant="secondary"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700"
            >
              Làm Lại
            </Button>
          </Link>
        ) : (
          <Link href={`/quiz/${section.id}`}>
            <Button 
              className="w-full px-4 py-2 bg-primary text-white"
            >
              Bắt Đầu
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
