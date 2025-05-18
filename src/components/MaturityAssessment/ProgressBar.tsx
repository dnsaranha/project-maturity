
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div 
        className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      />
      <div className="text-center text-sm mt-1 text-gray-600">
        {progress}% completo
      </div>
    </div>
  );
};

export default ProgressBar;
