
import React from 'react';
import SubLabelsPanel from './SubLabelsPanel';
import { useSampleContext } from '@/context/SampleContext';
import { toast } from 'sonner';

const SubLabelsButton: React.FC = () => {
  const { samples, showSubLabelsPanel, setShowSubLabelsPanel } = useSampleContext();
  
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (samples.length === 0) {
      toast.error("Please upload some audio samples first");
      return;
    }
    
    setShowSubLabelsPanel(true);
  };
  
  return (
    <>
      <button
        onClick={handleButtonClick}
        className="w-full px-6 py-5 mt-4 mb-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-colors border border-orange-500/50 hover:border-orange-400/70 focus:ring-2 focus:ring-orange-400/50 focus:outline-none shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        <div className="mr-3 w-7 h-7 bg-orange-700 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <span className="vhs-text text-lg" data-text="Audio Similarity Analysis">Audio Similarity Analysis</span>
      </button>
      
      {showSubLabelsPanel && <SubLabelsPanel />}
    </>
  );
};

export default SubLabelsButton;
