
import React from 'react';
import { toast } from 'sonner';

interface EmptyStateProps {
  analyzeSamples: () => void;
  categories: Array<{ id: string; name: string; selected: boolean }>;
  setShowSubLabelsPanel: (show: boolean) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ analyzeSamples, categories, setShowSubLabelsPanel }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-6">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
      <h3 className="text-2xl font-medium text-gray-400 mb-3">No Analysis Results</h3>
      <p className="text-gray-500 text-lg max-w-lg mb-4">
        {categories.some(cat => cat.selected) 
          ? "Upload audio samples and run the analysis to group them by sonic characteristics."
          : "Please select at least one category before running the analysis."}
      </p>
      {!categories.some(cat => cat.selected) && (
        <p className="text-orange-400 text-base mb-6">
          Go back to the main screen and select some categories first.
        </p>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (categories.some(cat => cat.selected)) {
            analyzeSamples();
          } else {
            toast.warning("Please select at least one category first");
            setShowSubLabelsPanel(false);
          }
        }}
        className="px-8 py-4 rounded-lg bg-orange-600/80 hover:bg-orange-500/80 text-white text-lg font-medium transition-colors"
      >
        {categories.some(cat => cat.selected) ? "Start Analysis" : "Go Back and Select Categories"}
      </button>
    </div>
  );
};

export default EmptyState;
