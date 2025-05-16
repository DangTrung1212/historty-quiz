import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
  icon: string;
  color: string;
  title: string;
  className?: string;
}

export default function BadgeCard({ 
  icon, 
  color, 
  title, 
  className 
}: BadgeCardProps) {
  return (
    <motion.div 
      className={cn(
        "p-4 rounded-xl text-center transition-all duration-300 shadow-sm",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className={cn(
        "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3",
        color.replace('text-', 'bg-') + '/10'
      )}>
        <i 
          className={cn(
            `fas fa-${icon} text-2xl`,
            color,
            'drop-shadow-sm'
          )}
        />
      </div>
      <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
    </motion.div>
  );
}
