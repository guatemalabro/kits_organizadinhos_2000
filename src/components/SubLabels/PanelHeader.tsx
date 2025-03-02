
import React from 'react';

interface PanelHeaderProps {
  handleCloseClick: () => void;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ handleCloseClick }) => {
  return (
    <div className="p-5 md:p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
      <h2 className="text-2xl md:text-3xl font-bold text-orange-400 vhs-text" data-text="Audio Similarity Analysis">
        Audio Similarity Analysis
      </h2>
      <button 
        onClick={handleCloseClick}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default PanelHeader;
