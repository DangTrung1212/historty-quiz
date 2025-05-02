import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function Landing() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-rose-50">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Logo and App Name - Enhanced */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Background effect */}
            <div className="absolute -inset-5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-xl opacity-70"></div>
            
            <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-xl">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="text-white text-4xl" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sử Nhanh</span>
          </h1>
          
          <p className="mt-2 text-xl text-gray-600 mb-4">Luyện thi lịch sử THPT Quốc Gia</p>
          
        </motion.div>
        
        {/* Features Preview */}
        <motion.div 
          className="w-full mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative overflow-hidden">
            <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Các tính năng nổi bật</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-500 text-white p-3 rounded-lg mb-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" /><polyline points="12 16 16 10 8 10" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">4 phần thi đa dạng</h4>
                  <p className="text-sm text-gray-600">Khám phá nhiều chủ đề lịch sử Việt Nam</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-500 text-white p-3 rounded-lg mb-3 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">Mở khóa phần thưởng</h4>
                  <p className="text-sm text-gray-600">Hoàn thành để mở khóa nội dung đặc biệt</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Start Button - Enhanced */}
          <div className="mt-8">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            
            <Link href="/quiz-selection" className="block relative">
              <Button 
                className="w-full px-10 py-7 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                size="lg"
              >
                Bắt Đầu Ngay
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
