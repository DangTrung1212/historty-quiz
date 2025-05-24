import React from 'react';
import { motion } from 'framer-motion';
import { Book, Heart, Coins, Gift } from 'lucide-react';

interface RewardCardProps {
  rewardType: 'Knowledge' | 'Love' | 'Money';
}

const RewardCard: React.FC<RewardCardProps> = ({ rewardType }) => {
  // Define content based on reward type
  const rewardContent = {
    Knowledge: {
      title: 'Sách Yêu Thích',
      description: 'Món quà tri thức đặc biệt dành cho bạn - một cuốn sách mà bạn sẽ rất thích!',
      icon: <Book className="w-12 h-12 text-blue-500" />,
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-800'
    },
    Money: {
      title: '200.000 VND',
      description: 'Một món quà nhỏ để bạn có thể tự thưởng cho mình điều gì đó đặc biệt.',
      icon: <Coins className="w-12 h-12 text-yellow-500" />,
      bgColor: 'bg-gradient-to-br from-yellow-100 to-amber-100',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-800'
    },
    Love: {
      title: 'Lời Tỏ Tình',
      description: 'Đôi khi những cảm xúc chân thành là món quà quý giá nhất...',
      icon: <Heart className="w-12 h-12 text-pink-500" />,
      bgColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
      borderColor: 'border-pink-300',
      textColor: 'text-pink-800'
    }
  };

  const content = rewardContent[rewardType];

  return (
    <motion.div
      className={`p-4 rounded-xl shadow-lg border-2 ${content.borderColor} ${content.bgColor} max-w-md mx-auto`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`p-4 rounded-full ${content.bgColor} border ${content.borderColor} mb-4 shadow-inner`}>
          {content.icon}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${content.textColor}`}>{content.title}</h3>
        <p className="text-gray-700 mb-4">{content.description}</p>
        
        <div className="mt-2 flex items-center justify-center">
          <Gift className="w-5 h-5 text-purple-500 mr-2" />
          <span className="text-sm text-purple-600 font-medium">Phần thưởng đặc biệt</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RewardCard;