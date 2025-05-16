import { motion } from "framer-motion";

interface QuizOptionProps {
  option: {
    id: string;
    text: string;
  };
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const optionLetters = ["A", "B", "C", "D"];

export default function QuizOption({ option, index, isSelected, onSelect }: QuizOptionProps) {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.05 * index,
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
      whileHover={{ scale: 1.01 }}
    >
      <input 
        type="radio" 
        id={`option-${option.id}`} 
        name="answer" 
        className="peer absolute opacity-0" 
        checked={isSelected}
        onChange={onSelect}
      />
      <label 
        htmlFor={`option-${option.id}`} 
        className={`block p-4 rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
          ${isSelected 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-romantic-sm'
            : 'bg-white/80 hover:bg-white text-purple-900 border border-purple-100'}`}
        onClick={onSelect}
      >
        <div className="flex items-center">
          <div className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center mr-4 transition-all duration-200 ${
            isSelected 
              ? 'bg-white/20 border border-white/30'
              : 'bg-purple-50 border border-purple-200 group-hover:border-purple-300'
          }`}>
            <span className={`text-sm font-medium transition-colors ${
              isSelected ? 'text-white' : 'text-purple-600'
            }`}>
              {optionLetters[index]}
            </span>
          </div>
          <span className={`text-left leading-relaxed ${isSelected ? 'text-white' : 'text-purple-800'}`}>
            {option.text}
          </span>
          {isSelected && (
            <div className="ml-auto">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </label>
    </motion.div>
  );
}
