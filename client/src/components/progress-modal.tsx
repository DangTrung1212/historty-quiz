import React from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import { useMultipleChoiceQuiz } from '@/contexts/MultipleChoiceQuizContext';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { X, Lock, CheckCircle, Gift, Star } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden max-h-[80vh] overflow-y-auto shadow-romantic-lg border border-primary-light/30">
        <div className="bg-gradient-romantic p-6 pb-4 relative sticky top-0 z-10 shadow-sm">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-90 text-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <h2 className="text-xl font-heading font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent mb-1">Tiến độ & Phần thưởng</h2>
          <p className="text-sm text-white/80">Theo dõi quá trình học tập của bạn</p>
        </div>
        
        <div className="p-6 space-y-6 pt-4 bg-gradient-to-b from-primary-light/5 to-white">
          <div className="space-y-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-heading font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Tiến độ tổng quan
              </h3>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full px-3 py-1 text-sm font-medium shadow-romantic-sm border border-purple-200">
                <span className="font-bold text-purple-700">{completedOverallSections}</span>
                <span className="text-purple-500">/{totalQuizSections}</span>
              </div>
            </div>
            <Progress 
              value={progressPercent} 
              className="h-3 bg-purple-100" 
              romantic={true}
            />
            <p className="text-xs text-purple-500/80 italic flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              Hoàn thành tất cả các phần để mở khóa hoàn toàn phần thưởng
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-heading font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Phần thưởng bí mật
            </h3>
            <div className="relative border-2 border-primary-light/50 rounded-lg overflow-hidden shadow-romantic">
              <div className="flex h-40 bg-primary-dark">
                {rewardSectionStatuses.map((isUnlocked, index) => (
                  <div 
                    key={orderedSectionIds[index]}
                    className={`flex items-center justify-center text-center transition-all duration-300
                      w-1/3 overflow-hidden relative
                      ${isUnlocked 
                        ? 'bg-primary-dark/80' 
                        : 'bg-primary-dark text-primary-light/50' 
                      }
                      ${index < orderedSectionIds.length - 1 ? 'border-r border-primary/30' : ''} 
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
                        <Lock className="w-7 h-7 mb-1 text-primary-light/40" />
                        <span className="text-sm font-medium block text-primary-light/60">Chưa mở khóa</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {!allRewardsUnlocked && (
                 <div className="absolute bottom-2 right-2 bg-gradient-romantic text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-romantic-sm">
                    {unlockedRewardCount}/{orderedSectionIds.length} đã mở khóa
                 </div>
              )}
              
              {allRewardsUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-romantic p-4">
                  <Gift className="w-14 h-14 text-accent animate-pulse-romantic mb-3 drop-shadow-lg" />
                  <p className="text-white font-heading font-bold text-xl text-center px-4 mb-4 drop-shadow-md">
                    Chúc mừng! Bạn đã mở khóa toàn bộ phần thưởng!
                  </p>
                  <Link href="/reward" onClick={() => onOpenChange(false)}>
                    <Button variant="gold" className="py-2.5 px-6 text-base shadow-romantic-lg">
                      Xem Thư & Phần Thưởng Đầy Đủ
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-heading font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Chi tiết các phần
            </h3>
            <div className="space-y-2 px-2 -mx-2 bg-purple-50/80 p-4 rounded-lg border border-purple-100">
              {allQuizSections.map((section) => {
                const status = progress.sections[section.id];
                const isCompleted = status?.completed || false;
                const highScoreAchieved = status?.highScoreAchieved || false;
                return (
                  <div key={section.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50/80 transition-all duration-200 border border-transparent hover:border-purple-100">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCompleted ? (highScoreAchieved ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-200 shadow-sm' : 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-200 shadow-sm') : 'bg-gradient-to-r from-purple-200 to-pink-200'}`}></div>
                    <div className="flex-1 text-sm font-medium text-purple-900">{section.title}</div>
                    {isCompleted ? (
                      highScoreAchieved ? (
                        <div className="text-xs font-medium px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full flex items-center gap-1 border border-purple-200 shadow-sm">
                          <CheckCircle className="w-3 h-3 text-purple-500" /> Đạt yêu cầu
                        </div>
                      ) : (
                        <div className="text-xs font-medium px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-full border border-amber-100 shadow-sm">
                          Hoàn thành (chưa đạt)
                        </div>
                      )
                    ) : (
                      <div className="text-xs font-medium px-2.5 py-1 bg-purple-50/80 text-purple-500 rounded-full border border-purple-100 shadow-sm">
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