import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, BookOpen, Cake, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageTurningCardProps {
  message?: string;
  cardWidth?: string;
  cardHeight?: string;
  coverColor?: string;
  pageColor?: string;
  recipientName?: string;
  onGachaButtonClick?: () => void;
  hasReceivedReward?: boolean;
}

const PageTurningCard: React.FC<PageTurningCardProps> = ({
  message = 'Chúc mừng sinh nhật! Chúc bạn luôn vui vẻ, hạnh phúc và thành công trong cuộc sống.',
  cardWidth = '320px',
  cardHeight = '450px',
  coverColor = 'from-purple-600 to-pink-500',
  pageColor = 'from-purple-50 to-pink-50',
  recipientName = 'Bạn',
  onGachaButtonClick,
  hasReceivedReward = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleClick = () => {
    if (isAnimating || isFlipped) return;
    
    setIsAnimating(true);
    setIsFlipped(true);
    
    // Animation takes about 1s
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div 
      className="relative w-full max-w-full mx-auto overflow-visible shadow-romantic-lg"
      style={{ 
        width: isFlipped ? (isMobile ? '100%' : `calc(${cardWidth} * 2)`) : (isMobile ? '100%' : cardWidth),
        height: isFlipped ? (isMobile ? `min(90vh, ${cardHeight} * 1.8)` : cardHeight) : cardHeight,
        maxWidth: isFlipped ? (isMobile ? '100%' : `min(calc(${cardWidth} * 2), 90vw)`) : (isMobile ? '100%' : cardWidth),
        perspective: '1500px',
        transition: 'all 0.8s ease-in-out',
        margin: '0 auto'
      }}
    >
      {/* Book Cover (Closed State) */}
      <AnimatePresence>
        {!isFlipped && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${coverColor} flex flex-col items-center justify-center p-6 text-white cursor-pointer rounded-lg`}
            initial={{ rotateY: 0 }}
            exit={{ 
              rotateY: -180, 
              boxShadow: '10px 0px 15px rgba(0,0,0,0.2)'
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ 
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            }}
            onClick={handleClick}
          >
            <div className="relative mb-6">
              <BookOpen className="w-20 h-20 text-white/90" strokeWidth={1.5} />
              <motion.div 
                className="absolute -top-1 -right-1 bg-pink-300 rounded-full p-1 shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Heart className="w-6 h-6 text-white fill-white" />
              </motion.div>
            </div>
            
            <h3 className="text-2xl font-bold font-heading mb-3 text-center">Món Quà Đặc Biệt</h3>
            <p className="text-purple-200 text-center mb-6">Nhấn để mở</p>
            
            <div className="mt-4 border-2 border-white/30 rounded-full px-5 py-2 text-sm font-medium text-white/80 flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              <span>Mở xem</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Book Spread */}
      <AnimatePresence>
        {isFlipped && (
          <div className="absolute inset-0 flex flex-col md:flex-row w-full h-full">
            {/* Left Page (Back of Cover) */}
            <motion.div
              className="relative w-full md:w-1/2 h-1/2 md:h-full bg-white flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-r-none"
              initial={{ opacity: 0, y: isMobile ? 50 : 0, rotateY: isMobile ? 0 : 180 }}
              animate={{ opacity: 1, y: 0, rotateY: isMobile ? 0 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ 
                transformOrigin: isMobile ? 'center' : 'left center',
                transformStyle: 'preserve-3d',
                boxShadow: isMobile ? 'none' : 'inset -5px 0 10px rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col items-center justify-center overflow-auto">
                <div className="relative w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center">
                  <Heart className="w-10 h-10 text-pink-500 mb-4" />
                  <p className="text-base md:text-lg font-serif italic text-purple-600 leading-loose font-normal mb-4 max-w-[90%]">
                    Chúc mừng sinh nhật bạn!
                  </p>
                </div>
                
                {/* Floating hearts */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ 
                        x: `${Math.random() * 100}%`, 
                        y: '120%',
                        opacity: 0.7,
                        scale: Math.random() * 0.5 + 0.5
                      }}
                      animate={{ 
                        y: '-20%',
                        opacity: [0.7, 0.9, 0],
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: Math.random() * 10 + 10,
                        delay: Math.random() * 5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <Heart className="text-pink-400 w-6 h-6 fill-pink-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Book spine */}
              <div className="absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-r from-purple-200 to-purple-300 shadow-inner"></div>
            </motion.div>
            
            {/* Right Page (Message Image) */}
            <motion.div
              className="relative w-full md:w-1/2 h-1/2 md:h-full bg-white flex items-center justify-center rounded-b-lg md:rounded-r-lg md:rounded-l-none overflow-hidden"
              initial={{ opacity: 0, y: isMobile ? -50 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              style={{ 
                boxShadow: isMobile ? 'none' : 'inset 5px 0 10px rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col items-center justify-center overflow-auto">
                <div className="relative w-full h-full bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4 md:p-6 flex flex-col items-center justify-center text-center">
                  <Cake className="w-10 h-10 text-pink-500 mb-4" />
                  
                  <div className="text-base md:text-lg font-serif italic text-purple-600 leading-loose font-normal mb-4 max-w-[90%]">
                    {message.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-purple-500 font-light">21.05.2025</span>
                  </div>
                </div>
                
                {/* Floating hearts */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ 
                        x: `${Math.random() * 100}%`, 
                        y: '120%',
                        opacity: 0.7,
                        scale: Math.random() * 0.5 + 0.5
                      }}
                      animate={{ 
                        y: '-20%',
                        opacity: [0.7, 0.9, 0],
                        rotate: Math.random() * 360
                      }}
                      transition={{ 
                        duration: Math.random() * 10 + 10,
                        delay: Math.random() * 5,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    >
                      <Heart className="text-pink-400 w-6 h-6 fill-pink-400" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Page edge shadow */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-black/20 to-transparent"
                />
                
                {/* Gacha Button on Card */}
                {onGachaButtonClick && (
                  <div className="flex flex-col items-center">
                    <Button 
                      onClick={onGachaButtonClick}
                      className="mt-6 font-medium py-6 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    >
                      {hasReceivedReward ? (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Xem lại phần thưởng
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5 mr-2" />
                          Quay quà ngay
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageTurningCard;
