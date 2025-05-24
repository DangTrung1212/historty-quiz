import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Book, Heart, Coins } from 'lucide-react'; // Import appropriate icons

interface GachaWheelProps {
  segments?: string[];
  onSpinEnd: (prize: string) => void;
  wheelSize?: number;
  defaultWinningSegment?: number; // For testing/deterministic outcome
  isFirstSpin?: boolean; // New prop to determine if this is the first spin
}

const GachaWheel: React.FC<GachaWheelProps> = ({
  segments = ['Knowledge', 'Love', 'Money'], // Default to our three values
  onSpinEnd,
  wheelSize = 300,
  defaultWinningSegment,
  isFirstSpin = true, // Default to true
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const numSegments = segments.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Calculate the new rotation (current rotation + multiple full rotations + offset to land on a segment)
    const spinDuration = 4.5; // seconds
    const fullRotations = 5; // Number of full rotations before stopping
    
    // If it's the first spin, we only allow Knowledge or Money (indices 0 or 2)
    // If not first spin, any segment can win
    let winningSegmentIndex;
    if (isFirstSpin) {
      // Only Knowledge (0) or Money (2) can win on first spin
      winningSegmentIndex = Math.random() < 0.5 ? 0 : 2;
    } else if (defaultWinningSegment !== undefined) {
      // For testing purposes
      winningSegmentIndex = defaultWinningSegment % numSegments;
    } else {
      // Any segment can win on subsequent spins
      winningSegmentIndex = Math.floor(Math.random() * numSegments);
    }
    
    const winningPrize = segments[winningSegmentIndex];
    
    // Calculate the final rotation for the wheel.
    // The pointer is static at the 12 o'clock position (top).
    // We want the middle of the winning segment to align with this pointer.
    // Angle of the middle of winningSegmentIndex (0 is right, angles CCW):
    const angleToMiddleOfWinningSegment = (winningSegmentIndex * segmentAngle) + (segmentAngle / 2);
    
    // The wheel's 'rotate' property increases CCW.
    // To bring 'angleToMiddleOfWinningSegment' to the top (270 deg or -90 deg from positive X-axis),
    // the wheel must rotate by: -(angleToMiddleOfWinningSegment) + 270 (or -90).
    // Let's use -90 for simplicity with CCW rotation.
    const currentRotation = rotation % 360;
    const targetRotation = rotation + (fullRotations * 360) + (270 - angleToMiddleOfWinningSegment - currentRotation);

    setRotation(targetRotation);

    // Call onSpinEnd after the animation completes
    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(winningPrize);
    }, spinDuration * 1000);
  };

  const radius = wheelSize / 2;
  const textDistanceFromCenter = radius * 0.75; // How far from center text is placed
  
  // Colors for each segment theme
  const segmentColors = [
    'bg-gradient-to-r from-blue-500 to-indigo-600', // Knowledge - blue/indigo
    'bg-gradient-to-r from-pink-500 to-rose-600',   // Love - pink/rose
    'bg-gradient-to-r from-yellow-500 to-amber-600' // Money - yellow/amber
  ];
  
  // Icons for each segment with matching colors
  const segmentIcons = [
    <Book className="w-6 h-6 text-blue-200" />,
    <Heart className="w-6 h-6 text-pink-200" />,
    <Coins className="w-6 h-6 text-yellow-200" />
  ];


  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: wheelSize, height: wheelSize }} ref={wheelRef}>
        {/* Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '-15px', // Adjusted to sit nicely above the wheel
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '30px solid #E74C3C', // A distinct red color for pointer
            zIndex: 10,
            filter: 'drop-shadow(0px 3px 3px rgba(0,0,0,0.3))'
          }}
        />

        <motion.div
          className="relative rounded-full border-4 border-gray-800 bg-gray-100 shadow-2xl overflow-hidden"
          style={{
            width: '100%',
            height: '100%',
          }}
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 4.5, 
            ease: "easeOut", // Use easeOut for natural deceleration
            // Start fast, then gradually slow down
            times: [0, 0.3, 0.5, 0.7, 0.9, 1],
            easings: ["easeIn", "easeIn", "easeOut", "easeOut", "easeOut", "easeOut"]
          }}
        >
          {segments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const middleAngleDeg = startAngle + segmentAngle / 2;
            const middleAngleRad = (middleAngleDeg * Math.PI) / 180;

            // Text position calculation
            const textX = radius + textDistanceFromCenter * Math.cos(middleAngleRad);
            const textY = radius + textDistanceFromCenter * Math.sin(middleAngleRad);
            
            return (
              <React.Fragment key={index}>
                {/* Segment visual with gradient background */}
                <div 
                  className={`absolute ${segmentColors[index]}`}
                  style={{
                    width: wheelSize,
                    height: wheelSize,
                    borderRadius: '50%',
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(startAngle * Math.PI/180)}% ${50 + 50 * Math.sin(startAngle * Math.PI/180)}%, ${50 + 50 * Math.cos(endAngle * Math.PI/180)}% ${50 + 50 * Math.sin(endAngle * Math.PI/180)}%)`,
                    transformOrigin: 'center center',
                  }}
                />

                {/* Segment Divider Lines */}
                <div
                  className="absolute bg-white"
                  style={{
                    width: radius, 
                    height: '3px', 
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'left center',
                    transform: `translateY(-1px) rotate(${startAngle}deg)`,
                    zIndex: 1,
                    boxShadow: '0px 0px 5px rgba(0,0,0,0.3)'
                  }}
                />

                {/* Prize Text and Icon on the Edge */}
                <div
                  className={`absolute font-bold text-base sm:text-lg pointer-events-none flex flex-col items-center justify-center ${index === 0 ? 'text-blue-200' : index === 1 ? 'text-pink-200' : 'text-yellow-200'}`}
                  style={{
                    left: `${textX}px`,
                    top: `${textY}px`,
                    transform: `translate(-50%, -50%) rotate(${middleAngleDeg + 90}deg)`,
                    transformOrigin: 'center',
                    zIndex: 5,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
                  }}
                >
                  {segmentIcons[index]}
                  <span className="mt-1 font-semibold">{segment}</span>
                </div>
              </React.Fragment>
            );
          })}
        </motion.div>
      </div>
      <Button onClick={handleSpin} disabled={isSpinning} className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
        {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL!'}
      </Button>
    </div>
  );
};

export default GachaWheel;
