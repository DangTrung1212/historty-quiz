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
          className="w-full mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold text-primary mb-4 text-center">Tính năng</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-full">
                  <i className="fas fa-tasks text-primary text-lg"></i>
                </div>
                <p className="text-sm">4 phần thi đa dạng</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-indigo-400 bg-opacity-10 p-2 rounded-full">
                  <i className="fas fa-unlock-alt text-indigo-500 text-lg"></i>
                </div>
                <p className="text-sm">Mở khóa phần thưởng</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-yellow-400 bg-opacity-10 p-2 rounded-full">
                  <i className="fas fa-medal text-yellow-500 text-lg"></i>
                </div>
                <p className="text-sm">Huy hiệu thành tích</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-green-400 bg-opacity-10 p-2 rounded-full">
                  <i className="fas fa-chart-line text-green-500 text-lg"></i>
                </div>
                <p className="text-sm">Theo dõi tiến độ</p>
              </div>
            </div>
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
