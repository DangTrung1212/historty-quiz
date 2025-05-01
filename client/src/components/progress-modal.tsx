import React from 'react';
import { useQuiz } from '@/contexts/quiz-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProgressModal({ open, onOpenChange }: ProgressModalProps) {
  const { sections, completedSections, getImageRevealLevel } = useQuiz();
  
  const totalSections = sections.length;
  const progressPercent = (completedSections / totalSections) * 100;
  const revealLevel = getImageRevealLevel();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-xl font-semibold text-primary">Tiến độ & Phần thưởng</DialogTitle>
          <DialogClose className="absolute right-4 top-4 p-1 rounded-full opacity-70 hover:opacity-100">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium">Tiến độ tổng quan</h3>
              <span className="text-sm text-gray-500 font-semibold">{completedSections}/{totalSections}</span>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-2.5 bg-gray-200" 
            />
          </div>
          
          {/* Mystery Image Preview */}
          <div className="space-y-3">
            <h3 className="font-medium">Phần thưởng bí mật</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1635476654563-9e4694de1e1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Mystery reward" 
                className={`w-full h-48 object-cover blur-image reveal-${revealLevel}`}
              />
              {revealLevel < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="bg-black/50 rounded-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 right-2 bg-primary/90 text-white px-2 py-1 rounded text-xs font-medium">
                {revealLevel}% đã mở khóa
              </div>
            </div>
          </div>
          
          {/* Sections Progress */}
          <div className="space-y-3">
            <h3 className="font-medium">Chi tiết các phần</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${section.completed ? 'bg-success' : 'bg-gray-300'}`}></div>
                  <div className="flex-1 text-sm">{section.title}</div>
                  {section.completed ? (
                    <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
                      {section.score}%
                    </div>
                  ) : (
                    <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded">
                      Chưa hoàn thành
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}