import { Check, Lock } from "lucide-react";
import { QuizSection } from "@/lib/quiz-data";

interface ProgressIndicatorProps {
  sections: QuizSection[];
  currentSectionId: number;
}

export default function ProgressIndicator({ sections, currentSectionId }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      {sections.map((section) => (
        <div key={section.id} className="flex items-center">
          <div 
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              section.completed 
                ? 'bg-success' 
                : section.id === currentSectionId 
                  ? 'bg-primary' 
                  : 'bg-gray-300'
            }`}
          >
            {section.completed ? (
              <Check className="text-white h-3 w-3" />
            ) : section.id === currentSectionId ? (
              <i className="fas fa-spinner fa-spin text-white text-xs"></i>
            ) : (
              <Lock className="text-gray-500 h-3 w-3" />
            )}
          </div>
          <span 
            className={`text-sm ${
              section.id === currentSectionId 
                ? 'font-medium' 
                : section.completed 
                  ? '' 
                  : 'text-gray-500'
            }`}
          >
            {section.title}
          </span>
        </div>
      ))}
    </div>
  );
}
