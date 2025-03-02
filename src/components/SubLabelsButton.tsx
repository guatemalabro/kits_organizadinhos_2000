
import React, { useState } from 'react';
import SubLabelsPanel from './SubLabelsPanel';

const SubLabelsButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className="w-full px-4 py-3 mt-6 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-gray-400 font-medium transition-colors border border-zinc-700/30 hover:border-zinc-600/60 focus-ring shadow-md hover:shadow-lg vhs-border flex items-center justify-center"
      >
        <div className="mr-2 w-5 h-5 bg-zinc-700 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="vhs-text" data-text="Audio Similarity Grouping">Audio Similarity Grouping</span>
      </button>
      
      <SubLabelsPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
      />
    </>
  );
};

export default SubLabelsButton;
