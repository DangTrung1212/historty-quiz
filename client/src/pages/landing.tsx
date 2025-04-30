import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Landing() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-rose-50">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Logo and App Name */}
        <motion.div 
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-primary rounded-full shadow-lg">
            <BookOpen className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Sử Nhanh</h1>
          <p className="mt-2 text-lg text-gray-600">Luyện thi lịch sử THPT Quốc Gia</p>
        </motion.div>
        
        {/* Features Preview */}
        <motion.div 
          className="w-full mb-8 grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <i className="fas fa-tasks text-primary text-xl mb-2"></i>
            <p className="text-sm text-center">4 phần thi đa dạng</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <i className="fas fa-unlock-alt text-secondary text-xl mb-2"></i>
            <p className="text-sm text-center">Mở khóa phần thưởng</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <i className="fas fa-medal text-warning text-xl mb-2"></i>
            <p className="text-sm text-center">Huy hiệu thành tích</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <i className="fas fa-chart-line text-success text-xl mb-2"></i>
            <p className="text-sm text-center">Theo dõi tiến độ</p>
          </div>
        </motion.div>
        
        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/quiz-selection">
            <Button 
              className="mt-4 px-8 py-7 bg-primary text-white text-lg font-semibold rounded-full shadow-lg hover:bg-indigo-700"
              size="lg"
            >
              Bắt Đầu Ngay
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
