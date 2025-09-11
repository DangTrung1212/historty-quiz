import React from 'react';
import { useProgress } from '../contexts/ProgressContext';

// The order of sections
const orderedSectionIds = ['trac-nghiem-1', 'trac-nghiem-2', 'trac-nghiem-dung-sai'];

// Simple lock icon component
const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" />
  </svg>
);

export const ProgressWidget: React.FC = () => {
  const { progress } = useProgress();

  // Calculate how many sections are highly scored
  const sectionStatuses = orderedSectionIds.map(sectionId => {
    const sectionProg = progress[sectionId as keyof typeof progress]?.[0];
    return sectionProg?.highScoreAchieved || false;
  });
  
  const unlockedCount = sectionStatuses.filter(Boolean).length;
  const allUnlocked = unlockedCount === orderedSectionIds.length && orderedSectionIds.length > 0;

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white text-gray-800 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2 text-center text-blue-600">Tiến độ & Phần thưởng</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Tiến độ tổng quan: {unlockedCount}/{orderedSectionIds.length}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(unlockedCount / orderedSectionIds.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Phần thưởng bí mật:</h3>
        
        {/* 3-part horizontal grid */}
        <div className="relative border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
          <div className="flex h-32 bg-gray-800 text-white">
            {sectionStatuses.map((isUnlocked, index) => (
              <div 
                key={index}
                className={`flex items-center justify-center text-center transition-all duration-300
                  ${index === 0 ? 'w-1/3' : index === 1 ? 'w-1/3' : 'w-1/3'}
                  ${isUnlocked 
                    ? 'bg-gray-700' 
                    : 'bg-gray-900 text-gray-400'
                  }
                  ${index < orderedSectionIds.length - 1 ? 'border-r border-gray-600' : ''}
                `}
              >
                {isUnlocked ? (
                  <div className="p-2">
                    <span className="text-sm md:text-base font-bold block">
                      Đã mở khóa
                    </span>
                  </div>
                ) : (
                  <div className="p-2 flex flex-col items-center">
                    <LockIcon className="w-6 h-6 mb-1 text-gray-500" />
                    <span className="text-sm font-medium block text-gray-400">Chưa mở khóa</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Status overlay */}
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white py-1 px-3 rounded-tl-md font-bold">
            {unlockedCount}/{orderedSectionIds.length} đã mở khóa
          </div>
          
          {/* Full unlock message */}
          {allUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 bg-opacity-90">
              <p className="text-white font-bold text-xl text-center px-4">
                Chúc mừng! Bạn đã mở khóa toàn bộ phần thưởng!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 