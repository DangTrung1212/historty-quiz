import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { useMultipleChoiceQuiz } from '@/contexts/MultipleChoiceQuizContext';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { X, Lock, CheckCircle, Gift } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface ProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOverlayClick?: () => void;
}

// Define the ordered section IDs for the 3-part reward display
const orderedSectionIds = ['1', '2', '3'];

// Define image sources for each reward part
const rewardImageParts = [
  '/assets/images/reward/modal-part1.png', // Corresponds to orderedSectionIds[0]
  '/assets/images/reward/modal-part2.png', // Corresponds to orderedSectionIds[1]
  '/assets/images/reward/modal-part3.png', // Corresponds to orderedSectionIds[2]
];

export default function ProgressModal({ open, onOpenChange, onOverlayClick }: ProgressModalProps) {
  const { progress } = useProgress();
  const { sections: allQuizSections } = useMultipleChoiceQuiz();
  
  const totalQuizSections = allQuizSections.length;
  const completedOverallSections = totalQuizSections > 0 ? Object.values(progress.sections).filter(s => s.completed).length : 0;
  const progressPercent = totalQuizSections > 0 ? (completedOverallSections / totalQuizSections) * 100 : 0;

  // Calculate status for the 3 reward sections
  const rewardSectionStatuses = orderedSectionIds.map(sectionId => {
    // Forcefully treat progress.sections as a Record<string, any> for indexing
    const sectionProg = (progress.sections as Record<string, { highScoreAchieved?: boolean } | undefined>)[sectionId];
    return sectionProg?.highScoreAchieved || false;
  });
  
  const unlockedRewardCount = rewardSectionStatuses.filter(Boolean).length;
  const allRewardsUnlocked = unlockedRewardCount === orderedSectionIds.length && orderedSectionIds.length > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[80vh] overflow-y-auto">
        <div className="bg-primary/5 p-6 pb-4 relative sticky top-0 z-10 shadow-sm">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <h2 className="text-xl font-bold text-primary mb-1">Tiến độ & Phần thưởng</h2>
          <p className="text-sm text-gray-600">Theo dõi quá trình học tập của bạn</p>
        </div>
        
        <div className="p-6 space-y-6 pt-2">
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-gray-800">Tiến độ tổng quan</h3>
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                {completedOverallSections}/{totalQuizSections}
              </div>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-2.5 bg-gray-200" 
            />
            <p className="text-xs text-gray-500 italic">Hoàn thành tất cả các phần để mở khóa hoàn toàn phần thưởng</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Phần thưởng bí mật</h3>
            <div className="relative border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
              <div className="flex h-32 bg-gray-800">
                {rewardSectionStatuses.map((isUnlocked, index) => (
                  <div 
                    key={orderedSectionIds[index]}
                    className={`flex items-center justify-center text-center transition-all duration-300
                      w-1/3 overflow-hidden relative PreventImageOverflowIfTooLarge
                      ${isUnlocked 
                        ? 'bg-gray-700' 
                        : 'bg-gray-900 text-gray-400' 
                      }
                      ${index < orderedSectionIds.length - 1 ? 'border-r border-gray-600' : ''} 
                    `}
                  >
                    {isUnlocked ? (
                      <img 
                        src={rewardImageParts[index]} 
                        alt={`Phần thưởng ${index + 1}`}
                        className={`w-full h-full object-cover transition-all duration-500 ease-in-out 
                          ${!allRewardsUnlocked ? 'filter blur-md' : 'filter blur-none'}`}
                      />
                    ) : (
                      <div className="p-2 flex flex-col items-center">
                        <Lock className="w-6 h-6 mb-1 text-gray-500" />
                        <span className="text-sm font-medium block text-gray-400">Chưa mở khóa</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {!allRewardsUnlocked && (
                 <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-semibold shadow">
                    {unlockedRewardCount}/{orderedSectionIds.length} đã mở khóa
                 </div>
              )}
              
              {allRewardsUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-90 p-4">
                  <Gift className="w-12 h-12 text-yellow-300 mb-3" />
                  <p className="text-white font-bold text-xl text-center px-4 mb-4">
                    Chúc mừng! Bạn đã mở khóa toàn bộ phần thưởng!
                  </p>
                  <Link href="/reward" onClick={() => onOpenChange(false)}>
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-lg text-base">
                      Xem Thư & Phần Thưởng Đầy Đủ
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Chi tiết các phần</h3>
            <div className="space-y-2 px-2 -mx-2">
              {allQuizSections.map((section) => {
                const status = progress.sections[section.id];
                const isCompleted = status?.completed || false;
                const highScoreAchieved = status?.highScoreAchieved || false;
                return (
                  <div key={section.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCompleted ? (highScoreAchieved ? 'bg-success' : 'bg-orange-400') : 'bg-gray-300'}`}></div>
                    <div className="flex-1 text-sm font-medium text-gray-700">{section.title}</div>
                    {isCompleted ? (
                      highScoreAchieved ? (
                        <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Đạt yêu cầu
                        </div>
                      ) : (
                        <div className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                           Hoàn thành (chưa đạt)
                        </div>
                      )
                    ) : (
                      <div className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                        Chưa hoàn thành
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}