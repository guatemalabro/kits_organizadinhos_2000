
import React from 'react';

interface ActionButtonsProps {
  exportGroups: () => void;
  analyzeSamples: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ exportGroups, analyzeSamples }) => {
  return (
    <div className="flex flex-col space-y-4 mt-8">
      <button
        onClick={(e) => {
          e.stopPropagation();
          exportGroups();
        }}
        className="w-full py-5 md:py-6 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xl font-medium transition-colors border border-orange-500/30 hover:border-orange-400/60 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      >
        Export All Grouped Samples
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          analyzeSamples();
        }}
        className="w-full py-4 md:py-5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700/50"
      >
        Re-analyze Samples
      </button>
    </div>
  );
};

export default ActionButtons;
