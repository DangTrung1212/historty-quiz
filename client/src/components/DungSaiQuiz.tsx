import React, { useState } from 'react';

// Example props, replace with your actual data structure as needed
type Statement = {
  id: string;
  label: string;
};

type DungSaiQuizProps = {
  passage: string;
  statements: Statement[];
  currentQuestion: number;
  totalQuestions: number;
  onBack: () => void;
  onNext: (answers: Record<string, 'Đúng' | 'Sai'>) => void;
  isLast: boolean;
};

const DungSaiQuiz: React.FC<DungSaiQuizProps> = ({
  passage,
  statements,
  currentQuestion,
  totalQuestions,
  onBack,
  onNext,
  isLast,
}) => {
  const [answers, setAnswers] = useState<Record<string, 'Đúng' | 'Sai'>>({});

  const handleSelect = (statementId: string, value: 'Đúng' | 'Sai') => {
    setAnswers((prev) => ({ ...prev, [statementId]: value }));
  };

  const handleNext = () => {
    onNext(answers);
  };

  // Check if all statements have been answered
  const allAnswered = statements.every(s => answers[s.id]);

  return (
    <div className="container max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <button
          className="text-blue-600 font-medium"
          onClick={onBack}
        >
          &larr; Quay lại
        </button>
        <h1 className="text-xl font-bold text-gray-800">Trắc Nghiệm Đúng Sai</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-2">
            ← [Q{currentQuestion}/{totalQuestions}] →
          </span>
        </div>
      </div>

      {/* Passage */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 max-h-40 overflow-y-auto">
        <strong className="text-gray-700 block mb-2">Tư liệu:</strong>
        <p className="text-sm text-gray-600 leading-relaxed">{passage}</p>
      </div>

      {/* Statements */}
      <div className="space-y-5">
        {statements.map((statement, idx) => (
          <div className="statement space-y-2" key={statement.id}>
            <p className="text-gray-800">
              {String.fromCharCode(97 + idx)}. {statement.label}
            </p>
            <div className="flex gap-3">
              {(['Đúng', 'Sai'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(statement.id, option)}
                  className={`option-btn flex-1 py-2 px-4 border rounded-md text-sm font-medium transition
                    ${answers[statement.id] === option
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Button at the bottom */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleNext}
          disabled={!allAnswered}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLast ? 'NỘP BÀI' : 'TIẾP THEO'}
        </button>
      </div>
    </div>
  );
};

export default DungSaiQuiz; 