
import React from 'react';

const AnalyzerLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <div className="flex space-x-2 justify-center mb-6">
        <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-1"></div>
        <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-2"></div>
        <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-3"></div>
        <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-4"></div>
        <div className="w-3 h-10 bg-orange-500/80 rounded-full animate-wave-5"></div>
      </div>
      <p className="text-gray-400 vhs-text animate-pulse" data-text="Analyzing audio characteristics...">
        Analyzing audio characteristics...
      </p>
    </div>
  );
};

export default AnalyzerLoading;
