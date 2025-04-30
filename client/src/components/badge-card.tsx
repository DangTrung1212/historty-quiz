import { motion } from "framer-motion";

interface BadgeCardProps {
  icon: string;
  color: string;
  title: string;
}

export default function BadgeCard({ icon, color, title }: BadgeCardProps) {
  return (
    <motion.div 
      className="bg-gray-50 p-4 rounded-lg text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring" }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-2">
        <i className={`fas fa-${icon} ${color} text-xl`}></i>
      </div>
      <h3 className="font-medium text-sm">{title}</h3>
    </motion.div>
  );
}
