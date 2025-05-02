import React from 'react';
import { useQuiz } from '@/contexts/quiz-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, Lock } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[80vh] overflow-y-auto">
        {/* Header with background */}
        <div className="bg-primary/5 p-6 pb-4 relative sticky top-0 z-10 shadow-sm">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <h2 className="text-xl font-bold text-primary mb-1">Tiến độ & Phần thưởng</h2>
          <p className="text-sm text-gray-600">Theo dõi quá trình học tập của bạn</p>
        </div>
        
        <div className="p-6 space-y-6 pt-2">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-gray-800">Tiến độ tổng quan</h3>
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                {completedSections}/{totalSections}
              </div>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-2.5 bg-gray-200" 
            />
            <p className="text-xs text-gray-500 italic">Hoàn thành tất cả các phần để mở khóa hoàn toàn phần thưởng</p>
          </div>
          
          {/* Mystery Image Preview */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Phần thưởng bí mật</h3>
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img 
                src="https://images.unsplash.com/photo-1635476654563-9e4694de1e1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Mystery reward" 
                className={`w-full h-48 object-cover blur-image reveal-${revealLevel}`}
              />
              {revealLevel < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-black/50 rounded-full p-4">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                {revealLevel}% đã mở khóa
              </div>
            </div>
          </div>
          
          {/* Sections Progress */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Chi tiết các phần</h3>
            <div className="space-y-2 px-2 -mx-2">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${section.completed ? 'bg-success' : 'bg-gray-300'}`}></div>
                  <div className="flex-1 text-sm font-medium text-gray-700">{section.title}</div>
                  {section.completed ? (
                    <div className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
                      {section.score}%
                    </div>
                  ) : (
                    <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
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