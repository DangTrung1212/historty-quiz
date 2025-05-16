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
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
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
        className={`block p-4 border rounded-lg cursor-pointer transition-all duration-300 shadow-sm
          ${isSelected 
            ? 'border-primary-light bg-gradient-to-r from-primary-light/10 to-primary/5 shadow-romantic-sm' 
            : 'border-primary-light/20 hover:bg-primary-light/5'}`}
        onClick={onSelect}
      >
        <div className="flex items-center">
          <div className={`w-7 h-7 flex-shrink-0 rounded-full border transition-all duration-300 shadow-sm
            ${isSelected 
              ? 'border-primary bg-gradient-romantic' 
              : 'border-primary-light/50 bg-white'} 
            flex items-center justify-center mr-3`}>
            <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-primary-light'}`} 
              style={{ fontSize: '0.75rem' }}>
              {optionLetters[index]}
            </span>
          </div>
          <span className={`${isSelected ? 'text-primary-dark font-medium' : 'text-primary/80'}`}>{option.text}</span>
        </div>
      </label>
    </motion.div>
  );
}
