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
        className="block p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-primary peer-checked:bg-indigo-50"
        onClick={onSelect}
      >
        <div className="flex items-center">
          <div className={`w-6 h-6 flex-shrink-0 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'} flex items-center justify-center mr-3`}>
            <span className={isSelected ? 'text-white' : 'text-gray-500'} style={{ fontSize: '0.75rem' }}>
              {optionLetters[index]}
            </span>
          </div>
          <span>{option.text}</span>
        </div>
      </label>
    </motion.div>
  );
}
