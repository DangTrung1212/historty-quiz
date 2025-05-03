import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QuizSection } from '@/lib/quiz-data';

interface ProgressContextType {
  completedSections: number;
  previousRevealLevel: number;
  personalLetter: string;
  getImageRevealLevel: (sections: QuizSection[]) => number;
  allSectionsCompleted: (sections: QuizSection[]) => boolean;
  setCompletedSections: React.Dispatch<React.SetStateAction<number>>;
  setPreviousRevealLevel: React.Dispatch<React.SetStateAction<number>>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedSections, setCompletedSections] = useState(0);
  const [previousRevealLevel, setPreviousRevealLevel] = useState(0);
  const [personalLetter] = useState(`Gửi bạn,

Chúc mừng bạn đã hoàn thành thành công tất cả các phần thi lịch sử! Đây không chỉ là kiến thức để chuẩn bị cho kỳ thi THPT Quốc gia, mà còn là hành trang giúp bạn hiểu sâu sắc hơn về lịch sử dân tộc và thế giới.

Mỗi sự kiện trong lịch sử đều có những bài học quý giá, và việc bạn dành thời gian nghiêm túc học tập như vậy thực sự đáng ngưỡng mộ. Hi vọng những điều bạn học được sẽ không chỉ giúp bạn trong kỳ thi sắp tới mà còn theo bạn trên mọi chặng đường trong tương lai.

Chúc bạn đạt được kết quả cao nhất trong kỳ thi!

Trân trọng`);

  const calculateRevealLevel = (sectionsArr: QuizSection[]) => {
    const completed = sectionsArr.filter(s => s.completed && s.score >= 90).length;
    return Math.min(completed * 25, 100);
  };

  const getImageRevealLevel = useCallback((sections: QuizSection[]) => {
    return calculateRevealLevel(sections);
  }, []);

  const allSectionsCompleted = useCallback((sections: QuizSection[]) => {
    return sections.every(section => section.completed && section.score >= 90);
  }, []);

  const value = {
    completedSections,
    previousRevealLevel,
    personalLetter,
    getImageRevealLevel,
    allSectionsCompleted,
    setCompletedSections,
    setPreviousRevealLevel
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 