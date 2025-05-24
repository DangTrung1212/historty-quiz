import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"; // Assuming ShadCN Dialog
import GachaWheel from './GachaWheel';
import RewardCard from './RewardCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Gift, RefreshCcw, X } from 'lucide-react';

interface GachaModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prizeSegments?: string[];
}

const LOCALSTORAGE_KEY = 'birthdayGachaPrize';

const GachaModal: React.FC<GachaModalProps> = ({
  isOpen,
  onOpenChange,
  prizeSegments = ['Knowledge', 'Love', 'Money'],
}) => {
  const [prizeWon, setPrizeWon] = useState<string | null>(null);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false); // To disable close while wheel spins
  const [isFirstSpin, setIsFirstSpin] = useState(true);
  const [savedPrize, setSavedPrize] = useState<string | null>(null);
  const [showRewardCard, setShowRewardCard] = useState(false);

  // Check localStorage for existing prize on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPrize = localStorage.getItem(LOCALSTORAGE_KEY);
      if (storedPrize) {
        setSavedPrize(storedPrize);
        setIsFirstSpin(false);
      }
    }
  }, []);

  const handleSpinEnd = (prize: string) => {
    setPrizeWon(prize);
    setIsWheelSpinning(false);
    
    // If this is the first spin, save the prize to localStorage
    if (isFirstSpin && (prize === 'Knowledge' || prize === 'Money')) {
      localStorage.setItem(LOCALSTORAGE_KEY, prize);
      setSavedPrize(prize);
      setIsFirstSpin(false);
    }
    
    // Show the reward card after a brief delay
    setTimeout(() => {
      setShowRewardCard(true);
    }, 1000);
  };

  const handleWheelSpinStart = () => {
    setPrizeWon(null); // Reset previous prize before new spin
    setIsWheelSpinning(true);
    setShowRewardCard(false);
  }

  const handleDialogClose = () => {
    if (isWheelSpinning) return; // Prevent closing while wheel is active
    setPrizeWon(null); // Reset prize when closing
    setShowRewardCard(false);
    onOpenChange(false);
  };
  
  // Reset functionality removed as per request
  // Users can re-spin but cannot reset their first reward

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 p-0 rounded-xl shadow-2xl border-none overflow-visible">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-2 text-yellow-400" />
              Vòng Quay May Mắn
              <Sparkles className="w-8 h-8 ml-2 text-yellow-400" />
            </DialogTitle>
            <DialogDescription className="text-center text-purple-700/90 mt-1">
              {!savedPrize && 'Quay vòng quay để nhận phần thưởng đặc biệt của bạn!'}
            </DialogDescription>
          </DialogHeader>
          
          {/* Show either the wheel or the reward card based on state */}
          {!showRewardCard ? (
            <div className="my-6 flex justify-center">
              <GachaWheel 
                segments={prizeSegments} 
                onSpinEnd={handleSpinEnd} 
                wheelSize={280}
                isFirstSpin={isFirstSpin}
              />
            </div>
          ) : (
            <div className="my-6">
              {prizeWon && (
                <RewardCard rewardType={prizeWon as 'Knowledge' | 'Love' | 'Money'} />
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => setShowRewardCard(false)}
                  variant="outline"
                  className="border-purple-400 text-purple-700 hover:bg-purple-200/70 font-semibold"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Quay Lại Vòng Quay
                </Button>
              </div>
            </div>
          )}

          {/* Show current spin result - styled as secondary and only shown for non-first spins */}
          {prizeWon && !showRewardCard && !isFirstSpin && (
            <motion.div 
              className="mt-6 text-center p-3 bg-gray-100 border border-gray-300 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <p className="text-sm font-medium text-gray-600">Kết quả quay thử:</p>
              <p className="text-lg font-semibold text-gray-700">{prizeWon}</p>
              <Button
                onClick={() => setShowRewardCard(true)}
                className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-1"
                size="sm"
                variant="ghost"
              >
                <Gift className="w-3 h-3 mr-1" />
                Xem
              </Button>
            </motion.div>
          )}
          
          {/* Show saved prize notification if exists - now below and more prominent */}
          {savedPrize && !showRewardCard && (
            <motion.div 
              className="mt-8 text-center p-5 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-bold text-purple-800 mb-2 flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                Phần Thưởng Chính Thức
              </h4>
              <p className="text-md text-purple-700 flex items-center justify-center font-medium">
                <Gift className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{savedPrize}</span>
              </p>
              <Button
                onClick={() => {
                  setPrizeWon(savedPrize);
                  setShowRewardCard(true);
                }}
                className="mt-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium"
                size="sm"
              >
                Xem Chi Tiết
              </Button>
            </motion.div>
          )}

          {/* Congratulations section removed to avoid duplication */}
        </div>

        {/* X button in the top-right corner */}
        <DialogClose asChild>
          <Button
            onClick={handleDialogClose}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            disabled={isWheelSpinning}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default GachaModal;
