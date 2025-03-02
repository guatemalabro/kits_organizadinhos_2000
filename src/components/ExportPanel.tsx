
import React from 'react';
import { useSampleContext } from '@/context/SampleContext';

const ExportPanel: React.FC = () => {
  const { 
    samples, 
    isExporting, 
    exportSamples, 
    resetAll, 
    categories,
    getCategoryCount
  } = useSampleContext();

  if (samples.length === 0) {
    return null;
  }

  // Get selected categories
  const selectedCategories = categories.filter(cat => cat.selected);
  
  // Calculate total samples to export and samples per category using getCategoryCount
  const totalToExport = selectedCategories.reduce(
    (sum, category) => sum + getCategoryCount(category.id), 
    0
  );

  return (
    <div className="w-full border rounded-xl p-8 bg-zinc-900/80 border-gray-700/30 animate-fade-in shadow-[0_0_30px_rgba(20,20,20,0.5)] backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-400 glitch-text" data-text="Export Selected Samples">Export Selected Samples</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {selectedCategories.map(category => {
          // Get accurate count for this category
          const categoryCount = getCategoryCount(category.id);
          if (categoryCount === 0) return null;
          
          return (
            <div key={category.id} className="bg-zinc-800/80 border border-gray-700/30 rounded-lg p-4 text-center hover:border-gray-600/60 hover:bg-gray-800/30 transition-all shadow-md">
              <h4 className="font-semibold text-gray-400 mb-1 vhs-text" data-text={category.name}>{category.name}</h4>
              <p className="text-gray-500/90 text-sm">{categoryCount} samples</p>
            </div>
          );
        })}
      </div>
      
      {totalToExport > 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-center text-gray-400/80 vhs-text" data-text={`${totalToExport} ${totalToExport === 1 ? 'sample' : 'samples'} will be exported`}>
            {totalToExport === 1 
              ? '1 sample will be exported' 
              : `${totalToExport} samples will be exported`}
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={exportSamples}
              disabled={isExporting}
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-ring shadow-[0_0_15px_rgba(100,100,100,0.3)] hover:shadow-[0_0_20px_rgba(150,150,150,0.5)] vhs-glow"
            >
              {isExporting ? 'Creating ZIP...' : 'Export as ZIP'}
            </button>
            
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 font-medium transition-colors focus-ring border border-gray-700/30 hover:border-gray-600/60"
            >
              Reset All
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400/70">No samples selected for export</p>
      )}
    </div>
  );
};

export default ExportPanel;
